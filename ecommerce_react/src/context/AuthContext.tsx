import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {login as loginService, registrar as registrarService, obtenerRol} from "../services/auth";
import {LoginRequest, RegistroRequest} from "../types";

interface AuthContextType {
    token: string | null
    isAdmin: boolean
    cargandoRol: boolean
    login: (data: LoginRequest) => Promise<void>
    registrar: (data: RegistroRequest) => Promise<void>
    logout: ()=> void
}

const AuthContext = createContext<AuthContextType | null>(null)

export  function AuthProvider({children}: {children: React.ReactNode}) {
    const [token, setToken] = useState<string|null>(localStorage.getItem('token'))
    const [isAdmin, setIsAdmin] = useState(false)
    const [cargandoRol, setCargandoRol] = useState(!!localStorage.getItem('token'))
    const inicializado = useRef(false)

    // Corre solo una vez al montar: recupera el rol si ya hay token guardado
    useEffect(() => {
        if (inicializado.current) return
        inicializado.current = true
        if (token) {
            obtenerRol()
                .then(rol => {
                    setIsAdmin(rol === 'ADMIN')
                })
                .catch(() => {
                    localStorage.removeItem('token')
                    setToken(null)
                })
                .finally(() => setCargandoRol(false))
        } else {
            setCargandoRol(false)
        }
    }, [])

    const login = async (data: LoginRequest) => {
        // POST /api/auth/login → devuelve el token como string
        const jwt = await loginService(data)
        localStorage.setItem('token', jwt)
        setToken(jwt)

        // GET /api/auth/usuario/rol → "ADMIN" o "USER"
        const rol = await obtenerRol()
        setIsAdmin(rol === 'ADMIN')
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
        <AuthContext.Provider value={{token, isAdmin, cargandoRol, login, registrar, logout}}>
            {cargandoRol ? null: children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const contexto = useContext(AuthContext)
    if(!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')
    return contexto
}