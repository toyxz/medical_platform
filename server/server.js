const axios = require('axios');
import api from '../src/common/api.js/index.js';

console.log(api.getMedicalData);

async function getUser() {
    try {
      const response = await axios.get('/user?ID=12345');
      console.log(response);
    } catch (error) {
      console.error(error);
    }
}

const server = {
    "getMedicalData": getUser  
}
export default  server;

// server如何封装，待解决

