import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ComentarioDTO} from "../types";
import {useForm} from "../hooks/useForm";
import {agregarComentario, getComentarios} from "../services/comentarios";

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
            setComentarios(prev => [nuevo, ...prev]) // agregar al inicio sin recargar
            reset()
        } catch {
            setError('No se pudo enviar el comentario')
        } finally {
            setEnviado(false)
        }
    }

    return (
        <section style={{marginTop:'2rem'}}>
            <h3>Comentarios ({comentarios.length})</h3>

            {/* Formulario - solo visible si hay sesión */}
            {token ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#a9a9a9', borderRadius: 8 }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <label>Puntuación</label>
                        <select name="puntuacion" value={values.puntuacion} onChange={handleChange}>
                            {[5, 4, 3, 2, 1].map(n => (
                                <option key={n} value={n}>{'⭐'.repeat(n)}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{marginBottom:'0.5rem'}}>
                        <textarea
                            name="contenido"
                            value={values.contenido}
                            onChange={handleChange}
                            placeholder="Escribe tu comentario"
                            required
                            rows={3}
                            style={{width:'100%'}}
                        />
                    </div>
                    {error && <p style={{ color: 'red', margin: '0 0 0.5rem' }}>{error}</p>}
                    <button  type='submit' disabled={enviado}>
                        {enviado ? 'Enviando...': 'Publicar comentario'}
                    </button>
                </form>
            ): (
                <p style={{ color: '#6b7280' }}>
                    <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: 0 }}>
                        Iniciá sesión
                    </button>
                    {' '}para dejar un comentario.
                </p>
            )}

            {/* Lista */}
            {loading && <p>Cargando comentarios...</p>}
            {!loading && comentarios.length === 0 && <p style={{ color: '#6b7280' }}>Sin comentarios aún. ¡Sé el primero!</p>}
            {comentarios.map(c => (
                <div key={c.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '0.75rem 0' }}>
                    <span>{'⭐'.repeat(c.puntuacion)}</span>
                    <p style={{ margin: '0.25rem 0 0' }}>{c.contenido}</p>
                </div>
            ))}
        </section>
    )
}
