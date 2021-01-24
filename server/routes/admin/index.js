// const Category = require('../../models/Category');

module.exports = app => {
  const express = require('express');
  const router = express.Router({
    // 合并url参数 将app.use父级的参数与url里内部参数合并
    mergeParams: true
  });
  // const Category = require('../../models/Category')

  router.post('/', async (req,res) => {
    console.log(req.body);
    // const Model = require(`../../modles/${req.params.resource}`)
    const model = await req.Model.create(req.body);
    res.send(model);
  });

  router.put('/:id', async (req,res) => {
    console.log(req.body);
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
    res.send(model);
  });

  router.delete('/:id', async (req,res) => {
    console.log(req.body);
    const model = await req.Model.findByIdAndDelete(req.params.id, req.body);
    res.send({
      success: true
    });
  });

  router.get('/', async (req,res) => {
    console.log(req.body);
    const queryOptions = {};
    if (req.Model.modelName === "Category") {
      queryOptions.populate = 'parent';
    }
    // populate 关联查询
    // const items = await req.Model.find().populate('parent').limit(10);
    const items = await req.Model.find().setOptions(queryOptions).limit(10);
    res.send(items);
  });

  router.get('/:id', async (req,res) => {
    const model = await req.Model.findById(req.params.id);
    res.send(model);
  });
  // app.use url后跟着好多function 为中间件，
  // 当中间件完成处理 next后，再处理后续的，
  // 链式处理
  app.use('/admin/api/rest/:resource', async (req,res,next)=> {
    const ModelName = require('inflection').classify(req.params.resource);
    req.Model = require(`../../models/${ModelName}`);  
    next();
  },router);



  const multer = require('multer');
  // 定义上传的目标地址
  const upload = multer({dest:__dirname+ '/../../uploads'})
  app.use('/admin/api/upload', upload.single('file'), (req,res) => {
    const file = req.file;
    file.url = `http://localhost:3000/uploads/${file.filename}`
    // 上传文件可见
    res.send(file);
  })
};