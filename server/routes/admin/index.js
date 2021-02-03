// const Category = require('../../models/Category');

const AdminUser = require('../../models/AdminUser');

module.exports = app => {
  const express = require('express');
  const jwt = require('jsonwebtoken');
  const AdminUser = require('../../models/AdminUser');
  const assert = require('http-assert');


  const router = express.Router({
    // 合并url参数 将app.use父级的参数与url里内部参数合并
    mergeParams: true
  });
  // const Category = require('../../models/Category')
  // 创建资源
  router.post('/', async (req,res) => {
    console.log(req.body);
    // const Model = require(`../../modles/${req.params.resource}`)
    const model = await req.Model.create(req.body);
    res.send(model);
  });
  // 更新资源
  router.put('/:id', async (req,res) => {
    console.log(req.body);
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });
  // 删除资源
  router.delete('/:id', async (req,res) => {
    console.log(req.body);
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true
    });
  });
// 资源列表
  router.get('/', async (req,res) => {
    console.log(req.body);
    const queryOptions = {};
    if (req.Model.modelName === "Category") {
      queryOptions.populate = 'parent';
    }
    // populate 关联查询
    // const items = await req.Model.find().populate('parent').limit(10);
    // .setOptions(queryOptions)详解
    // 如果设置上关联查询选项，parent本身只有id，
    // 设置上这个选项后，就可以查到这个id下对应的所有信息
    // 并以{}的形式返回，其中parent为其中一项，还包含_id等；
    const items = await req.Model.find().setOptions(queryOptions).limit(100);
    res.send(items);
  });
// 资源详情
  router.get('/:id', async (req,res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
// 登录校验中间件。
  const authMiddleware = require('../../middleware/auth');
  // 获取资源中间件。
  const resourceMiddleware = require('../../middleware/resource')
  // app.use url后跟着好多function 为中间件，
  // 当中间件完成处理 next后，再处理后续的，
  // 链式处理
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router);



  const multer = require('multer');
  // 定义上传的目标地址
  const upload = multer({dest:__dirname+ '/../../uploads'})
  // upload.single('file') 中的file是字段名，即以formdata数据格式，里边的字段为file，value是二进制文件。
  app.use('/admin/api/upload', authMiddleware(), upload.single('file'), (req,res) => {
    const file = req.file;
    file.url = `http://localhost:3000/uploads/${file.filename}`
    // 上传文件可见
    res.send(file);
  })

  app.post('/admin/api/login', async(req,res) => {
    const { username, password } = req.body;
    // 1.根据用户名找用户
    // 之前定义查询不查出来密码，.select('+password'); 可以查出来密码。
    const user = await AdminUser.findOne({ username }).select('+password');
    assert(user, 422, '用户不存在');
    // if (!user) {
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }
    // 2.校验密码
    const isValid = require('bcrypt').compareSync(password, user.password);
    assert(isValid, 422, '密码不正确');
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码不正确'
    //   })
    // }
    // 3.返回token
    // 1.要放在token里的数据，不是简单地字符串，而是拿到一个数据进行散列再生成字符串
    // 2.秘钥
    const token = jwt.sign(
      {
        id: user._id,
        _id: user._id,
        username: user.username
      },
      app.get('secret')
    );
    res.send({token});
  })

  // 错误处理函数
  app.use(async (err, req, res, next)=> {
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
};