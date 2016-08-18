var express = require('express');
var router = express.Router();
var fun = require("../model/mysqlBaseFun");
var User = require("../model/user");
var crypto = require('crypto');
//主页面
router.get('/', function(req, res) {
	res.render('admin');
});
// router.get('/login', checkNotLogin);
router.get('/login', function(req, res) {
	res.render('index', {
		title: '登录',
		user: req.session.user
	});
});
// router.post('/login', checkNotLogin);
router.post('/login', function(req, res) {
	// var md5 = crypto.createHash('md5');
	// var	password = md5.update(req.body.password).digest('base64');
	var password=req.body.pass;
	User.get(req.body.name, function(user) {
		if (!user) {
			return res.send("error");
		}
		if (user.pass != password) {
			return res.send("error");
		}
		// req.session.user = user;
		res.send('success');
	});
});

function checkLogin(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		return res.redirect('/');
	}
	next();
}
module.exports = router;