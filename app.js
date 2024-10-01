require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser')
const { ObjectId } = require('mongodb')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://Brandon:${process.env.MONGO_PASS}@cluster0.ta5nh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0` 

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.use(express.static('./public/'))

//console.log(uri);
//testchange

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
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

app.get('/', async (req, res)=>{
  // res.send('Hello Node from Ex on local dev box')
  console.log('in home');
  await client.connect();
  
  console.log('connected?');
  // Send a ping to confirm a successful connection
  
  let result = await client.db("brandon-db").collection("players")
    .find({}).toArray(); 
  console.log(result); 

  res.render('index.ejs', {
    players : result
  });
})

// app.get('/ejs', (req,res)=>{
//   ``
//   res.render('index', {
//     myServerVariable : "something from server"
//   });
// })

app.get('/mongo', async (req,res)=>{

  console.log('in /mongo');
  await client.connect();
  
  console.log('connected?');
  // Send a ping to confirm a successful connection
  
  let result = await client.db("brandon-db").collection("Test1")
    .find({}).toArray(); 
  console.log(result); 

  res.render('mongo', {
    mongoResult : result
  });

})

app.post('/insert', async (req,res)=> {

  console.log('in /insert');

  console.log('request', req.body.newPost);
  console.log('request', req.body.teamName);
  //connect to db,
  await client.connect();
  //point to the collection 
  await client.db("brandon-db").collection("Test1").insertOne({ post: req.body.newPost});
  await client.db("brandon-db").collection("Test1").insertOne({ teamName: req.body.teamName});  
  //insert into it
  res.redirect('/mongo');

});

app.post('/update/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("brandon-db").collection("Test1");
  let result = await collection.findOneAndUpdate( 
  {"_id": new ObjectId(req.params.id)}, { $set: {"post": "NEW POST" } }
)
.then(result => {
  console.log(result); 
  res.redirect('/mongo');
})

})

app.post('/delete/:id', async (req,res)=>{

  console.log("req.parms.id: ", req.params.id)

  client.connect; 
  const collection = client.db("brandon-db").collection("Test1");
  let result = await collection.findOneAndDelete( 
  {"_id": new ObjectId(req.params.id)})

.then(result => {
  console.log(result); 
  res.redirect('/mongo');
})

})

app.listen(5000)
