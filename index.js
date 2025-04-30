import express from "express"
import cors from "cors"
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb"
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const port = process.env.port || 5000;


// middleware
app.use(cors())
app.use(express.json())



const uri = process.env.DB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("usersDB")
        const users = database.collection("users");

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await users.insertOne(user)
            res.send(result)
            // console.log(user);
        })

        app.get('/users', async (req, res) => {
            // const result = await users.find().toArray()
            res.send(await users.find().toArray())
        })

        app.patch('/users', async (req, res) => {
            const email = req.body.email;
            const filter = { email }
            const updatedUser = {
                $set: {
                    lastSignInTime: req.body.lastSignInTime,
                }
            }
            const result = await users.updateOne(filter, updatedUser)
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await users.deleteOne(query)
            res.send(result)
            // console.log("delete id", id);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('User management service is running')
})

app.listen(port, () => {
    console.log(`User Management server is running on port ${port}`)
})
