import express from 'express'

const app = express()

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello Express from Render')
})

// endpoints... middlewares... apis?
// send an html file

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

// TODO: refactor to use env port.