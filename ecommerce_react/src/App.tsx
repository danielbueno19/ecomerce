import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
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
import CheckoutPage from "./pages/CheckoutPage";

function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<CarritoProvider>
				<header className="header">
					<h1>Ecommerce</h1>
					<Navbar/>
				</header>
				<main className="main">
					<Routes>
						{/* Rutas públicas */}
						<Route path="/productos" element={<ProductosPage/>}/>
						<Route path="/productos/:id" element={<ProductoDetallePage/>}/>
						<Route path="/login" element={<LoginPage/>}/>
						<Route path="/registro" element={<RegistroPage/>}/>

						{/* Rutas protegidas: requieren sesión */}
						<Route element={<PrivateRoute/>}>
							<Route path="/carrito" element={<CarritoPage/>}/>
							<Route path='/checkout' element={<CheckoutPage/>}/>
							<Route path="/ordenes" element={<OrdenesPage/>}/>
						</Route>

						{/* Rutas protegidas: requieren rol ADMIN */}
						<Route element={<AdminRoute/>}>
							<Route path="/admin" element={<AdminPage/>}/>
						</Route>

						<Route path="*" element={<Navigate to="/productos" replace />}/>
					</Routes>
				</main>
				</CarritoProvider>
			</BrowserRouter>
		</AuthProvider>
	)
}

export default App
