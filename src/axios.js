import axios from 'axios';
const { REACT_APP_API_URL } = process.env;
const instance = axios.create({
    baseURL: REACT_APP_API_URL
});
const requestHandler = request => {
    const token = localStorage.getItem('luxuri_token');
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    if (token!==null) {
        headers = {
            "Content-Type": "application/json; charset=utf-8"
        };
        headers.Authorization = `Bearer ${token}`;
    }
    request.headers=headers;
  
    return request;
};
const responseHandler = response => {
    return response;
};
const errorHandler = (error) => {
    return Promise.reject(error.response);
};
instance.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

instance.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
 );

export default instance;