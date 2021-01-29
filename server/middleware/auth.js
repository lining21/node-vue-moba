module.exports = options => {
  const jwt = require('jsonwebtoken');
  const AdminUser = require('../models/AdminUser');
  const assert = require('http-assert');
  return async (req, res, next) => {
    const token = (req.headers.authorization || '').split(' ').pop();
    assert(token, 401, '请提供jwt token');
    const { id } = jwt.verify(token, req.app.get('secret'));
    assert(id, 401, 'wujwt token');
    req.user = await AdminUser.findById(id);
    assert(req.user, 401, '请先登录');
    await next()
  };
}

// module.exports = options => async (req, res, next) => {
//     const token = (req.headers.authorization || '').split(' ').pop();
//     assert(token, 401, '请提供jwt token');
//     const { id } = jwt.verify(token, app.get('secret'));
//     assert(id, 401, 'wujwt token');
//     req.user = await AdminUser.findById(id);
//     assert(req.user, 401, '请先登录');
//     await next()
// };