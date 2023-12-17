import axios from "axios";

const url = 'http://localhost:3000';

export const fetchPost = () => axios.get(url);
