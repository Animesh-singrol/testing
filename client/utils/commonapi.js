import axios from "axios";

var baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const instance =  axios.create({baseURL:baseURL})
instance.defaults.headers.common['Content-Type'] = 'multipart/form-data';
instance.defaults.withCredentials = true;

export default instance;