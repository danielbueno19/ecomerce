import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
    token: string | null
    isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export  function AuthProvider({children}: {children: React.ReactNode}) {
    const [token] = useState<string|null>(localStorage.getItem('token'))
    const isAdmin = false

    return (
        <AuthContext.Provider value={{token, isAdmin}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    const contexto = useContext(AuthContext)
    if(!contexto) throw new Error('useAuth debe usarse dentro de AuthProvider')

    return contexto
}