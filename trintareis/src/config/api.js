import axios from "axios";

const api = axios.create({
    baseURL: 'https://trintareis.herokuapp.com/'
})

export default api;