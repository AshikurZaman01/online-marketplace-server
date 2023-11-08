const express = require('express')
const cors = require('cors')
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');
const app = express()
const port = process.env.PORT || 3000

app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())


app.get('/', (req, res) => {
    res.send('Iber server is running')
})

app.listen(port, () => {
    console.log(`Iber Server is running on port ${port}`);

})


const logger = async (req, res, next) => {
    console.log('called', req.host, req.originalUrl);
    next();
}
const verifiToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }
        console.log(decoded)
        req.user = decoded;
        next()
    })
   
}

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

        // AUTH 
        app.post('/jwt', logger, async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, 'secret', { expiresIn: '1h' });

            res
                .cookie('token', token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'none',

                })
                .send({ success: true })
        })


        // get category data
        app.get('/categories', logger, async (req, res) => {
            const categories = await categoryCollection2.find().toArray();
            res.send(categories);
            console.log(categories);
        })
        // get category data end


        // get specific jobs Data by email
        app.get('/jobs', logger, async (req, res) => {

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
        app.get('/jobs', logger, async (req, res) => {
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
        app.delete('/jobs/:id', logger, async (req, res) => {
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
        app.post('/bids', logger, async (req, res) => {
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
