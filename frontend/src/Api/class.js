import axios from './index';

export function classGet() {
    return axios.get("/api/class");
}

export function classCreate(form) {
    return axios.post("/api/class/create", form);
}

export function classAddMember(form) {
    return axios.post("/api/class/addmember", form);
}

export function classDelete(form) {
    // axios delete method need to add request body manually.
    return axios.delete("/api/class/delete", { data: form });
}

