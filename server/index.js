console.log('1231');
const express = require('express');

const app = express();

app.set('secret', '1231231');

// 解决跨域
app.use(require('cors')());
// 用于post请求的req.body
app.use(express.json());
// 静态文件托管 让uploads中的文件夹，可以通过/uploads这个路由拿到
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./plugins/db')(app)
require('./routes/admin')(app)

app.listen(3000, ()=> {
  console.log('http://loaclhost/3000');
});