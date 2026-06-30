import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import styles from './PrivateRoute.module.css';

export default function PrivateRoute(){
    const {token} = useAuth()
    return <div className={styles.wrapper}>{token ? <Outlet/> : <Navigate to="/login" replace/>}</div>
}