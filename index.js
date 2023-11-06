const express = require('express');
const cors = require('cors');

require('dotenv').config
const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://mi13572018:2062Ak47@cluster0.50cvwuz.mongodb.net/?retryWrites=true&w=majority";


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
        // Send a ping to confirm a successful connection
        const jobCollection = client.db('job-website').collection('job')
        app.post('/job', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job)
            console.log(result);
            res.send(result)
        })
        app.get("/job", async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        });














        await client.db("admin").command({ ping: 1 });
        console.log("Pinged MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})
