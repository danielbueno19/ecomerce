import {useEffect, useState} from "react";
import {OrdenDTO} from "../types";
import {useLocation, useNavigate} from "react-router-dom";
import {obtenerOrdenesUsuario} from "../services/ordenes";
import OrdenCard from "../components/OrdenCard";

export default function OrdenesPage() {
    const [ordenes, setOrdenes] = useState<OrdenDTO[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const location = useLocation()
    const navigate = useNavigate()

    // ID de la orden recién creada, viene del navigate() en CheckoutPage
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
    if (error) return <p style={{color:'red'}}>{error}</p>

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <h2>Mis órdenes</h2>

            {ordenes.length === 0 ? (
                <div>
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
