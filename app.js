var express = require('express');
var bodyParser = require('body-Parser');
var path = require('path');
var expressvalidator = require('express-validator');
var util = require('util');
var mongojs = require('mongojs');
var db = mongojs('customer_app', ['users']);
var ObjectId=mongojs.ObjectId;

var app = express();



/*
var logger = function (req, res, next) {
    console.log('Logging...');
    next();
}
*/

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressvalidator());
app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
    db.users.find(function (err, docs) {
        res.render('index', {
            people: docs
        }
        )
    })

});

app.post('/addusers', function (req, res) {

    req.checkBody('name', 'Please enter a name').notEmpty();
    req.checkBody('age', 'Please enter a Valid Age').isInt();
    req.checkBody('email', 'Please enter a Valid email').isEmail();

    var errors = req.validationErrors();
    if (errors) {
        db.users.find(function (err, docs) {
            res.render('index', {
                people: docs,
                errors: errors
            }
            )
        })
    }
    else {
        var user = {
            name: req.body.name,
            Age: req.body.age,
            email: req.body.email
        }
        db.users.insert(user, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        })
    }
}
)

app.delete('/users/delete/:id', function (req, res) {
    db.users.remove({ _id: ObjectId(req.params.id)}, function (err, result) {
        if(err){
            console.log(err);
        }else{
        res.redirect('/');
        }
    });
});

app.listen(3000, function () {
    console.log("server started at port 3000")
})