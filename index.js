const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

dotenv.config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.oknyghy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = 'mongodb://localhost:27017';


const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        // await client.connect();
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const craftsDB = client.db("craftsDB").collection("crafts");


        app.get('/', (req, res) => {
            res.send('Server is working perfectly!!!');
        })

        app.post('/crafts', async (req, res) => {
            const craft = req.body;
            // console.log(craft);
            const result = await craftsDB.insertOne(craft);
            res.send(result);
        });

        app.get('/crafts', async (req, res) => {
            const cursor = craftsDB.find();
            const crafts = await cursor.toArray();
            res.send(crafts);
        });

        app.get('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const craft = await craftsDB.findOne(query);
            res.send(craft);
        });

        app.get('/crafts/subcategory/:subcategory', async (req, res) => {
            const subcategory = req.params.subcategory;
            const query = { subcategory: subcategory };
            const cursor = craftsDB.find(query);
            const craft = await cursor.toArray();
            res.send(craft);
        });

        app.get('/crafts/user/:user', async (req, res) => {
            const user = req.params.user;
            const query = { provider: user };
            const craft = await craftsDB.findOne(query);
            res.send(craft);
        });

        app.get('/crafts/email/:email', async (req, res) => {
            const email = req.params.email;
            const query = { provider_email: email };
            const cursor = craftsDB.find(query);
            const craft = await cursor.toArray();
            res.send(craft);
        });

        app.put('/crafts/:id', async (req, res) => {
            const id = req.params.id;
            const { name, subcategory, rating, stock, customization, brief, price, url, provider, provider_email, user_url } = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name, subcategory, rating, stock, customization, brief, price, url, provider, provider_email, user_url
                }
            }
            const result = await craftsDB.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/crafts/:id', async (req, res) => {
            // console.log(req.body);
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftsDB.deleteOne(query);
            res.send(result);
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

//MongoDB is not working showing error

app.listen(port, () => {
    console.log(`Server is running on port : ${port}`);
})