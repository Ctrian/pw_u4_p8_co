export function obtenerPaginasPermitidas(usuario) {
    let arreglo;
    if (usuario === 'admin') {
        // paginas permitidas pal admin
        arreglo = ['/home', '/about', '/estudiante', '/notasIngreso', '/403']
    }
    if (usuario === 'estudiante') {
        // paginas permitidas pal estu
        arreglo = ['/home', '/about', '/estudiante', '/403']
    }
    return arreglo;
} 