import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import ProductosPage from './pages/ProductosPage'
import ProductoDetallePage from './pages/ProductoDetallePage'
import LoginPage from "./pages/LoginPage";
import CarritoPage from "./pages/CarritoPage";
import OrdenesPage from "./pages/OrdenesPage";
import AdminPage from "./pages/AdminPage";
import RegistroPage from "./pages/RegistroPage";
import {CarritoProvider} from "./context/CarritoContext";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<CarritoProvider>
				<div style={{padding: '0 2rem'}}>
					<h1>Ecommerce</h1>
					<Navbar/>
					<Routes>
						{/* Rutas públicas */}
						<Route path="/productos" element={<ProductosPage/>}/>
						<Route path="/productos/:id" element={<ProductoDetallePage/>}/>
						<Route path="/login" element={<LoginPage/>}/>
						<Route path="/registro" element={<RegistroPage/>}/>

						{/* Rutas protegidas: requieren sesión */}
						<Route element={<PrivateRoute/>}>
							<Route path="/carrito" element={<CarritoPage/>}/>
							<Route path="/ordenes" element={<OrdenesPage/>}/>
						</Route>

						{/* Rutas protegidas: requieren rol ADMIN */}
						<Route element={<AdminRoute/>}>
							<Route path="/admin" element={<AdminPage/>}/>
						</Route>

						<Route path="*" element={<Navigate to="/productos" replace />}/>
					</Routes>
				</div>
				</CarritoProvider>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
