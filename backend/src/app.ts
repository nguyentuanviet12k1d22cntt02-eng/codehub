import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import practiceRoutes from './routes/practiceRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000

// Cho phép frontend gọi API
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true
}))

// middleware để parse JSON body
app.use(express.json())

// Cài đặt API routes tiêu chuẩn (RESTful standard)
app.use('/api/auth', authRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/exercises', exerciseRoutes)
app.use('/api/practice', practiceRoutes)
app.use('/api/recommendations', recommendationRoutes)

// Hỗ trợ tương thích ngược (Backward-compatibility)
// Cho phép gọi toàn bộ API cũ qua tiền tố /api/auth/... như trước
app.use('/api/auth', courseRoutes)
app.use('/api/auth', exerciseRoutes)
app.use('/api/auth', practiceRoutes)
app.use('/api/auth', recommendationRoutes)

// Cài đặt route admin
app.use('/api/admin', adminRoutes)

app.get('/ping', (req, res) => {
    res.send('pong');
});

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
