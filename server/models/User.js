const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function( next ) {
    var user = this;

    if(user.isModified('password')) { //비밀번호가 바뀔 때만 암호화 수행
        //비밀번호 암호화
        bcrypt.genSalt(saltRounds, function( err, salt ) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function( err, hash ) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword와 db에 들어있는 암호화된 pw를 비교
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    //es5문법으로 user정보 가져오기
    var user = this;
    console.log('*** [User.js] user._id 확인: ', user._id)

    //jsonwebtoken을 이용해서 로그인 정보 일치에 대한 token 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    
    /**
     * user._id + 'secretToken' = token
     * 따라서 나중에는 secretToken -> user._id가 됨
     */
    user.token = token
    user.save(function(err, user) {
        if(err) return cb(err)
        cb(null, user)
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰 복호화(decode) 처리
    jwt.verify(token, 'secretToken', function(err, decoded) {
        //유저 아이디로 유저를 찾은 후 클라이언트에서 보낸 token과 db에 보관된 token 일치 여부 확인
        user.findOne({
            "_id": decoded, 
            "token": token
        }, function(err, user) {
            if(err) return cb(err)
            cb(null, user)
        })
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }