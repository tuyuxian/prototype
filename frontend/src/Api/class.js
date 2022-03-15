import axios from './index';

export function getClass() {
    return axios.get("/class");
}

