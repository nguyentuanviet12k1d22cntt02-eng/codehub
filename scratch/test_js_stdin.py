import requests

code_with_input = """
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim().split(/\\s+/);
const a = parseInt(input[0], 10);
const b = parseInt(input[1], 10);
console.log('Tong:', a + b);
"""

res = requests.post("http://localhost:3000/api/auth/compiler/run", json={
    "code": code_with_input,
    "language": "JAVASCRIPT",
    "input": "15 27"
})
print("Status:", res.status_code)
print("Output:", res.json())
