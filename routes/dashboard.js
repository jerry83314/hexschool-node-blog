var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

const categoriesRef = firebaseAdminDB.ref('/categories/');

router.get('/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/categories', function(req, res, next) {
  // 從 firebase 取得資料
  categoriesRef.once('value').then(function(snapshot) {
    const categories = snapshot.val();
    // render 完把資料帶進前端
    res.render('dashboard/categories', { 
      categories
    });
  })
});

router.post('/categories/create', function(req, res) {
  const data = req.body;

  // 取得 firebase 上的亂數 key
  const categoryRef = categoriesRef.push();
  const key = categoryRef.key;

  // 把 key 設為 id
  data.id = key;

  // 寫進 firebase 內
  categoryRef.set(data).then(function() {
    // 成功後轉址
    res.redirect('/dashboard/categories');
  });
});

router.post('/categories/delete/:id', function(req, res) {
  const id = req.param('id');
  categoriesRef.child(id).remove();
  res.redirect('/dashboard/categories');
});

module.exports = router;