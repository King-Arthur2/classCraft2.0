import axios from "axios";
 
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const intance = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
})

export default intance;