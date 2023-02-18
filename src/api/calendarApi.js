import axios from "axios";
import { getVariables } from "../helpers/getVariables";

const { VITE_API_URL } = getVariables();

const calendarApi = axios.create({
  baseURL: VITE_API_URL,
});

//Interceptores
calendarApi.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    Authorization: "bearer " + localStorage.getItem("token"),
  };
  return config;
});

export default calendarApi;
