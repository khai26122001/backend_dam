const jws = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

// thời gian truy cập vào trang web
const genneralAccessToken = async (payload) => {
    // console.log('payload', payload)
    // nhận vào cái key sitrick gì đó: access_token
    // expiresIn: thời gian cái token hết hạn
    const access_token = jws.sign({
        // khi rải ... như zậy thì bên phía client sẽ nhận được luôn --id với isAdmin--
        // chứ --id và isAdmin-- ko nằm trong --pyload-- mà nằm ngoài luôn
        ...payload
    }, process.env.ACCESS_TOKEN, { expiresIn: '30s' })
    return access_token
}

// hình như là thời hạn của 1 tài khoảng sau đó làm mới lại thì phải
const genneralRefreshToken = async (payload) => {
    // console.log('payload', payload)
    // nhận vào cái key sitrick gì đó: access_token
    // expiresIn: thời gian cái token hết hạn
    const refresh_token = jws.sign({
        // khi rải ... như zậy thì bên phía client sẽ nhận được luôn --id với isAdmin--
        // chứ --id và isAdmin-- ko nằm trong --pyload-- mà nằm ngoài luôn
        ...payload
    }, process.env.REFRESH_TOKEN, { expiresIn: '365d' })
    return refresh_token
}

// dùng để cấp lại token
const refreshTokenJwtService = (token) => {

    return new Promise((resolve, reject) => {
        try {
            // console.log('token', token)
            // console.log('process.env.REFRESH_TOKEN: ', process.env.REFRESH_TOKEN)

            // nó sẽ dựa vào --jws.verify-- để lấy ra --user-- gồm có --_id và isAdmin--
            jws.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
                if(err) {
                    resolve({
                        status: 'ERR',
                        message: 'The authemtication'
                    })
                }
                // console.log('user', user)

                // sau khi lấy được --user-- gồm có --_id và isAdmin--
                // ta sẽ tiếp tục truyền lại --_id và isAdmin-- vào --genneralAccessToken-- để cấp lại --Access_token--
                const access_token = await genneralAccessToken({
                    id: user?.id,
                    isAdmin: user?.isAdmin
                })
                // console.log('access_token sau khi cấp lai', access_token)

                resolve({
                    status: 'OK',
                    message: 'Get Success',
                    access_token
                    //data: user
                })

            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}