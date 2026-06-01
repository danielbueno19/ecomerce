import {useAuth} from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from '../hooks/useForm';
import React, {useState} from "react";

export  default function LoginPage() {
    const {login} = useAuth()
    const navigate = useNavigate()
    const {values, handleChange} = useForm({email:'', password:''})
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await login(values)
            navigate('/productos')
        } catch {
            setError('Email o Password incorrectos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{maxWidth: 400, margin: '0 auto'}}>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input name="email" type="email" value={values.email} onChange={handleChange} required/>
                </div>
                <div>
                    <label>Contraseña</label>
                    <input name="password" type="password" value={values.password} onChange={handleChange} required/>
                </div>

                {error && <p style={{color: 'red'}}>{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? 'Ingresando...': 'Ingresar'}
                </button>
            </form>
            <p>No tienes cuenta? <Link to="/registro">Registrate</Link> </p>
        </div>
    )
}