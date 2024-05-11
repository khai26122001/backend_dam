const UserRouter = require('./UserRouter')

// nơi chứa tất cả route của api
const routes = (app) => {
    // sau khi được gọi bởi index.js bên ngoài thì sau đó sẽ link đến trang UserRouter.js
    app.use('/api/user', UserRouter)
}

module.exports = routes
