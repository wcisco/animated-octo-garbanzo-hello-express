import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
 

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
// Use env var for URI. Set MONGO_URI in your environment or .env file.
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI is not set. Add MONGO_URI to your .env or environment.');
  process.exit(1);
}

app.use(express.static(join(__dirname, 'public')));

// parse JSON and URL-encoded form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db;
async function run() {
  // Validate MONGO_URI before attempting to connect
  if (!uri) {
    console.error('MONGO_URI is not set. Set MONGO_URI in your .env or environment.');
    process.exit(1);
  }

  try {
    // Connect the client to the server (do not immediately close)
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    db = client.db(process.env.DB_NAME || 'Cluster0');

    // Start listening only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Mongo connect error:', err);
    // Ensure the client is closed if connect partially succeeded
    try { await client.close(); } catch (e) { /* ignore */ }
    process.exit(1);
  }
}
run().catch(err => {
  console.error('Run failed:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down, closing MongoClient');
  await client.close();
  process.exit(0);
});

// POST handler to receive form data and save to MongoDB
app.post('/api/spots', async (req, res) => {
  try {
    // Expecting a field named "place" from the form (adjust to your form names)
    const { place } = req.body;
    if (!place) return res.status(400).json({ error: 'Missing place field' });

    const doc = { place: String(place), createdAt: new Date() };
    const result = await db.collection('spots').insertOne(doc);
    // attach the generated id and return the saved document so client can render it
    doc._id = result.insertedId;
    return res.status(201).json(doc);
  } catch (err) {
    console.error('Insert error:', err);
    return res.status(500).json({ error: 'Failed to save' });
  }
});

// new: GET all saved spots (used by the page to load existing entries)
app.get('/api/spots', async (req, res) => {
  try {
    const spots = await db.collection('spots')
      .find()
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();
    res.json(spots);
  } catch (err) {
    console.error('Find error:', err);
    res.status(500).json({ error: 'Failed to fetch spots' });
  }
});

// Update a spot
app.put('/api/spots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });
    const { place } = req.body;
    if (!place) return res.status(400).json({ error: 'Missing place' });

    const result = await db.collection('spots').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { place: String(place) } },
      { returnDocument: 'after' }
    );

    if (!result.value) return res.status(404).json({ error: 'Not found' });
    res.json(result.value);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update' });
  }
});

// Delete a spot
app.delete('/api/spots/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) return res.status(400).json({ error: 'Invalid id' });

    const result = await db.collection('spots').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ deletedId: id });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'will.html'))
});

app.get('/api/will', (req, res) => {
  const myVar = 'Hello from server!';
  res.json({ myVar });
});

app.get('/api/query', (req, res) =>{
  console.log(req.query);
  res.json({ query: req.query });
});

