// Setting up imports
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const PORT = process.env.PORT || 8000

const app = express()
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    console.log("Loggin da request")
    next()
})


// GET / -- test index route
app.get('/', (req, res) => {
    res.json({ msg: 'hello backend 🤖' })
})

// controllers
app.use('/users', require('./controllers/users.js'))
app.use('/posts', require('./controllers/posts.js'))

// hey listen
app.listen(PORT, () => {
    console.log(`is that port ${PORT} I hear? 🙉`)
})
