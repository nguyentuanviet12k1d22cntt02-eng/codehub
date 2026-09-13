import requests

res = requests.post("http://localhost:3000/api/auth/compiler/run", json={
    "code": "console.log('JS Sandbox Active! Result:', 15 + 27);",
    "language": "JAVASCRIPT",
    "input": ""
})
print("Status:", res.status_code)
print("Output:", res.json())
