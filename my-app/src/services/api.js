import axios from 'axios';

const api = axios.create({
    baseURL: "http://virtual-asphalt-lab-production.up.railway.app"
})

export default api;