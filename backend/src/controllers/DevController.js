const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray')

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

      console.log(apiResponse)
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
    }

    return response.json(dev);
  }
};