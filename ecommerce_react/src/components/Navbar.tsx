import { NavLink } from 'react-router-dom'

const linkStyle = ({isActive}: {isActive: boolean}) => ({
    marginRight: '1rem',
    fontWeight: isActive ? 'bold': 'normal',
    textDecoration: 'none',
    color: isActive ? '#000': '#555',
})

export default function Navbar() {
    return (
        <nav style={{padding: '1rem', borderBottom: '1px solid #ccc', marginBottom: '2rem'}}>
            <NavLink to= "/productos" style={linkStyle}>Productos</NavLink>
        </nav>
    )
}