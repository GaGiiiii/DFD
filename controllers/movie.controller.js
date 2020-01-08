const MovieModel = require('../models/movie.model');
const UserModel = require('../models/user.model');

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

exports.createView = (req, res) => {
  res.render('movie/createORupdate' ,{
    title: 'Suggest New Movie',
    layout: 'main'
  });
};

exports.create = (req, res, next) => {
  // res.send("ouuu shit");
  let movie = new MovieModel({
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    author: req.user._id
  });

  

  movie.save((error) => {
    if(!error){

      UserModel.findById(movie.author, (error, user) => {
        if(error)
          return next(error);
    
        user.movies.push(movie._id);
        user.save();    
      });

      req.flash('createdMovie', 'Movie "' + req.body.name + '" Successfully Suggested.')
      res.redirect('/');
    }else{
      if(error.name == 'ValidationError'){
        handleValidationErrors(error, req.body);
        res.render("movie/createORupdate", {
          title: "Suggest New Movie",
          movie: req.body
        });
      }
      else
        console.log("Error: " + error);
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

      // console.log(correctUser)
      res.render('movie/read' , {
        layout: 'main',
        movie: movie,
        updatedMovie: req.flash('updatedMovie'),
        notAuthorized: req.flash('notAuthorized'),
        createdComment: req.flash('createdComment'),
        user: user,
        correctUser: correctUser
      });
    });

  });
};

exports.updateView = (req, res, next) => {
  MovieModel.findById(req.params.id, (error, movie) => {
    if(error){
      return next(error);
    }

    // console.log("\n\n\nMOVIE: " + movie.author + ".");
    // console.log("AUTHOR: " + req.user._id + ".\n\n\n\n");

    let omg1 = String (movie.author);
    let omg2 = String(req.user._id);

    if(omg1 == omg2){
      // console.log("DSADSADAS");
    }

    if(omg1 != omg2){
      req.flash('notAuthorized', 'Not Authorized.');
      res.redirect('/movie/' + movie._id);
    }else{
      res.render('movie/createORupdate', {
        title: 'Update Movie "' + movie.name + '".',
        layout: 'main',
        movie: movie,
        updating: true,
      });
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

// exports.update = (req, res) => {
//   MovieModel.findOneAndUpdate({
//     _id: req.body._id,
//   }, req.body, {
//       new: true,
//       runValidators: true
//   }, (error, movie) => {

//     console.log(movie);
//     if(!error){
//       req.flash('updatedMovie', 'Movie "' + req.body.name + '" Successfully Updated.')
//       res.redirect('/movie/' + req.params.id);
//     }else{
//       if(error.name == "ValidationError"){
//         handleValidationErrors(error, req.body);
//         res.render("movie/createORupdate", {
//           title: 'Update Movie "' + req.body.name + '".',
//           movie: movie,
//           updating: true
//         });
//       }else{
//         console.log("Error: " + error);
//       }
//     }
//   });
// };

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