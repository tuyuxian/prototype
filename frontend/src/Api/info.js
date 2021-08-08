import axios from './index';

export function getProfile() {
    return axios.get("/myprofile");
}

export function profileModify(form) {
    return axios.put("/myprofile/modify", form);
}