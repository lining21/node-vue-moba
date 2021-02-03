const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {type: String},
  body: {type: String},
  categories: [{type: mongoose.SchemaTypes.ObjectId, ref:'Category'}]
  // [{"categories":
    // [{"_id":"600c0792f9773b4a30262185","parent":"600bde69ae7ef620e82ac44e","name":"公告","__v":0},
    // {"_id":"600c066aa6a4f046a86e1bf6","parent":"600bde69ae7ef620e82ac44e","name":"新闻","__v":0}],
    // "title":"嫦娥皮肤设计第9期新创意赏析！烟岚云岫、水调歌头、越窑清灵..."}]
    // catrgories 的传递方式如上，最终存到数据库里是以id的形式存的，关联的是分类的表格。
},
//  timestamps: true表示会返回创建和更新时间。
{
  timestamps: true
})

module.exports = mongoose.model('Article', schema)