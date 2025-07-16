<template>
  <div>
    <button v-on:click="guardar()">Guardar</button>
    <button v-on:click="actualizar()">Actualizar</button>
    <button v-on:click="actualizarParcial()">Actualizar Parcial</button>
    <button v-on:click="borrar()">Borrar</button>
  </div>
</template>

<script>
import {
  guardarFachada,
  actualizarFachada,
  actualizarParcialFachada,
  borrarPorIdFachada,
} from "@/clients/EstudianteClient.js";

export default {
  methods: {
    async guardar() {
      /*
      EstudianteTo
       private Integer id;
             private String nombre;
             private String apellido;
             private LocalDateTime fechaNacimiento;
             private String genero;
             private List<Hijo> hijos = new ArrayList<>();
*/

      let fecha = "2000-06-27";

      const estudianteToBody = {
        nombre: "Ctrian",
        apellido: "Oli",
        fechaNacimiento: fecha + "T00:00:00",
        genero: "M",
      };
      await guardarFachada(estudianteToBody);
    },
    async actualizar() {
      let fecha = "2000-07-27";

      const estudianteToBody = {
        nombre: "Andres",
        apellido: "Oli",
        fechaNacimiento: fecha + "T00:00:00",
        genero: "M",
      };
      await actualizarFachada(estudianteToBody, 8);
    },
    async actualizarParcial() {
      const estudianteToBody = {
        apellido: "Lara",
      };
      await actualizarParcialFachada(estudianteToBody, 8);
    },
    async borrar() {
      await borrarPorIdFachada(8);
    },
  },
};
</script>

<style></style>
