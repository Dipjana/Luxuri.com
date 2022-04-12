// import axios from './axios';
import axios from 'axios';

export default function api(url, data = {}, method = "GET"){
    if(method.toLowerCase()==='get'){
        return axios.get(url);
    }else if(method.toLowerCase()==='post'){
        return axios.post(url, data);
    }else if(method.toLowerCase()==='put'){
        return axios.put(url, data);
    }

}