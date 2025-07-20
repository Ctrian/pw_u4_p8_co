<template>
  <div class="container">
    <form @submit.prevent="manejarSubmit" class="formulario">
      <h3>{{ modoEdicion ? "Editar Estudiante" : "Nuevo Estudiante" }}</h3>

      <div class="campo">
        <label for="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          v-model="estudiante.nombre"
          required
          :disabled="cargando"
        />
      </div>

      <div class="campo">
        <label for="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          v-model="estudiante.apellido"
          required
          :disabled="cargando"
        />
      </div>

      <div class="campo">
        <label for="fechaNacimiento">Fecha de Nacimiento:</label>
        <input
          type="date"
          id="fechaNacimiento"
          v-model="fechaNacimiento"
          required
          :disabled="cargando"
        />
      </div>

      <div class="campo">
        <label for="genero">Género:</label>
        <select
          id="genero"
          v-model="estudiante.genero"
          required
          :disabled="cargando"
        >
          <option value="">Seleccionar...</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>

      <div class="botones-formulario">
        <button type="submit" :disabled="cargando">
          {{
            cargando ? "Procesando..." : modoEdicion ? "Actualizar" : "Guardar"
          }}
        </button>
        <button type="button" @click="limpiarFormulario" :disabled="cargando">
          Limpiar
        </button>
        <button
          type="button"
          @click="actualizarParcial"
          v-if="modoEdicion"
          :disabled="cargando"
        >
          Actualización Parcial
        </button>
      </div>
    </form>

    <!-- Lista de estudiantes -->
    <div class="lista-estudiantes">
      <h3>Lista de Estudiantes</h3>
      <button
        @click="cargarEstudiantes"
        :disabled="cargando"
        class="btn-cargar"
      >
        Actualizar Lista
      </button>

      <div v-if="estudiantes.length === 0 && !cargando" class="sin-datos">
        No hay estudiantes registrados
      </div>

      <div v-if="cargando" class="cargando">Cargando...</div>

      <div v-for="est in estudiantes" :key="est.id" class="estudiante-item">
        <div class="info-estudiante">
          <strong>{{ est.nombre }} {{ est.apellido }}</strong>
          <p>ID: {{ est.id }}</p>
          <p>Fecha: {{ formatearFecha(est.fechaNacimiento) }}</p>
          <p>Género: {{ est.genero === "M" ? "Masculino" : "Femenino" }}</p>
        </div>
        <div class="acciones-estudiante">
          <button @click="editarEstudiante(est)" :disabled="cargando">
            Editar
          </button>
          <button
            @click="eliminarEstudiante(est.id)"
            :disabled="cargando"
            class="btn-eliminar"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Mensajes -->
    <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
      {{ mensaje }}
    </div>
  </div>
</template>

<script>
import {
  obtenerTodosFachada,
  guardarFachada,
  actualizarFachada,
  actualizarParcialFachada,
  borrarPorIdFachada,
} from "@/clients/EstudianteClient.js";

export default {
  data() {
    return {
      estudiante: {
        id: null,
        nombre: "",
        apellido: "",
        genero: "",
      },
      fechaNacimiento: "",
      estudiantes: [],
      modoEdicion: false,
      cargando: false,
      mensaje: "",
      tipoMensaje: "success", // 'success' o 'error'
    };
  },

  mounted() {
    this.cargarEstudiantes();
  },

  methods: {
    async manejarSubmit() {
      try {
        this.cargando = true;
        this.mensaje = "";

        const estudianteToBody = {
          nombre: this.estudiante.nombre,
          apellido: this.estudiante.apellido,
          fechaNacimiento: this.fechaNacimiento + "T00:00:00",
          genero: this.estudiante.genero,
        };

        if (this.modoEdicion) {
          await actualizarFachada(estudianteToBody, this.estudiante.id);
          this.mostrarMensaje(
            "Estudiante actualizado correctamente",
            "success"
          );
        } else {
          await guardarFachada(estudianteToBody);
          this.mostrarMensaje("Estudiante guardado correctamente", "success");
        }

        this.limpiarFormulario();
        await this.cargarEstudiantes();
      } catch (error) {
        console.error("Error:", error);
        this.mostrarMensaje("Error al procesar la solicitud", "error");
      } finally {
        this.cargando = false;
      }
    },

    async actualizarParcial() {
      if (!this.modoEdicion) {
        this.mostrarMensaje("Selecciona un estudiante para editar", "error");
        return;
      }

      try {
        this.cargando = true;
        this.mensaje = "";

        // Solo enviar los campos que no estén vacíos
        const camposActualizar = {};

        if (this.estudiante.nombre.trim()) {
          camposActualizar.nombre = this.estudiante.nombre;
        }
        if (this.estudiante.apellido.trim()) {
          camposActualizar.apellido = this.estudiante.apellido;
        }
        if (this.fechaNacimiento) {
          camposActualizar.fechaNacimiento = this.fechaNacimiento + "T00:00:00";
        }
        if (this.estudiante.genero) {
          camposActualizar.genero = this.estudiante.genero;
        }

        await actualizarParcialFachada(camposActualizar, this.estudiante.id);
        this.mostrarMensaje("Estudiante actualizado parcialmente", "success");

        this.limpiarFormulario();
        await this.cargarEstudiantes();
      } catch (error) {
        console.error("Error:", error);
        this.mostrarMensaje("Error en la actualización parcial", "error");
      } finally {
        this.cargando = false;
      }
    },

    async eliminarEstudiante(id) {
      if (!confirm("¿Estás seguro de que deseas eliminar este estudiante?")) {
        return;
      }

      try {
        this.cargando = true;
        await borrarPorIdFachada(id);
        this.mostrarMensaje("Estudiante eliminado correctamente", "success");
        await this.cargarEstudiantes();

        // Si estábamos editando este estudiante, limpiar el formulario
        if (this.modoEdicion && this.estudiante.id === id) {
          this.limpiarFormulario();
        }
      } catch (error) {
        console.error("Error:", error);
        this.mostrarMensaje("Error al eliminar el estudiante", "error");
      } finally {
        this.cargando = false;
      }
    },

    async cargarEstudiantes() {
      try {
        this.cargando = true;
        this.estudiantes = await obtenerTodosFachada();
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        this.mostrarMensaje("Error al cargar la lista de estudiantes", "error");
        this.estudiantes = [];
      } finally {
        this.cargando = false;
      }
    },

    editarEstudiante(estudiante) {
      this.estudiante = {
        id: estudiante.id,
        nombre: estudiante.nombre,
        apellido: estudiante.apellido,
        genero: estudiante.genero,
      };

      // Convertir la fecha del formato ISO a YYYY-MM-DD
      if (estudiante.fechaNacimiento) {
        this.fechaNacimiento = estudiante.fechaNacimiento.split("T")[0];
      }

      this.modoEdicion = true;
    },

    limpiarFormulario() {
      this.estudiante = {
        id: null,
        nombre: "",
        apellido: "",
        genero: "",
      };
      this.fechaNacimiento = "";
      this.modoEdicion = false;
    },

    mostrarMensaje(texto, tipo) {
      this.mensaje = texto;
      this.tipoMensaje = tipo;
      setTimeout(() => {
        this.mensaje = "";
      }, 5000);
    },

    formatearFecha(fecha) {
      if (!fecha) return "N/A";
      return new Date(fecha).toLocaleDateString("es-ES");
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.formulario {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.formulario h3 {
  margin-top: 0;
  color: #333;
}

.campo {
  margin-bottom: 15px;
}

.campo label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  text-align: left;
}

.campo input,
.campo select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #c27272;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.campo input:focus,
.campo select:focus {
  outline: none;
  border-color: #4caf50;
}

.botones-formulario {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.botones-formulario button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.botones-formulario button[type="submit"] {
  background-color: #4caf50;
  color: white;
}

.botones-formulario button[type="submit"]:hover:not(:disabled) {
  background-color: #45a049;
}

.botones-formulario button[type="button"] {
  background-color: #008cba;
  color: white;
}

.botones-formulario button[type="button"]:hover:not(:disabled) {
  background-color: #007b9a;
}

.botones-formulario button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.lista-estudiantes {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.lista-estudiantes h3 {
  margin-top: 0;
  color: #333;
}

.btn-cargar {
  background-color: #ff9800;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.btn-cargar:hover:not(:disabled) {
  background-color: #f57c00;
}

.sin-datos,
.cargando {
  text-align: center;
  padding: 20px;
  color: #666;
  font-style: italic;
}

.estudiante-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #fafafa;
}

.info-estudiante {
  flex-grow: 1;
}

.info-estudiante strong {
  color: #333;
  font-size: 16px;
}

.info-estudiante p {
  margin: 2px 0;
  color: #666;
  font-size: 14px;
}

.acciones-estudiante {
  display: flex;
  gap: 8px;
}

.acciones-estudiante button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.acciones-estudiante button:first-child {
  background-color: #2196f3;
  color: white;
}

.acciones-estudiante button:first-child:hover:not(:disabled) {
  background-color: #1976d2;
}

.btn-eliminar {
  background-color: #f44336;
  color: white;
}

.btn-eliminar:hover:not(:disabled) {
  background-color: #d32f2f;
}

.mensaje {
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
  font-weight: bold;
}

.mensaje.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.mensaje.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
  .estudiante-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .acciones-estudiante {
    margin-top: 10px;
    width: 100%;
    justify-content: flex-end;
  }

  .botones-formulario {
    flex-direction: column;
  }

  .botones-formulario button {
    width: 100%;
  }
}
</style>
