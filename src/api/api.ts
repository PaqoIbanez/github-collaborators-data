import axios from 'axios';

export const gitgubApi = axios.create({
   baseURL: 'https://api.github.com'
});
