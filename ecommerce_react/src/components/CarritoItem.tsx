import {CarritoItemEnriquecido} from "../types";

interface Props {
    item: CarritoItemEnriquecido
    onRemover: (productoId: number) => void
}

export default function CarritoItem({item, onRemover}: Props) {
    return (
        <div style={{display:'flex', alignItems:'center', gap:'1rem', padding:'0.75rem 0', borderBottom:'1px solid #eee'}}>
            {item.imagen && <img src={item.imagen} alt={item.nombre} width={60}/>}
            <div style={{flex:1}}>
                <p style={{margin:0, fontWeight:'bold'}}>{item.nombre}</p>
                <p style={{margin:0, color:'#555'}}>Cantidad: {item.cantidad}</p>
            </div>
            <p style={{minWidth:80, textAlign:'right'}}>${(item.precio * item.cantidad).toFixed(2)}</p>
            <button onClick={()=> onRemover(item.productoId)}>Eliminar</button>
        </div>
    )
}