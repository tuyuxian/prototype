import axios_api from "axios";

let axiosConfig = {
  baseURL: 'http://127.0.0.1:5000/'
};

let axios = axios_api.create(axiosConfig);

export default axios;