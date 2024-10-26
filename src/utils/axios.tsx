import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_BASEURL,
    withCredentials: true
})

export default axiosInstance