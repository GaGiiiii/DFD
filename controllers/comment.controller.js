const CommentModel = require('../models/comment.model');
const UserModel = require('../models/user.model');
const MovieModel = require('../models/movie.model');


// Operations

exports.create = (req, res, next) => {
    // res.send("Create Comment");
  let comment = new CommentModel({
    body: req.body.commentBody,
    author: req.user._id,
    movie: req.body.movieID
  });

  comment.save(async (error) => {
    if(!error){

      await UserModel.findById(comment.author, (error, user) => {
        if(error)
          return next(error);
    
        user.comments.push(comment._id);
        user.save();    
      });

      await MovieModel.findById(comment.movie, (error, movie) => {
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
  CommentModel.findByIdAndUpdate(req.params.id, {
    body: req.body.commentBodyEdit
  }, (error, comment) => {
    if(error)
      return next(error);
    
    req.flash('updatedComment', 'Comment Successfully Updated.')
    res.redirect('/movie/' + req.body.movieID);
  });
};

exports.delete = (req, res, next) => {
  CommentModel.findByIdAndRemove(req.params.id, (error, comment) => {
    if(error){
      return next(error);
    }

    UserModel.findById(comment.author, (error, user) => {
      if(error)
        return next(error);
  
        // const index = user.comments.indexOf(req.params.id);
        // if (index > -1) {
        //   user.comments.splice(index, 1);
        // }

      user.comments.pull({_id: req.params.id});
      user.save();
    });

    MovieModel.findById(comment.movie, (error, movie) => {
      if(error)
        return next(error);
  
        // const index = movie.comments.indexOf(req.params.id);
        // if (index > -1) {
        //   movie.comments.splice(index, 1);
        // }


        movie.comments.pull({_id: req.params.id});
        movie.save();  
    });

    req.flash('deletedComment', 'Comment Successfully Deleted.')
    res.redirect('/movie/' + req.body.movieID);
  });
};