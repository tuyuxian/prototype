import axios_api from "axios";

let axiosConfig = {
  // set localhost:3000 here to deal with same-origin issue
  baseURL: 'http://localhost:3000/'
};

let axios = axios_api.create(axiosConfig);

export default axios;