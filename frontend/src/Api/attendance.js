import axios from './index';

export function getAttendance() {
  return axios.get("/Attendance/c4f55a14-0f4b-4241-8764-1bbbeffe064e");
}

export function newAttendance(form) {
  return axios.post("/Attendance/create", form);
}

export function updateNote(form) {
  return axios.put("/Attendance/note", form);
}

export function updateCheck(form) {
  return axios.put("/Attendance/check", form);
}