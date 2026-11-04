"""Runs only inside the remote Docker sandbox. Never import/execute learner code in the parent."""
import json
import os
from pathlib import Path
import re
import stat
import subprocess
import sys
import tempfile

LIMIT = 128000

def checked_files(value):
    if not isinstance(value, dict) or len(value) > 8:
        raise ValueError('INVALID_FILES')
    for name, content in value.items():
        if not isinstance(name, str) or len(name) > 64 or not re.fullmatch(r'[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)+', name):
            raise ValueError('INVALID_PATH')
        if not isinstance(content, str) or len(content.encode('utf-8')) > 16000:
            raise ValueError('INVALID_CONTENT')
    return value

def read_regular(path):
    mode = path.lstat().st_mode
    if not stat.S_ISREG(mode) or path.is_symlink() or path.stat().st_size > 16000:
        raise ValueError('INVALID_ARTIFACT')
    with path.open('rb') as f:
        return f.read(16001)

def main():
    payload = json.loads(sys.stdin.buffer.read(65537).decode('utf-8'))
    case = payload['fileCase']
    if set(case) != {'__pythonFileCase', 'stdin', 'files', 'expectedFiles', 'preserveInputFiles'} or case['__pythonFileCase'] != '1.0' or case['preserveInputFiles'] is not True:
        raise ValueError('INVALID_CASE')
    fixtures = checked_files(case['files']); expected = checked_files(case['expectedFiles'])
    if not isinstance(case['stdin'], str) or len(case['stdin'].encode('utf-8')) > 16000:
        raise ValueError('INVALID_STDIN')
    if sum(len(s.encode('utf-8')) for d in (fixtures, expected) for s in d.values()) + len(case['stdin'].encode('utf-8')) > 48000:
        raise ValueError('CASE_TOO_LARGE')
    timeout = float(payload['timeoutSeconds'])
    if not .1 <= timeout <= 9.5 or not isinstance(payload['code'], str):
        raise ValueError('INVALID_PAYLOAD')
    # A new directory per case also prevents state crossing inside an accidental multi-input request.
    with tempfile.TemporaryDirectory(prefix='python-file-case-') as directory:
        base = Path(directory); work = base / 'work'; work.mkdir()
        program = base / 'student.py'; program.write_text(payload['code'], encoding='utf-8')
        for name, content in fixtures.items():
            (work / name).write_bytes(content.encode('utf-8'))
        with (base / 'stdout').open('w+b') as stdout, (base / 'stderr').open('w+b') as stderr:
            try:
                child = subprocess.run([sys.executable, '-I', '-B', str(program)], cwd=work,
                    input=case['stdin'].encode('utf-8'), stdout=stdout, stderr=stderr, timeout=timeout, check=False)
            except subprocess.TimeoutExpired:
                raise ValueError('FILE_PROGRAM_TIMEOUT')
            stdout.seek(0); stderr.seek(0); output=stdout.read(LIMIT+1); errors=stderr.read(LIMIT+1)
        if len(output) > LIMIT or len(errors) > LIMIT:
            raise ValueError('FILE_PROGRAM_OUTPUT_LIMIT')
        sys.stdout.buffer.write(output); sys.stdout.buffer.flush()
        if errors:
            sys.stderr.buffer.write(errors); sys.stderr.buffer.flush()
        if child.returncode:
            raise ValueError('FILE_PROGRAM_FAILED')
        for name, content in expected.items():
            if read_regular(work / name) != content.encode('utf-8'):
                raise ValueError('FILE_ARTIFACT_MISMATCH:' + name)
        for name, content in fixtures.items():
            if name not in expected and read_regular(work / name) != content.encode('utf-8'):
                raise ValueError('INPUT_FIXTURE_CHANGED:' + name)

if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, TypeError, OSError, UnicodeError) as exc:
        sys.stderr.write('File testcase failed: ' + str(exc)[:160] + '\n')
        sys.exit(1)
