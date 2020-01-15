const MovieModel = require('../models/movie.model');
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');


// Operations

exports.create = (req, res, next) => {
    let like = new LikeModel({
        author: req.user._id,
        movie: req.params.id
      });
    
      like.save(async (error) => {
        if(!error){
    
         await UserModel.findById(like.author, (error, user) => {
            if(error)
              return next(error);
        
            user.likes.push(like._id);
            user.save();    
          });
    
          await MovieModel.findById(like.movie, (error, movie) => {
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

exports.delete = (req, res, next) => {
  LikeModel.findByIdAndRemove(req.params.likeid, (error, like) => {
    if(error){
      return next(error);
    }

    // Moram Izbrisati Iz User Movies Ovaj Movie I Sve Komentare Vezane Za Taj Film Kao i Kad Brisem Komentare Onda I Iz Usera Moram Komentare || Ovo mora da moze lakse

    UserModel.findById(like.author, (error, user) => {
      if(error)
        return next(error);
  
        // const index = user.movies.indexOf(req.params.id);
        // if (index > -1) {
        //   user.movies.splice(index, 1);
        // }

      user.likes.pull({_id: req.params.likeid});
      user.save(); 
    });

    MovieModel.findById(like.movie, (error, movie) => {
      if(error)
        return next(error);
  
        // const index = user.movies.indexOf(req.params.id);
        // if (index > -1) {
        //   user.movies.splice(index, 1);
        // }

      movie.likes.pull({_id: req.params.likeid});
      movie.save(); 
    });

    req.flash('deletedLike', 'Movie Unliked.');
    res.redirect('/movie/' + req.params.id);
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