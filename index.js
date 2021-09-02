const express = require('express')
const app = express()
const port = 1227

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://moonmoony:123456789--@basicnode.xgtj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('*** MongoDB Connected ***'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hi! Moon Moony!'))

app.listen(port, () => console.log(`*** ${port} is my birthday code ***`))