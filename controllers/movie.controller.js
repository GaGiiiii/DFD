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
        movies: movies,
      });
    }
  });
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
    image: req.body.image
  });

  movie.save((error) => {
    if(!error){
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
  // res.send('Read Movie.');
  MovieModel.findById(req.params.id, (error, movie) => {
    if(error){
      return next(error);
    }

    res.render('movie/read' , {
      layout: 'main',
      movie: movie,
      updatedMovie: req.flash('updatedMovie'),
    });
  });
};

exports.updateView = (req, res, next) => {
  MovieModel.findById(req.params.id, (error, movie) => {
    if(error){
      return next(error);
    }

    res.render('movie/createORupdate', {
      title: 'Update Movie "' + movie.name + '".',
      layout: 'main',
      movie: movie,
      updating: true
    });
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