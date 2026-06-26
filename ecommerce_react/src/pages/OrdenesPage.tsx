import {useEffect, useState} from "react";
import {OrdenDTO} from "../types";
import {useLocation, useNavigate} from "react-router-dom";
import {obtenerOrdenesUsuario} from "../services/ordenes";
import OrdenCard from "../components/OrdenCard";
import styles from './OrdenesPage.module.css'

export default function OrdenesPage() {
    const [ordenes, setOrdenes] = useState<OrdenDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const location = useLocation()
    const navigate = useNavigate()

    const ordenRecienCreada: number | undefined = location.state?.ordenId

    useEffect(()=> {
        obtenerOrdenesUsuario()
            .then(data => setOrdenes(data.sort((a,b) =>
                new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
            )))
            .catch(()=>setError('No se pudieron cargar las órdenes'))
            .finally(()=> setLoading(false))
    }, [])

    if (loading) return <p>Cargando órdenes</p>
    if (error) return <p className={styles.error}>{error}</p>

    return (
        <div className={styles.page}>
            <h2>Mis órdenes</h2>

            {ordenes.length === 0 ? (
                <div className={styles.vacio}>
                    <p>Todavía no tenés órdenes.</p>
                    <button onClick={() => navigate('/productos')}>Ver productos</button>
                </div>
            ) : (
                ordenes.map(orden => (
                    <OrdenCard
                        key={orden.id}
                        orden={orden}
                        destacada={orden.id === ordenRecienCreada}
                    />
                ))
            )}
        </div>
    )
}
