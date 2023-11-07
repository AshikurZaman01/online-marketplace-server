const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Iber server is running')
})

app.listen(port, () => {
    console.log(`Iber Server is running on port ${port}`)
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Iber:Qlc5jPZbeAIf121w@cluster0.q0gttvx.mongodb.net/?retryWrites=true&w=majority";

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

        // DB Name
        const IberCollection = client.db("Iber").collection("jobs");

        // DB Name
        const categoryCollection2 = client.db("Iber").collection("categories");

        // get category data
        app.get('/categories', async (req, res) => {
            const categories = await categoryCollection2.find().toArray();
            res.send(categories);
            console.log(categories);
        })
        // get category data end


        // get jobs data
        app.get('/jobs', async (req, res) => {
            const jobs = await IberCollection.find().toArray();
            res.send(jobs);
            console.log(jobs);
        })
        // get jobs data end


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
