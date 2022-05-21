import axios from './index';

/**
 * api 4.1.1
 */
export function classGet() {
    return axios.get("/api/class");
}

/**
 * api 4.1.2
 */
export function classCreate(form) {
    return axios.post("/api/class/create", form);
}

/**
 * api 4.1.3
 */
export function classAddMember(form) {
    return axios.post("/api/class/addmember", form);
}

/**
 * api 4.1.4
 * axios delete method need to add request body manually.
 */
export function classDelete(form) {
    return axios.delete("/api/class/delete", { data: form });
}