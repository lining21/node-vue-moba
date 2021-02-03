const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String},
  avatar: {type: String},
  banner: {type: String},
  // 称号
  title: {type: String},
  categories: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Category'}],
  scores: {
    difficult: {type: Number}, // 难度
    skills: {type: Number}, // 技能
    attack: {type: Number}, // 攻击
    survive: {type: Number}, // 生存
  },
  skills: [{
    icon: {type: String},
    name: {type: String},
    delay: {type: String},
    cost: {type: String},
    description: {type: String},
    tips: {type: String}
  }],
  //顺风出装 逆风出装 要从item这个库中查找。
  items1: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Item'}],
  items2: [{type: mongoose.SchemaTypes.ObjectId, ref: 'Item'}],
  // type表示当前的类型是mogodb的id ref 表示管理的模型
  // 可以理解为从category表里查询id为parent传过去的那个值
  // parent: {type:mongoose.SchemaTypes.ObjectId, ref: 'Category'}
  // 使用技巧
  usageTips: {type: String},
  // 对抗技巧
  battleTips: {type: String},
  // 团战思路
  teamTips: {type: String},
  // 英雄关系
  partners: [{
    hero: {type: mongoose.SchemaTypes.ObjectId, ref: 'Hero'},
    description: {type: String}
  }]
})

// 定义模型的时候，定义一个模型名称 再定义一个表结构，其实存到数据库里
// 数据真正存到数据库的集合里的名字 也就是表名，是自己默认生成 一般是模型的复数形式，有可能就把hero变成了heros
module.exports = mongoose.model('Hero', schema, 'heroes')