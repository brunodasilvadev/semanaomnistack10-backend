const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')
const { findConnections, sendMessage } = require('../websocket')

module.exports = {

  async getAll(request, response){
    const devs = await Dev.find();
    
    return response.json(devs);
  },

  async getByGeoAndTechs(request, response){
    const { latitude, longitude, techs } = request.query;

    const techsList = parseStringAsArray(techs);

    const devs = await Dev.find({
      techs: {
        $in: techsList,
      },
      location: {
        $near: {
          $geometry:{
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: 10000,
        },
      },
    });    
    
    return response.json({ devs })
  },

  async post(request, response) {
    const { githubUserName, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ githubUserName });

    if(!dev){
      const apiResponse = await axios.get(`https://api.github.com/users/${githubUserName}`)

      const { name = login, avatar_url, bio } = apiResponse.data;
  
      const techsList = parseStringAsArray(techs);
  
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      }
  
      dev = await Dev.create({
        githubUserName,
        name,
        avatarUrl: avatar_url,
        bio,
        techs: techsList,
        location
      })

      // Filtrar as conexões que estão há no máximo 10km de distância e que o novo dev tenha pelo menos uma das
      // tecnologias filtradas
      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsList,
      )

      sendMessage(sendSocketMessageTo, 'new-dev', dev);
    }

    return response.json(dev);
  }
};