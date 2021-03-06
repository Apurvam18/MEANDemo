var express = require('express');
var mongoose=require('mongoose');
var passport= require("passport");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var Post=mongoose.model("Post");
var Comment=mongoose.model("Comment");
var User=mongoose.model('User');

router.get('/posts', function (req, res, next) {
  console.log("req"+req.body);
  Post.find(function (err,posts) {
    if (err) {
      return next(err);
    }
    res.json(posts);
  });
});

router.post('/posts',function (req,res,next) {
  var post=new Post(req.body);
  console.log("req:"+req.body);
    post.save(function (err,post) {
    if(err){return next(err);}
    res.json(post);
  });
});

router.param('post',function (req,res,next,id) {
  var query=Post.findById(id);

  query.exec(function (err, post) {
    if (err) { return next(err);}
    if(!post){return next(new Error("can't find post")); }
    req.post=post;
    return next();
  });
});

router.get('/posts/:post',function (req,res) {
  req.post.populate('comments',function (err,post) {
    if(err){return next(err);}
    console.log(post);
    res.json(post);
  });
});

router.put('/posts/:post/upvote', function (req, res, next) {
  req.post.upvote(function (err ,post) {
    if (err) {
      return next(err);
    }
    res.json(post);
  });
});

router.post("/posts/:post/comments",function (req, res ,next) {
  var comment= new Comment(req.body);
  console.log(req.body);
  comment.post=req.post;

  comment.save(function (err,comment) {
    if(err){return next(err);}

    req.post.comments.push(comment);
    req.post.save(function (err,post) {
      if(err){return next(err);}
      res.json(comment);
    });
  });
});

router.param("comment",function (req,res,next,id) {
  var query=Comment.findById(id);

  query.exec(function (err,comment) {
    if(err){ return next(err);}
    if(!comment){return next(new Error("can't find comment"));}
    req.comment=comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote',function (req,res,next) {
  req.comment.upvote(function (err,comment) {
    if(err){return next(err);}
    res.json(comment);
  });
});

router.post('/register',function (req,res,next) {
  if(!req.body.username|| !req.body.password){
    return res.status(400).json({message:"Please fill out all the fields"});
  }
  var user=new User;
  User.username=res.body.username;
  User.setPassword(req.body.password);
  user.save(function (err) {
    if(err){return next(err); }
    return res.json({token:user.generateJWT()});
  });
});
module.exports = router;
