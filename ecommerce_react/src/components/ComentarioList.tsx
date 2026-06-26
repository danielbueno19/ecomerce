import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ComentarioDTO} from "../types";
import {useForm} from "../hooks/useForm";
import {agregarComentario, getComentarios} from "../services/comentarios";
import styles from './ComentarioList.module.css'

interface Props {
    productoId: number
}

export default function ComentarioList({productoId}: Props) {
    const {token} = useAuth()
    const navigate = useNavigate()
    const [comentarios, setComentarios] = useState<ComentarioDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [enviado, setEnviado] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const {values, handleChange, reset} = useForm({contenido:'', puntuacion:'5'})

    useEffect(()=> {
        getComentarios(productoId)
            .then(setComentarios)
            .finally(()=>setLoading(false))
    }, [productoId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!token) {navigate('/login'); return}
        setError(null)
        setEnviado(true)
        try {
            const nuevo = await agregarComentario(productoId, {
                contenido: values.contenido,
                puntuacion: Number(values.puntuacion),
            })
            setComentarios(prev => [nuevo, ...prev])
            reset()
        } catch {
            setError('No se pudo enviar el comentario')
        } finally {
            setEnviado(false)
        }
    }

    return (
        <section className={styles.section}>
            <h3>Comentarios ({comentarios.length})</h3>

            {token ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label>Puntuación</label>
                        <select name="puntuacion" value={values.puntuacion} onChange={handleChange}>
                            {[5, 4, 3, 2, 1].map(n => (
                                <option key={n} value={n}>{'⭐'.repeat(n)}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.field}>
                        <textarea
                            name="contenido"
                            value={values.contenido}
                            onChange={handleChange}
                            placeholder="Escribe tu comentario"
                            required
                            rows={3}
                        />
                    </div>
                    {error && <p className={styles.error}>{error}</p>}
                    <button type='submit' disabled={enviado}>
                        {enviado ? 'Enviando...' : 'Publicar comentario'}
                    </button>
                </form>
            ) : (
                <p className={styles.loginPrompt}>
                    <button className={styles.loginLink} onClick={() => navigate('/login')}>Inicia sesión</button>
                    {' '}para dejar un comentario.
                </p>
            )}

            {loading && <p className={styles.mensaje}>Cargando comentarios...</p>}
            {!loading && comentarios.length === 0 && <p className={styles.mensaje}>Sin comentarios aún. ¡Sé el primero!</p>}
            {comentarios.map(c => (
                <div key={c.id} className={styles.item}>
                    <span>{'⭐'.repeat(c.puntuacion)}</span>
                    <p className={styles.itemContenido}>{c.contenido}</p>
                </div>
            ))}
        </section>
    )
}
