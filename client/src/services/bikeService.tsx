import { httpClient } from "@/api/auth.api";
import { endpoints } from "@/constants/endpoints";
import type { AuthResponse, ILogout, LoginPayload, RegisterPayload } from "@/types/auth.types";

export const loginUser = (data: LoginPayload) =>
  httpClient.post(endpoints.login, data);

export const registerUser = (data: RegisterPayload) =>
  httpClient.post(endpoints.register, data);

export const getCurrentUser = () => httpClient.get<AuthResponse>(endpoints.me);

export const getSingleId = (id: string | number) =>
  httpClient.get<AuthResponse>(endpoints.getById(id));

export const logoutApi=()=>
  httpClient.post<ILogout>(endpoints.logoutApi);
