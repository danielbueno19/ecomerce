import {NavLink, useNavigate} from 'react-router-dom'
import {useAuth} from "../context/AuthContext";
import {useCarrito} from "../context/CarritoContext";
import styles from './Navbar.module.css'

export default function Navbar() {
    const {token, isAdmin, logout} = useAuth()
    const {cantidadItems} = useCarrito()
    const navigate = useNavigate()

    const handleLogout = ()=> {
        logout()
        navigate('/login')
    }

    const linkClass = ({isActive}: {isActive: boolean}) =>
        `${styles.link} ${isActive ? styles.active : ''}`

    return (
        <nav className={styles.nav}>
            <NavLink to="/productos" className={linkClass}>Productos</NavLink>
            {token && (
                <NavLink to="/carrito" className={linkClass}>
                    Carrito {cantidadItems > 0 && <span className={styles.badge}>{cantidadItems}</span>}
                </NavLink>
            )}
            {token && <NavLink to="/ordenes" className={linkClass}>Mis órdenes</NavLink>}
            {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
            {token
                ? <button className={styles.btnLogout} onClick={handleLogout}>Cerrar sesión</button>
                : <NavLink to='/login' className={linkClass}>Iniciar sesión</NavLink>}
        </nav>
    )
}