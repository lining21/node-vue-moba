const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {type: String},
  // 密码做散列，不可逆 md5 随机字符串也不知道。
  password: {type: String,
  // select: false 当普通find查询的时候，查不到此项；
  select: false,
  // 存储的时候，操作一下，即存到数据库里的时候。加密一下；
  set(val) {
    return require('bcrypt').hashSync(val, 10);
  }},
})

module.exports = mongoose.model('AdminUser', schema)