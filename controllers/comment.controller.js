const CommentModel = require('../models/comment.model');
const UserModel = require('../models/user.model');
const MovieModel = require('../models/movie.model');


// Operations

exports.getAll = function (req, res) {
  MovieModel.find((error, movies) => {
    if(error){
      console.log('Error | getAllMovies.' + error);
    }else{
      res.render('index' , {
        layout: 'main',
        createdMovie: req.flash('createdMovie'),
        deletedMovie: req.flash('deletedMovie'),
        userRegistered: req.flash('userRegistered'),
        userLoggedOut: req.flash('userLoggedOut'),
        alreadyLoggedIn: req.flash('alreadyLoggedIn'),
        message: req.flash('error'),
        success: req.flash('success'),
        movies: movies,
      });
    }
  }).populate('author');
};

exports.create = (req, res, next) => {
    // res.send("Create Comment");
  let comment = new CommentModel({
    body: req.body.commentBody,
    author: req.user._id,
    movie: req.body.movieID
  });

  comment.save((error) => {
    if(!error){

      UserModel.findById(comment.author, (error, user) => {
        if(error)
          return next(error);
    
        user.comments.push(comment._id);
        user.save();    
      });

      MovieModel.findById(comment.movie, (error, movie) => {
        if(error)
          return next(error);
    
        movie.comments.push(comment._id);
        movie.save();    
      });

      req.flash('createdComment', 'Comment Successfully Sent.')
      res.redirect('/movie/' + req.body.movieID);
    }else{
        return next(error);
    }
  });
};

exports.update = (req, res, next) => {
  MovieModel.findByIdAndUpdate(req.params.id, {
    $set: req.body
  }, (error, movie) => {
    if(error)
      return next(error);
    
    req.flash('updatedMovie', 'Movie "' + req.body.name + '" Successfully Updated.')
    res.redirect('/movie/' + req.params.id);
  });
};

exports.delete = (req, res, next) => {
  MovieModel.findByIdAndRemove(req.params.id, (error, movie) => {
    if(error){
      return next(error);
    }

    req.flash('deletedMovie', 'Movie "' + movie.name + '" Successfully Deleted.')
    res.redirect('/');
  });
};

function handleValidationErrors(error, body){
  for(field in error.errors){
    switch(error.errors[field].path){
      case 'name':
        body['nameError'] = error.errors[field].message;
        break;
      case 'description':
        body['descriptionError'] = error.errors[field].message;
        break;
    }
  }
}