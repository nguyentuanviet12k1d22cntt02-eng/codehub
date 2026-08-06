import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import exerciseRoutes from './routes/exerciseRoutes';
import practiceRoutes from './routes/practiceRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import adminRoutes from "./routes/adminRoutes";
import learningPathRoutes from './routes/learningPathRoutes';

dotenv.config();

const app = express()
const PORT = Number(process.env.PORT) || 3000

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
app.use('/api/learning-path', learningPathRoutes)

// Hỗ trợ tương thích ngược (Backward-compatibility)
app.use('/api/auth', courseRoutes)
app.use('/api/auth', exerciseRoutes)
app.use('/api/auth', practiceRoutes)
app.use('/api/auth', recommendationRoutes)

// Cài đặt route admin
app.use('/api/admin', adminRoutes)

app.get('/ping', (req, res) => {
    res.send('pong');
});

let server: any = null;
let retryCount = 0;
const MAX_RETRIES = 3;

const startServer = (port: number) => {
    server = app.listen(port);

    server.on('listening', () => {
        retryCount = 0;
        console.log(`🚀 Express Backend Server đang chạy thành công tại http://localhost:${port}`);
    });

    server.on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
            retryCount++;
            if (retryCount <= MAX_RETRIES) {
                console.warn(`⚠️ Cổng ${port} đang bận. Đang thử lại (${retryCount}/${MAX_RETRIES})...`);
                setTimeout(() => {
                    try { server.close(); } catch (e) {}
                    startServer(port);
                }, 1000);
            } else {
                console.error(`❌ Cổng ${port} đã bị chiếm bởi một tiến trình khác chạy ngầm. Hãy tắt tiến trình cũ.`);
            }
        } else {
            console.error(`❌ Lỗi server:`, err);
        }
    });
};

startServer(PORT);

process.on('SIGINT', () => {
    if (server) server.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    if (server) server.close();
    process.exit(0);
});
