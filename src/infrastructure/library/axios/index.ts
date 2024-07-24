import axios from "axios";

export const instanceOfAxios = axios.create({
    baseURL: 'https://sandbox-api.paddle.com/',
    headers: {
        'Authorization': `Bearer ${process.env.API_KEY_PADDLE}`
    }
})