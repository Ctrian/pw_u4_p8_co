import axios from "axios"

// Obtener todos
/* public Response consultarEstudiantes(@QueryParam("genero") String genero, @QueryParam("provincia") String provincia, @Context UriInfo uriInfo) { */
const obtenerTodos = async () => {
    const respuesta = axios.get('http://localhost:8081/api/matricula/v1/estudiantes/?genero=M').then(respuesta => respuesta.data);
    console.log(respuesta);
    return respuesta;
}

// Obtener por ID
/* public Response consultarEstudiantePorId(@PathParam("id") Integer id, @Context UriInfo uriInfo) { */
const obtenerPorId = async (id) => {
    const respuesta = axios.get(`http://localhost:8081/api/matricula/v1/estudiantes/${id}`).then(respuesta => respuesta.data);
    console.log(respuesta);
    return respuesta;
}

// Guardar
/* public void guardar(@RequestBody EstudianteTo estudianteTo) { */
const guardar = async (body) => {
    const data = axios.post('http://localhost:8081/api/matricula/v1/estudiantes', body).then(respuesta => respuesta.data);
    console.log(data);
}

// Actualizar
/* public void actualizar(@RequestBody EstudianteTo estudianteTo, @PathParam("id") Integer id) { */
const actualizar = async (body, id) => {
    axios.put(`http://localhost:8081/api/matricula/v1/estudiantes/${id}`, body).then(respuesta => respuesta.data);
}

// Actualizar Parcial
/* public void actualizarParcialPorId(@RequestBody EstudianteTo estudianteTo, @PathParam("id") Integer id) { */
const actualizarParcial = async (body, id) => {
    axios.patch(`http://localhost:8081/api/matricula/v1/estudiantes/${id}`,body).then(respuesta => respuesta.data);
}

// Borrar
/* public void eliminar(@PathParam("id") Integer id) { */
const borrarPorId = async (id) => {
    axios.delete(`http://localhost:8081/api/matricula/v1/estudiantes/${id}`).then(respuesta => respuesta.data);
}

// fachadas
export const obtenerTodosFachada = async () => {
    return await obtenerTodos();
}

export const obtenerPorIdFachada = async (id) => {
    return await obtenerPorId(id);
}

export const guardarFachada = async (body) => {
    await guardar(body);
}

export const actualizarFachada = async (body, id) => {
    await actualizar(body, id);
}

export const actualizarParcialFachada = async (body, id) => {
    await actualizarParcial(body, id);  
}

export const borrarPorIdFachada = async (id) => {
    await borrarPorId(id);
}