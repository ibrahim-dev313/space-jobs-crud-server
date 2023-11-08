const express = require('express');
const cors = require('cors');

require('dotenv').config()
const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.50cvwuz.mongodb.net/?retryWrites=true&w=majority`;


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
        const appliedjobsCollection = client.db('job-website').collection('applied-jobs')

        //all job api
        app.get("/jobs", async (req, res) => {
            const result = await jobCollection.find().toArray();
            res.send(result);
        });


        //single job apis
        app.post('/job', async (req, res) => {
            const job = req.body;
            const result = await jobCollection.insertOne(job)
            console.log(result);
            res.send(result)
        })
        app.get("/job/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id),
            };
            const result = await jobCollection.findOne(query);
            console.log(result);
            res.send(result);
        });
        app.delete("/job/:id", async (req, res) => {
            const id = req.params.id;
            console.log("delete", id);
            const query = {
                _id: new ObjectId(id),
            };
            const result = await jobCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        });
        app.put("/job/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("id", id, data);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedJob = {
                $set: {
                    pictureURL: data.pictureURL,
                    jobTitle: data.jobTitle,
                    postedByEmail: data.postedByEmail,
                    postedByName: data.postedByName,
                    jobCategory: data.jobCategory,
                    salaryRange: data.salaryRange,
                    jobDescription: data.jobDescription,
                    jobPostingDate: data.jobPostingDate,
                    applicationDeadline: data.newApplicationDeadline,
                    jobApplicants: data.jobApplicants

                },
            };

            const result = await jobCollection.updateOne(filter, updatedJob, options);
            res.send(result);

        });
        app.patch("/job/:id", async (req, res) => {
            const jobId = req.params.id;
            const { increment } = req.body;
            console.log(increment);
            const filter = { _id: new ObjectId(jobId) };
            try {

                const update = { $inc: { jobApplicants: 1 } };

                const result = await jobCollection.updateOne(filter, update);

                res.send(result)
            } catch (error) {
                console.error(error);
            }
        });


        //appliedjobs
        app.post('/applied-job', async (req, res) => {
            const appliedJob = req.body;
            console.log(appliedJob);

            const result = await appliedjobsCollection.insertOne(appliedJob)
            console.log(result);
            res.send(result)
        })
        app.get("/applied-jobs", async (req, res) => {
            const result = await appliedjobsCollection.find().toArray();
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
