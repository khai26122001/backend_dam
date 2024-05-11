const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController');
const { AuthMiddleware, AuthUserMiddleware } = require("../middleware/AuthMiddleware");

// sau khi nhận được dữ liệu từ index.js thì sẽ chuyển đến controler
// bên --client-- gọi đến các phương thức --get, post, put, delete--

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUsser)
router.get('/getAll', userController.getAllUser)

// --AuthUserMiddleware-- chỉ cho chính user đó hoặc là admin mới sửa được thông tin user
router.put('/update-user/:id',AuthUserMiddleware, userController.updateUser)
router.delete('/delete-user/:id', AuthMiddleware, userController.deleteUser)
router.get('/get-details/:id', AuthUserMiddleware, userController.getDetailsUser)


// giờ trong cái --token-- mình đặt thời gian hết hạn cho cái --token-- nên khi thời gian --token-- hết hạn thì mình sẽ
// tạo ra hàm mới để cấp lại cái --token-- đó
router.post('/refresh-token', userController.refreshToken)


// tại vì ta nhận --ids-- thông qua --rea.body-- nên sẽ dùng --post-- để nhận
// còn khi nào nhận --id-- thông qua --url-- thì mói dùng --router.delete--
router.post('/delete-many', AuthMiddleware, userController.deleteUserMany)

module.exports = router

