import api from "./api";
import type {LoginRequest, RegistroRequest} from "../types";

export const login = (data: LoginRequest) =>
    api.post<string>('/auth/login', data).then(res => res.data)

export const registrar = (data: RegistroRequest) =>
    api.post<string>('/auth/registrar', data).then(res => res.data)

export const obtenerRol = () =>
    api.get<string>('/auth/usuario/rol').then(res => res.data)