import express from 'express'
import authRoutes from "./routes/routes";
import adminRoutes from "./routes/adminRoutes";
import cors from 'cors'


const app = express()
const PORT = process.env.PORT || 3000

// Cho phép frontend gọi API
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

// middleware để parse JSON body
app.use(express.json())

// Cài đặt route
app.get('/ping', (req, res) => {
    res.send('pong');
});

app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)

const server = app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Lỗi: Cổng ${PORT} đã bị chiếm bởi tiến trình khác! Hãy diệt tiến trình cũ trên port ${PORT}.`);
    } else {
        console.error(`❌ Lỗi server:`, err);
    }
});
 