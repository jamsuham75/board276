var router = require('express').Router();

//MongoDB 연동
let mydb;
const mongoClient = require('mongodb').MongoClient;
const url = process.env.DB_URL;

mongoClient.connect(url).then(client=>{
    console.log('몽고DB 접속');
    mydb = client.db('myboard');
})

//세션 라이브러리 추가
const session = require('express-session');
router.use(session({
    secret : 'dkfjdiue9343j9',
    resave : false,
    saveUninitialized : true
}))

const sha = require('sha256');


router.get('/login', function(req, res){
    console.log(req.session);
    if(req.session.user){
        console.log('세션유지');
        res.render('index.ejs', {user : req.session.user});
    }else{
        res.render("login.ejs");
    }  
})

router.post('/login', function(req, res){
    console.log(req.body.userid);
    console.log(req.body.userpw);

    mydb.collection("account").findOne({userid : req.body.userid})
    .then((result)=>{
        console.log(result);
        if(result.userpw == sha(req.body.userpw)){
            req.session.user = req.body;
            console.log('새로운 로그인');
            res.render('index.ejs', {user : req.session.user});
        }else{
            res.render('login.ejs');
        }
    })
})


module.exports = router;