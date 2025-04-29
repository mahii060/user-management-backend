import express from "express"
import cors from "cors"

const app = express()
const port = process.env.port || 5000;

// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('User management service is running')
})

app.listen(port, () => {
    console.log(`User Management server is running on port ${port}`)
})
