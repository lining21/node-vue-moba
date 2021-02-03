const requireAll = require('require-all');

module.exports = app => {
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://127.0.0.1:27017/node-vue-moba',{
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', () => {
    console.log('连接mongodb成功');
  });

  // 有些模块如果不引用，可能会报错；
  require('require-all')(__dirname + '/../models');
  // 这边统一请求了，就会挂到moongoose上，在
  // require('./plugins/db')(app)
  // require('./routes/admin')(app)
  // require('./routes/web')(app)模块就可以进行使用了。
  
}