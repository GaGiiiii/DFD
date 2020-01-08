const express = require('express');
const router = express.Router();

// Require The Controllers
const commentController = require('../controllers/comment.controller');

// Routes

// router.get('/comment/create', ensureAuthenticated, movieController.createView);
router.post('/comments/create', commentController.create);
router.post('/comments/update/:id', commentController.update);
router.post('/comments/delete/:id', commentController.delete);

//Access Control

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('notLoggedIn', "Please Login.");
    res.redirect('/login');
  }
}

// Export Router
module.exports = router;