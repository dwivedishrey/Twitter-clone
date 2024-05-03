const express = require('express');
const cors=require('cors');
const app = express()
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://dwivedishreya0822:WQ9wvD45yhizWRa6@cluster0.e0nlag1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Send a ping to confirm a successful connection
    const postCollection=client.db('database').collection('posts')
    const userCollection=client.db('database').collection('users')
    app.get('/user', async (req, res) => {
        const user = await userCollection.find().toArray();
        res.send(user);
    })
    app.get('/loggedInUser', async (req, res) => {
        const email = req.query.email;
        const user = await userCollection.find({ email: email }).toArray();
        res.send(user);
    })
    app.get('/post', async (req, res) => {
        const post = (await postCollection.find().toArray()).reverse();
        res.send(post);
    })
    app.post('/post',async(req,res)=>{
        const post=req.body;
        const result=await postCollection.insertOne(post);
        res.send(result);

    })
    app.get('/userPost', async (req, res) => {
      const email = req.query.email;
      const post = (await postCollection.find({ email: email }).toArray()).reverse();
      res.send(post);
  })
    app.post('/register',async(req,res)=>{
        const user=req.body;
        const result=await userCollection.insertOne(user);
        res.send(result);

    })
    //patch
    app.patch('/userUpdates/:email',async(req,res)=>{
        const filter=req.params;
        const profile=req.body;
        const options={upset:true};
        const updateDoc={$set:profile};
        const result=await userCollection.updateOne(filter,updateDoc,options)
        res.send(result);
    })
  } catch(error) {
    // Ensures that the client will close when you finish/error
    console.log(error);
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World! shreya deivedi')
})

app.listen(port, () => {
  console.log(`Twitter app listening on port ${port}`)
})