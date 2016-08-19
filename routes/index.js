var express = require('express');
var router = express.Router();
var fun = require("../model/mysqlBaseFun");
var User = require("../model/user");
var crypto = require('crypto');

router.get('/admin/login', checkNotLogin);
router.get('/admin/login', function(req, res) {
	res.render('index', {
		title: '登录',
		user: req.session.user
	});
});

router.post('/admin/login', checkNotLogin);
router.post('/admin/login', function(req, res) {
	// var md5 = crypto.createHash('md5');
	// var	password = md5.update(req.body.password).digest('base64');
	var password = req.body.password;
	User.get(req.body.name, function(user) {
		if (!user) {
			return res.redirect('/admin/login');
		}
		if (user.pass != password) {
			return res.redirect('/admin/login');
		}
		req.session.user = user;
		res.redirect('/admin');
	});
});


router.get('/admin', checkLogin);
router.get('/admin', function(req, res) {
	fun.query("select * from user where name<>'admin'", function(rows) {
		console.dir(rows);
		res.render('admin', {
			title: '管理',
			userList: rows
		});
	})
});


router.post('/addUser', function(req, res) {
	var password = req.body.password;
	var name = req.body.name;
	var newUser = new User({
		name: name,
		password: password
	});
	newUser.save(function(result,id) {
		if (result == 1)
			res.json({id:id});
		else
			res.send("error");
	});
});
router.post('/deleteUser', function(req, res) {
	var id = req.body.id;
	fun.query("delete  from user where id="+id+"", function(result) {
		console.dir("result"+result)
		console.dir(result)

		if (result.affectedRows== 1)
			res.send("success");
		else
			res.send("error");
	})
});

router.post('/login', function(req, res) {
	var password = req.body.pass;
	User.get(req.body.name, function(user) {
		if (!user) {
			return res.send("error");
		}
		if (user.pass != password) {
			return res.send("error");
		}
		res.send('success');
	});
});

function checkLogin(req, res, next) {
	if (!req.session.user) {
		return res.redirect('/admin/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		return res.redirect('/admin');
	}
	next();
}
module.exports = router;