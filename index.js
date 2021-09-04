const express = require('express')
const app = express()
const port = 1227
const bodyParser = require('body-parser');
const config = require('./config/key');
const { User } = require("./models/User");

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI)
    .then(() => console.log('*** MongoDB Connected ***'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hi! Moon Moony! What is up to you?'))

/** 회원가입을 위한 라우트 */
app.post('/register', (req, res) => {
    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`*** ${port} is my birthday code ***`))