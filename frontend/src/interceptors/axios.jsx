import axios from "axios";
import api from "../api";

let refresh = false;

axios.interceptors.response.use(resp => 
    resp, async error => {
        if (error.response.status === 401 && !refresh){
            refresh = true;
            console.log(localStorage.getItem('refresh_token'))
            api.post('api/token/refresh', {
                refresh:localStorage.getItem('refresh_token')
            }, { headers: {
                'Content-Type': 'application/json'
            }}, {withCredentials: true});
            if (response.status === 200) {
                axios.defaults.headers.common['Authorization'] = 
                `Bearer ${response.data['access']}`;
                localStorage.setItem('access_token', response.data.access);
                return axios(error.config);
            }
        }
        refresh = false;
        return error;
    })