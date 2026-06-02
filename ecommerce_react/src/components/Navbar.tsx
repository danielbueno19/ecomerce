import {NavLink, useNavigate} from 'react-router-dom'
import {useAuth} from "../context/AuthContext";
import {useCarrito} from "../context/CarritoContext";

const linkStyle = ({isActive}: {isActive: boolean}) => ({
    marginRight: '1rem',
    fontWeight: isActive ? 'bold': 'normal',
    textDecoration: 'none',
    color: isActive ? '#000': '#555',
})

export default function Navbar() {
    const {token, isAdmin, logout} = useAuth()
    const {cantidadItems} = useCarrito()
    const navigate = useNavigate()

    const handleLogout = ()=> {
        logout()
        navigate('/login')
    }

    return (
        <nav style={{padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem'}}>
            <NavLink to= "/productos" style={linkStyle}>Productos</NavLink>
            {token && <NavLink to="/carrito" style={linkStyle}>Carrito {cantidadItems > 0 && `(${cantidadItems})`}</NavLink>}
            {token && <NavLink to="/ordenes" style={linkStyle}>Mis órdenes</NavLink>}
            {isAdmin && <NavLink to="/admin" style={linkStyle}>Admin</NavLink>}
            {token
                ? <button onClick={handleLogout}>Cerrar sesion</button>
                : <NavLink to='/login' style={linkStyle}>Iniciar sesión</NavLink>}
        </nav>
    )
}