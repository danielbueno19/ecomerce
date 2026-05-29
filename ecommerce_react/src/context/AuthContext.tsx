import React, { createContext, useContext, useState } from "react";
import {login as loginService, registrar as registrarService, obtenerRol} from "../services/auth";
import {LoginRequest, RegistroRequest} from "../types";

interface AuthContextType {
    token: string | null
    isAdmin: boolean
    login: (data: LoginRequest) => Promise<void>
    registrar: (data: RegistroRequest) => Promise<void>
    logout: ()=> void
}

const AuthContext = createContext<AuthContextType | null>(null)

export  function AuthProvider({children}: {children: React.ReactNode}) {
    const [token, setToken] = useState<string|null>(localStorage.getItem('token'))
    const [isAdmin, setIsAdmin] = useState(false)

    const login = async (data: LoginRequest) => {
        // POST /api/auth/login → devuelve el token como string
        const jwt = await loginService(data)
        localStorage.setItem('token', jwt)
        setToken(jwt)

        // GET /api/auth/usuario/rol → "ROLE_ADMIN" o "ROLE_USER"
        const rol = await obtenerRol()
        setIsAdmin(rol === 'ROLE_ADMIN')
    }

    const registrar = async (data: RegistroRequest) => {
        // POST /api/auth/registar
        await registrarService(data)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        setIsAdmin(false)
    }

    return (
        <AuthContext.Provider value={{token, isAdmin, login, registrar, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const contexto = useContext(AuthContext)
    if(!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return contexto
}