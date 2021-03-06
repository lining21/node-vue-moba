const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String},
  icon: {type: String},
  // type表示当前的类型是mogodb的id ref 表示管理的模型
  // 可以理解为从category表里查询id为parent传过去的那个值
  // parent: {type:mongoose.SchemaTypes.ObjectId, ref: 'Category'}
})

module.exports = mongoose.model('Item', schema)