var sqlFun=require("./mysqlBaseFun");
function User(user){
    this.name = user.name;
    this.password = user.password;
};

User.prototype.save = function (callback) {
    var post  = {
        name:this.name,
        password: this.password
    };
    var query = mysql.query('INSERT INTO users SET ?', post, function(err, result) {
        if(err){
            callback(err);
        }
        callback(err, result);
    });
};

//几个路由共用，所以为静态方法
User.get = function (username, callback) {
    var query = username;
    var sql = 'SELECT * FROM user WHERE `name`="'+query+'"';
    sqlFun.query(sql,  function(rows) {
        var row = rows ? rows[0] : [];
        callback(row);
    });
};

module.exports = User;

