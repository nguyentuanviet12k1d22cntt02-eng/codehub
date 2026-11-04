import { createHash } from 'crypto';
import replacement from '../../content/candidate-content-t19-ascii.json';

const canonical = (value: any): any => Array.isArray(value) ? value.map(canonical)
    : value && typeof value === 'object'
        ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
export function versionedArtifactHash(value: any): string {
    const { artifact_hash, ...body } = value;
    return createHash('sha256').update(JSON.stringify(canonical(body))).digest('hex');
}
export function reviewedLessonTheory(exerciseId: string): {theoryContent: string; contentVersion: string} | null {
    return exerciseId === replacement.exercise_id ? {theoryContent: replacement.theoryContent,
        contentVersion: replacement.content_version.version} : null;
}
/** Select a reviewed version for new grading; never UPDATE generation history. */
export function effectiveArtifact(raw: any): any {
    if (raw?.exercise_id !== replacement.exercise_id || raw?.trace_id !== replacement.trace_id) return raw;
    const candidateHash = versionedArtifactHash(replacement);
    if (candidateHash !== replacement.artifact_hash) throw new Error('CONTENT_VERSION_INTEGRITY_FAILED');
    const actualHash = versionedArtifactHash(raw);
    if (actualHash === candidateHash) return raw;
    // The historical stored artifact_hash is opaque; pin the full observed parent bytes independently.
    const parentCanonicalHash = createHash("sha256").update(JSON.stringify(canonical(raw))).digest("hex");
    if (raw.artifact_hash !== replacement.content_version.parent_artifact_hash ||
        parentCanonicalHash !== "cac9ac2ceed133f4093bf4a4c7d6bac0d6e32eeb3e1c94cd64c8c67c7ade4837")
        throw new Error('CONTENT_VERSION_SOURCE_MISMATCH');
    return JSON.parse(JSON.stringify(replacement));
}
