import axios from './index';

/**
 * api 4.2.1
 */
export function todoGet() {
    return axios.get("/api/todo");
}

/**
 * api 4.2.2
 */
export function todoUpcomingEdit(form) {
    return axios.put("/api/todo/upcoming", form);
}

/**
 * api 4.2.3
 */
export function todoUpcomingCreate(form) {
    return axios.post("/api/todo/upcoming", form);
}

/**
 * api 4.2.4
 */
export function todoUpcomingDelete(form) {
    return axios.delete("/api/todo/upcoming/delete", { data: form });
}

/**
 * api 4.2.5
 */
export function todoUpcomingFinish(form) {
    return axios.post("/api/todo/upcoming/finish", form);
}

/**
 * api 4.2.6
 */
export function todoDoneUndo(form) {
    return axios.put("/api/todo/done/undo", form);
}

/**
 * api 4.2.7
 */
export function todoUpcomingGet() {
    return axios.get("/api/todo/upcoming");
}

/**
 * api 4.2.8
 */
export function todoDoneGet() {
    return axios.get("/api/todo/done");
}

