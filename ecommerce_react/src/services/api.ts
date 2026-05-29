import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
})

// Adjunta el token JWT a cada request si existe
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Si el servidor responde 401, el token expiró o es inválido -> limpiar sesión
api.interceptors.request.use(
    res => res,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default api