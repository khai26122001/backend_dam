const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require("./routes");
// chính sách bảo mất của trình duyệt web, tránh tuy cập vào các domain khác nhau nên ta phải khai báo
const cors = require('cors')
const bodyParser = require("body-parser");
// thư viện này dùng để nhận cái --cookie--
const cookieParser = require('cookie-parser');
dotenv.config()

const app = express()
const port = process.env.PORT || 3001

// chính sách bảo mất của trình duyệt web, tránh tuy cập vào các domain khác nhau nên ta phải khai báo
// dùng để gửi dữ liệu và nhận dữ liệu từ phía client
app.use(cors())

// này dùng để giới hạn dun lượng ảnh tải lên
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

// phải để trước routes(app); để nhận dữ liệu về
app.use(bodyParser.json())

// dùng để nhận cái cookie
app.use(cookieParser())

// gọi đến trang index.js điều hướng trong thư mục routes
// gọi đến rồi chuyền cái app vào
routes(app);

// Serve CKEditor static files
app.use('/ckeditor', express.static(__dirname + '/node_modules/@ckeditor/ckeditor5-build-classic/build'));

console.log('process.env.MONGO', process.env.MONGO_DB)

// Kết nối cơ sở dữ liệu MongoDB
mongoose.connect(`${process.env.MONGO_DB}`)
    .then(() => {
        console.log('Connect MongoDB success!')
        app.listen(port, () => {
            console.log('Server is running in port: ', + port)
        });
    })
    .catch((err) => {
        console.log(err)
    });


//  dùng cho test
module.exports = app;