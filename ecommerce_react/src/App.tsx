import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from "./components/Navbar";
import ProductosPage from './pages/ProductosPage'
import ProductoDetallePage from './pages/ProductoDetallePage'

function App() {
	return (
		<BrowserRouter>
			<div style={{padding: '0 2rem'}}>
				<h1>Ecommerce</h1>
				<Navbar/>
				<Routes>
					<Route path="/productos" element={<ProductosPage/>}/>
					<Route path="/productos/:id" element={<ProductoDetallePage/>}/>
					<Route path="*" element={<Navigate to="/productos" replace />}/>
				</Routes>
			</div>
		</BrowserRouter>
	)
}

export default App
