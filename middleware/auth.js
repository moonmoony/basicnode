const { User } = require("../models/User");

/**
 * 1. 페이지 이동 시 로그인이 되어있는지 안 되어있는지, 관리자 인지 체크
 * 2. 글을 쓰거나 지울 때 권한이 있는지 체크
 */
let auth = (req, res, next) => {
    //인증 처리

    //클라이언트 쿠키에서 토큰 가져오기
    let token = req.cookies.x_auth;

    //토큰 복호화 처리 후 유저 find
    User.findByToken(token, (err, user) => {
        if(err) throw err
        if(!user) return res.json({
            isAuth: false,
            error: true
        })

        req.token = token;
        req.user = user;
        next();
    })

    //유저 있으면 인증 success

    //유저가 없으면 인증 fail
}

module.exports = { auth };