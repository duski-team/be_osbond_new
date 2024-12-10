import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { createServer } from 'http'
import routing from './index.js'


dotenv.config({ path: '.env' })
const app = express()

const server = createServer(app)
app.use(morgan('dev'))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('asset/file/'));

app.use('/', routing);
app.use((req, res, next) => {
    res.status(200).json({ status: '404', message: "gagal, tidak ada endpoint" });
})

const port = process.env.PORT || 8080
server.listen(port, () => {
    console.log(`telah tersambung pada port : ${port}`)
});
