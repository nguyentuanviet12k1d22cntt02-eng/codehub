import json
import os

def main():
    json_path = os.path.join("backend", "src", "prisma", "exercises_data.json")
    if not os.path.exists(json_path):
        print("JSON data not found")
        return
        
    with open(json_path, 'r', encoding='utf-8') as f:
        exercises_map = json.load(f)
        
    # Find which key contains "Đếm ký tự duy nhất"
    target_lesson = None
    for lesson_id, exercises in exercises_map.items():
        for ex in exercises:
            if ex.get("title") == "Đếm ký tự duy nhất":
                target_lesson = lesson_id
                break
        if target_lesson:
            break
            
    if not target_lesson:
        print("Could not find the 'Set' lesson key!")
        return
        
    print(f"Set lesson key is: {target_lesson}")
    print("Exercises under this lesson:")
    for ex in exercises_map[target_lesson]:
        title = ex.get("title")
        difficulty = ex.get("difficulty")
        tcs = ex.get("testCases", [])
        print(f"  - Title: {title} ({difficulty})")
        print(f"    Total Testcases: {len(tcs)}")
        for idx, tc in enumerate(tcs):
            print(f"      [{idx}] Input: {repr(tc.get('input'))} -> Expected: {repr(tc.get('expectedOutput'))}")

if __name__ == '__main__':
    main()
