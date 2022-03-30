import axios from './index';

export function registerAccount(form) {
  return axios.post("/api/register", form);
}
