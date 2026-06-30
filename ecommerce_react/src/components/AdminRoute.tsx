import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './AdminRoute.module.css'

export default function AdminRoute() {
    const {isAdmin} = useAuth()
    return <div className={styles.wrapper}>{isAdmin ? <Outlet/> : <Navigate to="/productos" replace/>}</div>
}