import {useAuth} from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from "../hooks/useForm";
import React, {useState} from "react";
import api from "../services/api";
import styles from './RegistroPage.module.css'

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
            <div className={styles.page}>
                <h2 className={styles.title}>Confirmá tu email</h2>
                <p>Te enviamos un código a <strong>{values.email}</strong></p>
                <form className={styles.form} onSubmit={handleConfirmacion}>
                    <div className={styles.field}>
                        <label className={styles.label}>Código de confirmación</label>
                        <input
                            className={styles.input}
                            name="codigoConfirmacion"
                            value={confirmValues.codigoConfirmacion}
                            onChange={handleConfirmChange}
                            required
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button className={styles.button} type="submit" disabled={loading}>
                        {loading ? 'Verificando...' : 'Confirmar'}
                    </button>
                </form>
            </div>
        )
    }

    return (
        <div className={styles.page}>
            <h2 className={styles.title}>Crear cuenta</h2>
            <form className={styles.form} onSubmit={handleRegistro}>
                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} name="email" type="email" value={values.email} onChange={handleChange} required />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Contraseña</label>
                    <input className={styles.input} name="password" type="password" value={values.password} onChange={handleChange} required />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Registrando...' : 'Registrarse'}
                </button>
            </form>
            <p className={styles.helper}>¿Ya tenés cuenta? <Link className={styles.link} to="/login">Iniciá sesión</Link></p>
        </div>
    )
}