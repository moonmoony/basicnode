const express = require('express')
const app = express()
const port = 1227
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { User } = require("./models/User");

//application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
app.use(cookieParser());

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

/**
 * 로그인 테스트 방법
 * mongoDB 사이트에서 확인되는 로그인 정보 id(moonmoony@gmail.com) pw(123456789) 를 가지고
 * postman 사이트에서 post 보내고 response 확인하기
 */
app.post('/login', (req, res) => {
    console.log('*** [index.js] starts to sign in ***')

    //클라이언트에서 요청된 로그인 정보를 db에 있는지 찾기
    User.findOne({ email: req.body.email }, (err, user) => {
        console.log('*** [index.js] user check: ', user)

        if(!user) {
            return req.json({
                loginSuccess: false,
                message: "*** There is no user ***"
            })
        }

        //이메일 확인 후 맞으면 패스워드 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            console.log('*** [index.js] err 확인: ', err)
            console.log('*** [index.js] isMatch t/f 확인: ', isMatch)

            if(!isMatch)
            return res.json({ loginSuccess: false, message: "*** It is no match password ***"})

            //패스워드 확인 후 토큰 생성 https://www.npmjs.com/package/jsonwebtoken 참고
            user.generateToken((err, user) => {
                console.log('*** [index.js] user check: ', user)
                if(err) return res.status(400).send(err);

                //토큰을 저장하는데 어디에 저장할지 설정 => >>>쿠키<<< or 로컬스토리지 or 세션
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ 
                    loginSuccess: true, 
                    userId: user._id,
                    email: user.email,
                    message: "로그인에 성공하였습니다." 
                })
            })
        })
    })
})

app.listen(port, () => console.log(`*** ${port} is my birthday code ***`))