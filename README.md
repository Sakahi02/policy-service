# Policy Service (Style C - human-like)

Quick notes:
- This is a small Node.js + Express + MongoDB app.

.env: copy .env.example to .env and set MONGO_URI, PORT

Install:
```
npm install
npm run dev
```

APIs:

1) Upload file (multipart form-data)
POST /api/upload/file
field: file (attach .xlsx or .csv)
curl example:
curl -X POST http://localhost:3000/api/upload/file -F "file=@/path/to/file.xlsx"

2) Search policy by username/email
GET /api/policy/search?q=Sakshi
curl:
curl "http://localhost:3000/api/policy/search?q=Sakshi"

3) Aggregate policies per user
GET /api/policy/aggregate
curl:
curl "http://localhost:3000/api/policy/aggregate"

4) Schedule message
POST /api/schedule/create
body json: { "message": "hi", "day": "2025-12-15", "time": "13:30" }
curl:
curl -X POST http://localhost:3000/api/schedule/create -H 'Content-Type: application/json' -d '{"message":"hi","day":"2025-12-15","time":"13:30"}'

Notes to teacher:
- Worker thread used to avoid blocking upload parsing
- CPU monitor exits on threshold to let PM2/systemd restart it
- Some TODOs left intentionally to show work-in-progress
