import axios from "axios";

export const api = axios.create({
  baseURL: "/api", //the domain is the same of frontend, so i can omit it
});
