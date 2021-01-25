const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {type: String},
  avatar: {type: String},
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

module.exports = mongoose.model('Hero', schema)