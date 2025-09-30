import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion } from 'mongodb';
 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
//const uri = process.env.MONGO_URI;
const uri = "mongodb+srv://willcisco8833:olivia@cluster0.mw5dm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

console.log("get uri: ", uri);

app.use(express.static(join(__dirname, 'public')));



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


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'will.html'))
  //res.send('Add places that you have been! <a href="/will">My Locations! Click Here!</a>')
})


app.get('/api/will', (req, res) => {
  const myVar = 'Hello from server!';
  res.json({ myVar });
});


app.get('/api/query', (req, res) =>{
  console.log(req);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

