const MovieModel = require('../models/movie.model');
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');


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
    let like = new LikeModel({
        author: req.user._id,
        movie: req.params.id
      });
    
      like.save((error) => {
        if(!error){
    
          UserModel.findById(like.author, (error, user) => {
            if(error)
              return next(error);
        
            user.likes.push(like._id);
            user.save();    
          });
    
          MovieModel.findById(like.movie, (error, movie) => {
            if(error)
              return next(error);
        
            movie.likes.push(like._id);
            movie.save();    
          });
    
          req.flash('createdLike', 'Movie Liked.')
          res.redirect('/movie/' + req.params.id);
        }else{
            return next(error);
        }
      });
};

exports.read = (req, res, next) => {
  let correctUser = false;
  // res.send('Read Movie.');
  MovieModel.findById(req.params.id, (error, movie) => {

    if(error){
      return next(error);
    }

    UserModel.findById(movie.author, (error, user) => {
      if(error)
        return next(error);


      // console.log("REQ: " + req.user);
      // console.log("U: " + user);
      
      if(req.user && user && String(req.user._id) == String(user._id)){
        correctUser = true
        // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA")
      }

      // CommentModel.find((error, comments) => {

      // })

      // console.log(correctUser)
      res.render('movie/read' , {
        layout: 'main',
        movie: movie,
        updatedMovie: req.flash('updatedMovie'),
        notAuthorized: req.flash('notAuthorized'),
        createdComment: req.flash('createdComment'),
        updatedComment: req.flash('updatedComment'),
        deletedComment: req.flash('deletedComment'),
        user: user,
        correctUser: correctUser,
      });
    });

  }).populate({
    path: 'comments',
    populate:{
      path: 'author',
      model: 'UserModel'
    }
  });
};

exports.delete = (req, res, next) => {
  MovieModel.findByIdAndRemove(req.params.id, (error, movie) => {
    if(error){
      return next(error);
    }

    // Moram Izbrisati Iz User Movies Ovaj Movie I Sve Komentare Vezane Za Taj Film Kao i Kad Brisem Komentare Onda I Iz Usera Moram Komentare || Ovo mora da moze lakse

    UserModel.findById(movie.author, (error, user) => {
      if(error)
        return next(error);
  
        // const index = user.movies.indexOf(req.params.id);
        // if (index > -1) {
        //   user.movies.splice(index, 1);
        // }

      user.movies.pull({_id: req.params.id});
      user.save(); 
    });

    CommentModel.find((error, comments) => {
      comments.forEach((comment) => {
        if(String(comment.movie) == String(req.params.id)){
          // Pre Brisanja Komentara Moramo Iz User Comments Arraya Da Izbrisemo Comment

          UserModel.findById(comment.author, (error, user) => {
            if(error)
              return next(error);
        
              // const index = user.comments.indexOf(comment._id);
              // if (index > -1) {
              //   user.comments.splice(index, 1);
              // }
            
              
              user.comments.pull({_id: comment._id});
              user.save(); 
          });

          comment.remove();
        }
      });
    });

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