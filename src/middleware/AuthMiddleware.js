const jwt = require('jsonwebtoken')
// 2 cai dưới này dùng để mình sử dụng được --env--
const dotenv = require('dotenv')
dotenv.config()

// đây là nơi cấp quyền chỉ có admin mới xóa được tài khoảng user
const AuthMiddleware = (req, res, next) => {
    // lấy được cái token truyền vào từ client bằng 1 khoảng cách và 2 phần từ nên 
    // sẽ có đoạn này --.split(' ')[1]--  
    const token = req.headers.token.split(' ')[1]
    // console.log('token1', token)
    // nhân vào 1 cái token và 1 cái serick key, và trả về 1 cái function nếu ko phải thì trả về err còn phải thì trả về decoded
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {
        if (err) {
            return res.status(404).json({
                message: 'the authentication 0',
                status: 'ERROR'
            })
        }
        // console.log('user1', user)
        // nếu nó == true nghĩa là nó có quyền isAdmin
        if (user?.isAdmin) {
            next()
        } else {
            // còn ko bằng true thì trả ra lỗi
            return res.status(404).json({
                message: 'the authentication 1',
                status: 'ERROR'
            })
        }
    });
}

// dùng để chỉ quyền, user chỉ lấy được thông tin của nó
// và admin có thể lấy toàn bộ thông tin của user
const AuthUserMiddleware = (req, res, next) => {
    // in ra cái token
    // console.log('checkToken', req.headers.token)
    
    // lấy được cái token truyền vào từ client bằng 1 khoảng cách và 2 phần từ nên 
    // sẽ có đoạn này --.split(' ')[1]--  
    const token = req.headers.token.split(' ')[1]
    const UserId = req.params.id

    // console.log('token lỗi', token)
    // console.log('token lỗi', UserId)
    
    // nhân vào 1 cái token và 1 cái serick key, và trả về 1 cái function nếu ko phải thì trả về err còn phải thì trả về decoded
    jwt.verify(token, process.env.ACCESS_TOKEN, function(err, user) {

        if (err) {
            return res.status(404).json({
                message: 'the authentication lỗi',
                status: 'ERROR'
            })
        }
        
        // nếu nó == true nghĩa là nó có quyền isAdmin
        // console.log('user', user)

        // thêm đoạn điều kiện này để user chỉ có quyền xem thông tin của mình và admin sẽ xem được hết
        // payload?.id === UserId
        if ( user?.id === UserId || user?.isAdmin === false ) {
            next()
        } else if(user?.id === UserId || user?.isAdmin === true) {
            next()
        } else {
            // còn ko bằng true thì trả ra lỗi
            return res.status(404).json({
                message: 'the authentication ko dx chấp thuận do ko phải user hoặc admin',
                status: 'ERROR'
            })
        }
    });
}

module.exports = {
    AuthMiddleware,
    AuthUserMiddleware
}