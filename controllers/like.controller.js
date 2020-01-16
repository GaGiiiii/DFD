const MovieModel = require('../models/movie.model');
const UserModel = require('../models/user.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');


// Operations

exports.create = (req, res, next) => {
    let movieName;

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
        
            movieName = movie.name;
            movie.likes.push(like._id);
            movie.save();    
          });
    
          req.flash('createdLike', 'Movie "' + movieName + '" Liked.');
          res.redirect('/movie/' + req.params.id);
        }else{
            return next(error);
        }
      });
};

exports.delete = (req, res, next) => {
  let movieName;

  LikeModel.findByIdAndRemove(req.params.likeid, async (error, like) => {
    if(error){
      return next(error);
    }

    // Moram Izbrisati Iz User Movies Ovaj Movie I Sve Komentare Vezane Za Taj Film Kao i Kad Brisem Komentare Onda I Iz Usera Moram Komentare || Ovo mora da moze lakse

    await UserModel.findById(like.author, (error, user) => {
      if(error)
        return next(error);
  
        // const index = user.movies.indexOf(req.params.id);
        // if (index > -1) {
        //   user.movies.splice(index, 1);
        // }

      user.likes.pull({_id: req.params.likeid});
      user.save(); 
    });

    await MovieModel.findById(like.movie, (error, movie) => {
      if(error)
        return next(error);
  
        // const index = user.movies.indexOf(req.params.id);
        // if (index > -1) {
        //   user.movies.splice(index, 1);
        // }

      movieName = movie.name;
      movie.likes.pull({_id: req.params.likeid});
      movie.save(); 
    });

    req.flash('deletedLike', 'Movie "' + movieName + '" Unliked.');
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