const { Router } = require('express');
const DevController = require('../controllers/DevController')

const routes = Router();

routes.get('/devsByGeoAndTechs', DevController.getByGeoAndTechs)
routes.get('/devs', DevController.getAll)
routes.post('/devs', DevController.post);

module.exports = routes;