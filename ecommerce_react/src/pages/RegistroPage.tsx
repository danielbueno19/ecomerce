import {useAuth} from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "../hooks/useForm";
import React, {useState} from "react";
import api from "../services/api";

export default function RegistroPage() {
    const {registrar} = useAuth()
    const navigate = useNavigate()
    const {values, handleChange} = useForm({email: '', password:'', nombre:''})
    const {values: confirmValues, handleChange: handleConfirmChange} = useForm({codigoConfirmacion: ''})
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [esperandoConfirmacion, setEsperandoConfirmacion] = useState(false)

    const handleRegistro = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await registrar(values)
            setEsperandoConfirmacion(true)
        } catch {
            setError("No se pudo completar registro")
        } finally {
            setLoading(false)
        }
    }

    const handleConfirmacion = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            await api.post('/auth/confirmar-email', {
                email: values.email,
                codigoConfirmacion: confirmValues.codigoConfirmacion,
            })
            navigate('/login')
        } catch {
            setError('Código inválido, intente de nuevo')
        } finally {
            setLoading(false)
        }
    }

    if (esperandoConfirmacion) {
        return (
            <div style={{ maxWidth: 400, margin: '0 auto' }}>
                <h2>Confirmá tu email</h2>
                <p>Te enviamos un código a <strong>{values.email}</strong></p>
                <form onSubmit={handleConfirmacion}>
                    <div>
                        <label>Código de confirmación</label>
                        <input
                            name="codigoConfirmacion"
                            value={confirmValues.codigoConfirmacion}
                            onChange={handleConfirmChange}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? 'Verificando...' : 'Confirmar'}
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: 400, margin: '0 auto' }}>
            <h2>Crear cuenta</h2>
            <form onSubmit={handleRegistro}>
                <div>
                    <label>Email</label>
                    <input name="email" type="email" value={values.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input name="password" type="password" value={values.password} onChange={handleChange} required />
                </div>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <p>¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link></p>
        </div>
    )
}