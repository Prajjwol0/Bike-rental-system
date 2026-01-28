import axios from "axios";
import { ENV } from "./env";

export const httpClient = axios.create({
  baseURL: ENV.baseAppUrl,
  withCredentials:true
});


