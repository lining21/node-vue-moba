const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String},
  // type表示当前的类型是mogodb的id ref 表示管理的模型
  // 可以理解为从category表里查询id为parent传过去的那个值
  parent: {type:mongoose.SchemaTypes.ObjectId, ref: 'Category'}
})

schema.virtual('children', {
  localField: '_id',
  foreignField: 'parent',
  justOne: false,
  ref: 'Category'
})

schema.virtual('newsList', {
  localField: '_id',
  foreignField: 'categories', //外键
  justOne: false,
  ref: 'Article'
})

// Category 模块名， schema存储数据库的数据格式，及其关联关系
module.exports = mongoose.model('Category', schema)