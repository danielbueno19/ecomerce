import { NavLink } from 'react-router-dom'
import {useAuth} from "../context/AuthContext.tsx";

const linkStyle = ({isActive}: {isActive: boolean}) => ({
    marginRight: '1rem',
    fontWeight: isActive ? 'bold': 'normal',
    textDecoration: 'none',
    color: isActive ? '#000': '#555',
})

export default function Navbar() {
    const {token, isAdmin} = useAuth()

    return (
        <nav style={{padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem'}}>
            <NavLink to= "/productos" style={linkStyle}>Productos</NavLink>
            {token && <NavLink to="/carrito" style={linkStyle}>Carrito</NavLink>}
            {token && <NavLink to="/ordenes" style={linkStyle}>Mis órdenes</NavLink>}
            {isAdmin && <NavLink to="/admin" style={linkStyle}>Admin</NavLink>}
            {!token && <NavLink to="/login" style={linkStyle}>Iniciar sesion</NavLink>}
        </nav>
    )
}