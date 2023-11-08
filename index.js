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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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


        // get specific jobs Data by email
        app.get('/jobs', async (req, res) => {

            let query = {};
            const email = req.query.email;

            if (email) {
                query.email = email;
            }

            const job = await IberCollection.find(query).toArray();
            res.send(job)
            console.log(job)
        }
        )
        // get specific jobs Data by email end


        // get jobs data
        app.get('/jobs', async (req, res) => {
            const jobs = await IberCollection.find().toArray();
            res.send(jobs);
            console.log(jobs);
        })
        // get jobs data end

        // post jobs data
        app.post('/jobs', async (req, res) => {
            const job = req.body;
            const result = await IberCollection.insertOne(job);
            res.send(result);
            console.log(result);
        })
        // post jobs data end

        // Delete jobs data
        app.delete('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const result = await IberCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
            console.log(result);
        })
        // Delete jobs data end

        // Patch jobs data
        app.patch('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const result = await IberCollection.updateOne({ _id: new ObjectId(id) }, { $set: data });
            res.send(result);
            console.log(result);
        })
        // Patch jobs data end

        // get  jobs data by id
        app.get('/jobs/:id', async (req, res) => {
            const id = req.params.id;
            const job = await IberCollection.findOne({ _id: new ObjectId(id) });
            res.send(job);
            console.log(job);
        })
        // get data end




        // DB Collection
        const bidsCollection = client.db("Iber").collection("bids");

        // post bid Data
        app.post('/bids', async (req, res) => {
            const bid = req.body;
            const result = await bidsCollection.insertOne(bid);
            res.send(result);
            console.log(result);
        })
        // post bid Data☻ end

        // get specific bids Data by email
        app.get('/bids', async (req, res) => {

            let query = {};
            const auther_email = req.query.auther_email;

            if (auther_email) {
                query.auther_email = auther_email
            }

            const result = await bidsCollection.find(query).toArray();
            res.send(result);
            console.log(result);
        }
        )
        // get specific bids Data by email end





        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
