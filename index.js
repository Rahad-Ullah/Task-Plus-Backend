const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;


// middlewares
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zku3u3r.mongodb.net/?retryWrites=true&w=majority`;

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

    const database = client.db("TaskPlus");
    const taskCollection = database.collection("tasks")


    // get all tasks of specific user
    app.get("/tasks", async (req, res) => {
        const email = req.query.email;
        const filter = {email: email}
        const result = await taskCollection.find(filter).toArray()
        console.log(result)
        res.send(result)
    })

    app.post("/tasks", async (req, res) => {
        const task = req.body;
        const result = await taskCollection.insertOne(task)
        console.log(result)
        res.send(result)
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
    res.send('Task Plus Server is running')
})

app.listen(port, () => {
    console.log(`Task Plus is running on port ${port}`)
})
