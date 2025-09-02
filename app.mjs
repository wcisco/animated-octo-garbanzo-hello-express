import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Hello Express from Render. <a href="/will">will</a>')
})


app.get('/will', (req, res) => {
  // res.send('barry. <a href="/">home</a>')
  res.sendFile(join(__dirname, 'public', 'will.html')) 

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

