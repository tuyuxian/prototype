import axios from './index';

export function register(form) {
  return axios.post("/Register", form);
}
