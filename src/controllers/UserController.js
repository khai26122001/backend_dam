const userService = require('../services/UserService')
const JwtService = require('../services/JwtService')

// nơi nhận dữ liệu từ client thông qua --req-- rồi đóng gói lại dữ liệu lại rồi chuyển đến --service-- xử lý
// nới chuyển dữ liệu từ server qua client thông qua --res--

// thêm User
const createUser = async (req, res) => {
    try {
        // hiển thị ra những dữ liệu nhận về bên phía client
        // console.log(req.body)

        // nhận những dữ liệu dx gửi qua từ phía client
        const { email, password, confirmPassword } = req.body

        // kiểm tra xem có phải là email ko hay là 1 cái String
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        const isCheckPassWord = password.length >=6
        
        // kiểm tra xem nếu mà nó ko có 1 trong những thằng này
        if(!email || !password || !confirmPassword) {
            // trả về 1 thông báo lỗi khi ko nhận dx 1 cái nào đó
            return res.status(200).json({
                status: 'ERR_all',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            // trả về 1 thông báo lỗi ở email
            return res.status(200).json({
                status: 'ERR_email',
                message: 'The input is email'
            })
        } else if (!isCheckPassWord) {
            return res.status(200).json({
                status: 'ERR_passFail',
                message: 'Invalid password'
            })
        } else if (password !== confirmPassword) {
            // trả về 1 thông báo lỗi khi 2 cái này ko giống nhau
            return res.status(200).json({
                status: 'ERR_pass',
                message: 'The input is password || confirmPassword'
            })
        } 
        // bắt đầu kiểm tra email
        // console.log('isCheckEmail', isCheckEmail)
        
        // nhận dữ liệu từ UserRouter.js sau đó sẽ truyền dữ liệu nhận đx vào UserService để xử lý
        const response = await userService.createUser(req.body)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            err: e
        })
    }
}

// Sau khi thêm thì đăng nhập 
const loginUser = async (req, res) => {
    try {
        // hiển thị ra những dữ liệu nhận về bên phía client
        // console.log(req.body)

        // nhận những dữ liệu dx gửi qua từ phía client
        const {email, password} = req.body

        // kiểm tra xem có phải là email ko hay là 1 cái String
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        
        // kiểm tra xem nếu mà nó ko có 1 trong những thằng này
        if(!email || !password) {
            // trả về 1 thông báo lỗi khi ko nhận dx 1 cái nào đó
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            // trả về 1 thông báo lỗi ở email
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })
        }
        // bắt đầu kiểm tra email
        // console.log('isCheckEmail', isCheckEmail)
        
        // nhận dữ liệu từ UserRouter.js sau đó sẽ truyền dữ liệu nhận đx vào UserService để xử lý
        const response = await userService.loginUser(req.body)

        const { refresh_token, ...newReponse } = response
        // console.log("response", response)

        // giờ cái --refresh_token-- ta sẽ dùng cho cái --cookie--
        res.cookie('refresh_token', refresh_token, {
            // giúp mình chỉ lấy được cái --cookie-- này thông qua --http-- thôi
            // ko lấy đx bằng --javascrip--
            HttpOnly: true,
            // đảm nhiệm việc bảo mật ở phía client
            secure: false,
            samesite: 'strict',
            path: '/',

        })

        // lúc này ta sẽ trả về --newReponse-- sửa lại để làm bên phía client
        // nhằm chỉ trả về cho client --access_token--

        //  thêm refresh_token để trả về refresh_token cho phía client nhận dx
        return res.status(200).json({...newReponse, refresh_token})
        




        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        // return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            err: e
        })
    }
}

// update User
const updateUser = async (req, res) => {
    try {
        // nhận id từ url
        const userId = req.params.id
        // dữ liệu gửi lên từ server
        const data = req.body

        // kiểm tra nếu ko lấy dx id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        // in ra để kiểm tra
        // console.log('userId', userId)
        // đóng gói dữ liệu cần update và id lấy từ url gửi qua service
        const response = await userService.updateUser(userId, data)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// xóa User
const deleteUser = async (req, res) => {
    try {
        // nhận id từ url
        const userId = req.params.id
        // console.log('userId: ', userId)
        // kiểm tra nếu ko lấy dx id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        // gửi id lấy từ url sang cho service xử lý tiến hành xóa
        const response = await userService.deleteUser(userId)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// xóa many User
const deleteUserMany = async (req, res) => {
    try {
        // nhận id từ req.body.ids
        const ids = req.body.ids
        // console.log('userId: ', ids)
        // kiểm tra nếu ko lấy dx id
        if(!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user ids is required'
            })
        }
        // gửi id lấy từ url sang cho service xử lý tiến hành xóa
        const response = await userService.deleteUserMany(ids)
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}


// lấy toàn bộ thông tin User
const getAllUser = async (req, res) => {
    try {
        // gói tới service
        const response = await userService.getAllUser()
        // sau khi xử lý dữ liệu xong ta chuyển kiểu dữ liệu đã xử lý về --Json-- sau đó trả về
        return res.status(200).json(response)
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// lấy thông tin User thông qua --_id--
const getDetailsUser = async (req, res) => {
    try {
        // nhận id từ url
        const userId = req.params.id
        // console.log('userId: ', userId)
        // kiểm tra nếu ko lấy dx id
        if(!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        // đóng gói dữ liệu cần get và id lấy từ url gửi qua service
        const response = await userService.getDetailsUser(userId)
        // gửi dữ liệu đã xử lý xong đi
        return res.status(200).json(response)


    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// cấp lại --refreshToken-- khi --access_token-- hết hạng
const refreshToken = async (req, res) => {
    // lúc này ta ko cẩn nhận cái token như trên nữa
    // console.log('req.cookies.refresh_token', req.cookies.refresh_token)
    try {
        // nhận token từ client thông qua cắt chuỗi lấy phần tử thứ 1
        // sửa lại để nhận --refreshToken-- rồi đưa lên host ko lỗi
        let token = req.headers.token.split(' ')[1]
        // cách củ
        // const token = req.cookies.refresh_token

        // console.log('token: ', token)
        // kiểm tra nếu ko lấy dx id
        if(!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        // đóng gói dữ liệu cần get và id lấy từ url gửi qua service
        const response = await JwtService.refreshTokenJwtService(token)
        // gửi dữ liệu đã xử lý xong đi
        return res.status(200).json(response)

    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

// đăng xuất
const logoutUsser = async (req, res) => {
    try {
        // xóa cái cookies đi là được
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')
        

        return res.status(200).json({
            status: 'OK',
            message: 'Logout successFully'
        })
    } catch (e) {
        // nếu ko có dữ liệu sẽ báo lỗi
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUsser,
    deleteUserMany
}