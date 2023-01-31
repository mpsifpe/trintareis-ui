import axios from "axios";

const api = axios.create({
    baseURL: 'https://trintareis-hml.herokuapp.com'
})

export default api;