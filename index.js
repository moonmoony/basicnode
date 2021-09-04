const express = require('express')
const app = express()
const port = 1227
const bodyParser = require('body-parser');
const { User } = require("./models/User");

/**
 * bodyParser가 임의의 클라이언트에서 넘어온 정보를 서버에서 읽을 수 있게 한다. 
 * application/x-www-form-urlencoded 로 정의된 데이터를 분석해서 가져오는 역할 
 */
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * application/json 타입을 분석해서 가져올 수 있게 하는 역할
 */
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://moonmoony:123456789--@basicnode.xgtj5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(() => console.log('*** MongoDB Connected ***'))
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hi! Moon Moony! What is up to you?'))

/** 회원가입을 위한 라우트 */
app.post('/register', (req, res) => {
    /**
     * SIGN UP 회원가입 
     * 회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 DB에 넣어준다. 
     */
    const user = new User(req.body)

    /** 
     * save는 mongodb에서 오는 메소드
     * bodyParser를 통해 req.body로 들어온 정보들이 user model에 저장
     */
    user.save((err, userInfo) => {
        if(err) return res.json({ success: false, err })
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => console.log(`*** ${port} is my birthday code ***`))