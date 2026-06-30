import {useAuth} from "../context/AuthContext";
import {Link, useNavigate} from "react-router-dom";
import {useForm} from '../hooks/useForm';
import React, {useState} from "react";
import styles from './LoginPage.module.css'

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
        <div className={styles.page}>
            <h2 className={styles.title}>Iniciar sesión</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} name="email" type="email" value={values.email} onChange={handleChange} required/>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Contraseña</label>
                    <input className={styles.input} name="password" type="password" value={values.password} onChange={handleChange} required/>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Ingresando...': 'Ingresar'}
                </button>
            </form>
            <p className={styles.helper}>No tienes cuenta? <Link className={styles.link} to="/registro">Registrate</Link> </p>
        </div>
    )
}