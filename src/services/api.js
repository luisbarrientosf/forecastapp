import axios from 'axios';
import { API_URL } from '../configs/env';

function config() {
  return axios.create({
    baseURL: API_URL
  });
}

export const get = (url, parameters) => {
  const instance = config();
  const datas = {
    params: parameters
  };
  return instance.get(url, datas);
};