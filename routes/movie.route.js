const express = require('express');
const router = express.Router();

// Require The Controllers
const movieController = require('../controllers/movie.controller');

// Routes
router.get('/', movieController.getAll);
router.get('/movie/create', movieController.createView);
router.post('/movie/create', movieController.create);
router.get('/movie/:id', movieController.read);
router.get('/movie/update/:id', movieController.updateView);
router.post('/movie/update/:id', movieController.update);
router.post('/movie/delete/:id', movieController.delete);

// Export Router
module.exports = router;