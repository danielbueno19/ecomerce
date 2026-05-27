import { useState } from 'react'
import ProductoList from './components/ProductoList'
import ProductoDetalle from './components/ProductoDetalle'

function App() {
	const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null)
	return (
	<div style={{padding: '2rem'}}>
	    <h1>Ecommerce</h1>
	    {productoSeleccionado === null ?
			(<ProductoList onVerDetalle={setProductoSeleccionado}/>):
			(<ProductoDetalle productoId={productoSeleccionado} onVolver={()=>setProductoSeleccionado(null)}/>)
		}
	</div>
	)
}

export default App
