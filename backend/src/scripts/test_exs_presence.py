with open(r"d:\Project\LearnPython\backend\src\prisma\exercises_data.ts", "r", encoding="utf-8") as f:
    text = f.read()

for k in ['LS-02.MP', 'LS-03.MP', 'LS-04.MP', 'LS-05.MP', 'LS-06.MP', 'LS-07.MP', 'LS-08.MP']:
    pos = text.find(f"'{k}':")
    print(f"Key {k}: pos = {pos}")
    if pos != -1:
        # In 100 ky tu tu pos
        print(text[pos:pos+300])
        print("="*40)
