import express from 'express'
import authRoutes from "./routes/routes";
import cors from 'cors'


const app = express()
const PORT = process.env.PORT || 3000

// Cho phép frontend gọi API
app.use(cors({
    origin: 'http://localhost:5173', // Port mặc định của Vite
    credentials: true
}))

// middleware để parse JSON body
app.use(express.json())

// Cài đặt route
app.use('/api/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
}) 