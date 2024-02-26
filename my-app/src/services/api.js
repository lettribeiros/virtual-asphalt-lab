import axios from 'axios';

const api = axios.create({
    baseURL: "https://virtual-asphalt-lab-production.up.railway.app"
})

export default api;