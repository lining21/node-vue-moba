module.exports = app => {
  const router = require('express').Router();
  const mongoose = require('mongoose');
  // const Article = require('../../models/Article');
  const Article = mongoose.model('Article');
  const Category = mongoose.model('Category');
  const Hero = mongoose.model('Hero');
  // 生成新闻数据
  router.get('/news/init', async(req, res) => {
    // lean 表示取纯粹的json 不带mogons
    const parent = await Category.findOne({
      name: '新闻分类'
    });
    // parent { _id: 600bde69ae7ef620e82ac44e, __v: 0, name: '新闻分类' }
    // console.log('parent', parent);
    const cats = await Category.find().where({
      parent
    }).lean();
    // console.log('cats', cats);
    // [
    //   {
    //     _id: 600c066aa6a4f046a86e1bf6,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '新闻',
    //     __v: 0
    //   },
    //   {
    //     _id: 600c0792f9773b4a30262185,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '公告',
    //     __v: 0
    //   },
    //   {
    //     _id: 6015315940e8e1172835b538,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '活动',
    //     __v: 0
    //   },
    //   {
    //     _id: 6015315e40e8e1172835b539,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '赛事',
    //     __v: 0
    //   }
    // ]

    // $$('.news_list .title').map(el => el.innerHTML).slice(5)
    const newsTitles = [
      "嫦娥皮肤设计第9期新创意赏析！烟岚云岫、水调歌头、越窑清灵...", 
      "王者荣耀携手麦斯威尔，开启新年敦煌送福大赏！", 
      "参观嫦娥姐姐的创意工坊！欣赏新衣得钻石奖励~", 
      "CHALI茶里×王者荣耀 | 跨界出击，给新年加buff！", 
      "快手直播天团选拔开始，助你心爱的主播出道！", 
      "1月31日体验服停机更新公告", 
      "1月29日体验服停机更新公告", 
      "1月27日全服不停机更新公告", 
      "积分暴暴暴活动规则说明", 
      "1月27日净化游戏环境声明及处罚公告", 
      "【微信用户专属】“游戏礼品站”购买“小乔-青蛇”、“阿轲-节奏热浪”抽免单活动", 
      "积分暴暴暴活动开启，最高可暴击1000荣耀积分", 
      "芈月-白晶晶皮肤即将登场，限时语音包同步上线", 
      "【上元夺魁·集群英筹庆典】活动开启公告", 
      "镜-炽阳神光 FMVP定制皮肤即将登场，应援冬冠参与活动得好礼", 
      "2021KPL春季转会期挂牌期第三阶段追加公告", 
      "关于2021年KPL春季赛临时参赛资格评审结果的通知", 
      "2021年KPL王者荣耀职业联赛赛制升级，全新对抗一触即发！", 
      "英雄归来，共度荣耀！2020王者荣耀冬季冠军杯暨年度颁奖典礼圆满落幕", 
      "你我皆王者，2020王者荣耀年度奖项获奖名单揭晓！"
    ];
    const newsList = newsTitles.map(title => {
      // cats.slice(0) 表示不影响原数组
      const randomCats = cats.slice(0).sort((a,b)=> Math.random() - 0.5);
      return {
        categories: randomCats.slice(0, 2),
        title: title
      }
    })
    // 以任意条件去查询 请清空
    await Article.deleteMany({});
    await Article.insertMany(newsList);
    // [{"categories":
    // [{"_id":"600c0792f9773b4a30262185","parent":"600bde69ae7ef620e82ac44e","name":"公告","__v":0},
    // {"_id":"600c066aa6a4f046a86e1bf6","parent":"600bde69ae7ef620e82ac44e","name":"新闻","__v":0}],
    // "title":"嫦娥皮肤设计第9期新创意赏析！烟岚云岫、水调歌头、越窑清灵..."}]
    res.send(newsList);
    // http://localhost:3000/web/api/news/init
  })


  // 获取新闻列表
  router.get('/news/list', async(reaq, res)=> {
    // const cats = await Category.findOne({
    //   name: '新闻分类'
    // }).populate({
    //   path: 'children',
    //   populate: {
    //     path: 'newsList'
    //   }
    // }).lean()
    const parent=  await Category.findOne({
      name: '新闻分类'
    });
    // parent { _id: 600bde69ae7ef620e82ac44e, __v: 0, name: '新闻分类' }
    // aggregate聚合查询 可以同时执行好几次查询，最终得到你想要的结果
    // 效率比上面的查询高得多
    // 在Category表里，先$match找到匹配新闻分类的parentid的项目 即，新闻、公告、活动、赛事；
    // 再找，$lookup 以新闻、公告、活动、赛事的_id,去articles中，找categories字段中与之匹配的_id,并将找到的数据形成newsList数组
    // $addFields 最后再过滤每个newsList的五条数据。
    const cats = await Category.aggregate([
      // 查询的条件是parent ，parent._id 是上面找到的新闻分类的id
      // 首先通过match 过滤数据 也就是都是当前新闻分类下的那几个分类
      {$match: { parent: parent._id }},

      // lookup类似于关系型数据库中的 join
      // 其次关联查询 翻译一下：利用articles中的_id,去categories中找到
      {
        $lookup: {
          from: 'articles', // 关联的哪个表 也就模型的名字
          localField: '_id', // 主键 本地关联的字段
          foreignField: 'categories', // 外键 article中用到的关联字段
          as: 'newsList' // 起个名字
        }
      },

      // model.Department.aggregate([ 
      //   {
      //     $lookup: {
      //       from: 'users',  // 从哪个Schema中查询（一般需要复数，除非声明Schema的时候专门有处理）
      //       localField: '_id',  // 本地关联的字段
      //       foreignField: 'department', // user中用的关联字段
      //       as: 'users' // 查询到所有user后放入的字段名，这个是自定义的，是个数组类型。
      //     }
      //   }
      // ]);

      // 每个newsList 只要其中五条
      {
        $addFields: { //添加字段
          newsList: {$slice: ['$newsList', 5]}
        }
      }
    ])

    // [
    //   {
    //     _id: 600c066aa6a4f046a86e1bf6,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '新闻',
    //     __v: 0,
    //     newsList: [ [Object], [Object], [Object], [Object], [Object] ]
    //   },
    //   {
    //     _id: 600c0792f9773b4a30262185,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '公告',
    //     __v: 0,
    //     newsList: [ [Object], [Object], [Object], [Object], [Object] ]
    //   },
    //   {
    //     _id: 6015315940e8e1172835b538,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '活动',
    //     __v: 0,
    //     newsList: [ [Object], [Object], [Object], [Object], [Object] ]
    //   },
    //   {
    //     _id: 6015315e40e8e1172835b539,
    //     parent: 600bde69ae7ef620e82ac44e,
    //     name: '赛事',
    //     __v: 0,
    //     newsList: [ [Object], [Object], [Object], [Object], [Object] ]
    //   }
    // ]
    // console.log(cats);
    const subCats = cats.map(v=>{
      return v._id;
    }); 
    let obj = {
      name: '热门',
      newsList: await Article.find().where({
        // $in 需要一个数组，都是_id的数组
        categories: { $in: subCats } 
      }).populate('categories').limit(5).lean()
      // populate 是关联查询的意思，这样就会把热门的categories 最为数组中每一项的信息 全部查出来，返回过去。
      // 也查出来

      //       populate(arg1,arg2)   .populate('categories', 'name _id')

      // 　　　　　　第一个参数对应集合中的存续关联数据的属性，若对应错误，查询成功，但关联集合只有_id返回。

      // 　　　　　　第二个参数用于过滤查询关联集合中的属性，多个属性用空格隔开，若缺失，返回关联集合的所有参数，可以传"-_id"去除返回值中的_id属性

      // {
      //   "name": "热门",
      //   "newsList": [
      //   {
      //   "_id": "60179dfee12a174b98bbf397",
      //   "categories": [
      //   {
      //   "_id": "6015315e40e8e1172835b539",
      //   "parent": "600bde69ae7ef620e82ac44e",
      //   "name": "赛事",
      //   "__v": 0
      //   },
      //   {
      //   "_id": "600c0792f9773b4a30262185",
      //   "parent": "600bde69ae7ef620e82ac44e",
      //   "name": "公告",
      //   "__v": 0
      //   }
      //   ],
      //   "title": "嫦娥皮肤设计第9期新创意赏析！烟岚云岫、水调歌头、越窑清灵...",
      //   "__v": 0,
      //   "createdAt": "2021-02-01T06:21:50.522Z",
      //   "updatedAt": "2021-02-01T06:21:50.522Z"
      //   },
      //   ]
      // }

      // Article.find().where({
      //   // $in 需要一个数组，都是_id的数组
      //   categories: { $in: subCats } 
      // }).limit(5).lean()
      // "categories": [
      //   "6015315e40e8e1172835b539",
      //   "600c0792f9773b4a30262185"
      //   ],
        
      // .populate('categories')
      // "categories": [
      //   {
        //   "_id": "6015315e40e8e1172835b539",
        //   "parent": "600bde69ae7ef620e82ac44e",
        //   "name": "赛事",
        //   "__v": 0
      //   },
      //   {
        //   "_id": "600c0792f9773b4a30262185",
        //   "parent": "600bde69ae7ef620e82ac44e",
        //   "name": "公告",
        //   "__v": 0
      //   }
      // ],
    };
    cats.unshift(obj);
    cats.map(cat => {
      cat.newsList.map(news=>{
        // 热门中每一项 显示的是其真实的title，所以 热门的要改一下name。
        news.categoryName = cat.name === '热门' ? news.categories[0].name : cat.name
        return news;
      })
      return cat;
    });
    res.send(cats);
  })


  // 导入英雄数据
  router.get('/heroes/init', async(req,res)=>{
    await Hero.deleteMany({});
    const rawData = [{"name":"热门","heroes":[{"name":"鲁班七号","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"},{"name":"安琪拉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"},{"name":"后羿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg"},{"name":"孙悟空","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"妲己","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"},{"name":"亚瑟","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"瑶","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"},{"name":"韩信","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg"},{"name":"狄仁杰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg"},{"name":"吕布","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"}]},{"name":"战士","heroes":[{"name":"赵云","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"},{"name":"墨子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"},{"name":"钟无艳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"},{"name":"吕布","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"},{"name":"夏侯惇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"},{"name":"曹操","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/128/128.jpg"},{"name":"典韦","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/129/129.jpg"},{"name":"宫本武藏","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/130/130.jpg"},{"name":"达摩","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"},{"name":"老夫子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/139/139.jpg"},{"name":"关羽","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/140/140.jpg"},{"name":"程咬金","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"},{"name":"露娜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"},{"name":"花木兰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"},{"name":"橘右京","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"},{"name":"亚瑟","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"孙悟空","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"刘备","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/170/170.jpg"},{"name":"杨戬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/178/178.jpg"},{"name":"雅典娜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/183/183.jpg"},{"name":"哪吒","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/180/180.jpg"},{"name":"铠","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"},{"name":"苏烈","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"},{"name":"梦奇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"},{"name":"裴擒虎","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"},{"name":"狂铁","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/503/503.jpg"},{"name":"孙策","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"},{"name":"李信","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/507/507.jpg"},{"name":"盘古","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/529/529.jpg"},{"name":"云中君","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"},{"name":"曜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/522/522.jpg"},{"name":"马超","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"},{"name":"蒙恬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"},{"name":"夏洛特","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/536/536.jpg"},{"name":"司空震","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"}]},{"name":"法师","heroes":[{"name":"小乔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/106/106.jpg"},{"name":"墨子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/108/108.jpg"},{"name":"妲己","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/109/109.jpg"},{"name":"嬴政","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/110/110.jpg"},{"name":"高渐离","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/115/115.jpg"},{"name":"孙膑","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"},{"name":"扁鹊","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/119/119.jpg"},{"name":"芈月","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"},{"name":"周瑜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/124/124.jpg"},{"name":"甄姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/127/127.jpg"},{"name":"武则天","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/136/136.jpg"},{"name":"貂蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"},{"name":"安琪拉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/142/142.jpg"},{"name":"露娜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/146/146.jpg"},{"name":"姜子牙","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/148/148.jpg"},{"name":"王昭君","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/152/152.jpg"},{"name":"张良","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/156/156.jpg"},{"name":"不知火舞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"},{"name":"钟馗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"},{"name":"诸葛亮","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/190/190.jpg"},{"name":"干将莫邪","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/182/182.jpg"},{"name":"女娲","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/179/179.jpg"},{"name":"杨玉环","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/176/176.jpg"},{"name":"弈星","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/197/197.jpg"},{"name":"米莱狄","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/504/504.jpg"},{"name":"司马懿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"},{"name":"沈梦溪","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/312/312.jpg"},{"name":"上官婉儿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"},{"name":"嫦娥","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"},{"name":"西施","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/523/523.jpg"},{"name":"司空震","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/537/537.jpg"}]},{"name":"坦克","heroes":[{"name":"廉颇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/105/105.jpg"},{"name":"庄周","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"},{"name":"刘禅","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"},{"name":"钟无艳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/117/117.jpg"},{"name":"白起","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/120/120.jpg"},{"name":"芈月","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/121/121.jpg"},{"name":"吕布","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/123/123.jpg"},{"name":"夏侯惇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/126/126.jpg"},{"name":"达摩","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/134/134.jpg"},{"name":"项羽","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/135/135.jpg"},{"name":"程咬金","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/144/144.jpg"},{"name":"刘邦","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/149/149.jpg"},{"name":"亚瑟","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/166/166.jpg"},{"name":"牛魔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"},{"name":"张飞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"},{"name":"太乙真人","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"},{"name":"东皇太一","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"},{"name":"铠","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/193/193.jpg"},{"name":"苏烈","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/194/194.jpg"},{"name":"梦奇","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/198/198.jpg"},{"name":"孙策","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/510/510.jpg"},{"name":"盾山","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"},{"name":"嫦娥","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/515/515.jpg"},{"name":"猪八戒","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/511/511.jpg"},{"name":"蒙恬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/527/527.jpg"},{"name":"阿古朵","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"}]},{"name":"刺客","heroes":[{"name":"赵云","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/107/107.jpg"},{"name":"阿轲","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/116/116.jpg"},{"name":"李白","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/131/131.jpg"},{"name":"貂蝉","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/141/141.jpg"},{"name":"韩信","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/150/150.jpg"},{"name":"兰陵王","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/153/153.jpg"},{"name":"花木兰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/154/154.jpg"},{"name":"不知火舞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/157/157.jpg"},{"name":"娜可露露","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/162/162.jpg"},{"name":"橘右京","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/163/163.jpg"},{"name":"孙悟空","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/167/167.jpg"},{"name":"百里守约","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"},{"name":"百里玄策","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/195/195.jpg"},{"name":"裴擒虎","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/502/502.jpg"},{"name":"元歌","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/125/125.jpg"},{"name":"司马懿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/137/137.jpg"},{"name":"上官婉儿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/513/513.jpg"},{"name":"云中君","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/506/506.jpg"},{"name":"马超","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/518/518.jpg"},{"name":"镜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/531/531.jpg"},{"name":"澜","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/528/528.jpg"}]},{"name":"射手","heroes":[{"name":"孙尚香","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/111/111.jpg"},{"name":"鲁班七号","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/112/112.jpg"},{"name":"马可波罗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/132/132.jpg"},{"name":"狄仁杰","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/133/133.jpg"},{"name":"后羿","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/169/169.jpg"},{"name":"李元芳","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/173/173.jpg"},{"name":"虞姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/174/174.jpg"},{"name":"成吉思汗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/177/177.jpg"},{"name":"黄忠","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/192/192.jpg"},{"name":"百里守约","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/196/196.jpg"},{"name":"公孙离","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/199/199.jpg"},{"name":"伽罗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/508/508.jpg"},{"name":"蒙犽","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/524/524.jpg"}]},{"name":"辅助","heroes":[{"name":"庄周","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/113/113.jpg"},{"name":"刘禅","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/114/114.jpg"},{"name":"孙膑","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/118/118.jpg"},{"name":"牛魔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/168/168.jpg"},{"name":"张飞","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/171/171.jpg"},{"name":"钟馗","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/175/175.jpg"},{"name":"蔡文姬","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/184/184.jpg"},{"name":"太乙真人","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/186/186.jpg"},{"name":"大乔","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/191/191.jpg"},{"name":"东皇太一","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/187/187.jpg"},{"name":"鬼谷子","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/189/189.jpg"},{"name":"明世隐","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/501/501.jpg"},{"name":"盾山","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/509/509.jpg"},{"name":"瑶","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/505/505.jpg"},{"name":"鲁班大师","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/525/525.jpg"},{"name":"阿古朵","avatar":"https://game.gtimg.cn/images/yxzj/img201606/heroimg/533/533.jpg"}]}]
    // for in 是索引值 for of是具体每项
    for (let cat of rawData) {
      if (cat.name === '热门') {
        continue //直接进入下一循环 ，不录入热门的东西
      }
      // 找到当前分类在数据库中对应的数据
      const category = await Category.findOne({
        name: cat.name
      });
      cat.heroes = cat.heroes.map(hero=> {
        // 可以写成 hero.categories = [category.id] ，但是moongose足够智能，它能找到id并放到categories中。
        hero.categories = [category]
        return hero
      })
      // 录入英雄
      await Hero.insertMany(cat.heroes);
    }
    res.send(await Hero.find())
  })

  // 获取英雄列表
  router.get('/heroes/list', async(reaq, res)=> {
    const parent=  await Category.findOne({
      name: '英雄分类'
    });
    // parent { _id: 600bde69ae7ef620e82ac44e, __v: 0, name: '新闻分类' }
    // aggregate聚合查询 可以同时执行好几次查询，最终得到你想要的结果
    // 效率比上面的查询高得多
    // 在Category表里，先$match找到匹配新闻分类的parentid的项目 即，新闻、公告、活动、赛事；
    // 再找，$lookup 以新闻、公告、活动、赛事的_id,去articles中，找categories字段中与之匹配的_id,并将找到的数据形成newsList数组
    // $addFields 最后再过滤每个newsList的五条数据。
    // 明确 这里的主数组是category,然后每个match下的数组添加一个子数组，叫heroList
    // 列表内容，从heroes中获取，用match到的_id 去匹配 heroes中的categories里边的值，匹配到就拿过来。
    const cats = await Category.aggregate([
      // 多个查询放到一个里边了
      // match指定一个条件查询 类似数据库里的where 和 moongoose中的where 
      // 先找到 Category中 所有parent字段等于上面那个英雄分类的
      {$match: { parent: parent._id }},
      // 去heroes表里，找到与Category中父级id为match到的
      {
        $lookup: {
          from: 'heroes', // 关联的哪个表 也就模型的名字
          localField: '_id', // 主键 本地关联的字段
          foreignField: 'categories', // 外键 article中用到的关联字段
          as: 'heroList' // 起个名字
        }
      },
      // // 每个newsList 只要其中五条
      // {
      //   $addFields: { //添加字段
      //     heroList: {$slice: ['$newsList', 5]}
      //   }
      // }
    ])
    const subCats = cats.map(v=>{
      return v._id;
    }); 
    let obj = {
      name: '热门',
      heroList: await Hero.find().where({
        // $in 需要一个数组，都是_id的数组
        categories: { $in: subCats } 
      }).limit(10).lean()
    };
    cats.unshift(obj);
    // cats.map(cat => {
    //   cat.heroList.map(news=>{
    //     // 热门中每一项 显示的是其真实的title，所以 热门的要改一下name。
    //     news.categoryName = cat.name === '热门' ? news.categories[0].name : cat.name
    //     return news;
    //   })
    //   return cat;
    // });
    res.send(cats);
  })

  // 新闻详情
  router.get('/articles/:id', async (req, res) => {
    // 加一个lean 让它变成一个纯粹的 json对象。
    const data = await Article.findById(req.params.id).lean();
    data.relate = await Article.find().where({
      categories: { $in: data.categories }
    }).limit(2)
    res.send(data);
  })

  // 英雄详情
  router.get('/heroes/:id', async (req,res)=> {
    // 加上lean（）后 再加参数会比较方便；
    const data = await Hero.findById(req.params.id).lean();
    res.send(data);
  })

  app.use('/web/api', router);
}