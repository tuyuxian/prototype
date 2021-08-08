import axios from './index';

export function login(form) {
  return axios.post("/Login", form);
}

export function forgetpwd(form) {
  return axios.post("/Forget", form)
}

export function resetpwd(form) {
  return axios.put("/Reset", form)
}