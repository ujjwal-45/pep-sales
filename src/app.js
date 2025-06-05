import express from 'express'
import notificationRouter from './routes/notification.js'

const app = express()
app.use(express.json())
app.use("/notifications", notificationRouter);

export default app;