<template>
  <div class="login-container">
    <div class="login-caja">
      <h2>Iniciar Sesión</h2>
      <input v-model="username" type="text" placeholder="Usuario" />
      <input v-model="password" type="text" placeholder="Contraseña" />
      <button @click="login()">Ingresar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    login() {
      if (this.username === "admin" && this.password === "123") {
        localStorage.setItem('usuario', 'admin');
        // agregar una bandera para indicar que ya esta autenticado
        localStorage.setItem('auth', 'true');
        // redirecionamiento a la pagina de bienvenida
        this.$router.push('/home');
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: whitesmoke;
  height: 100vh;
  width: 100vw;
}

.login-caja {
  background: whitesmoke;
  padding: 30px;
  border-radius: 10px;
  width: 300px;
  text-align: center;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid rgb(204, 169, 169);
}

button {
  width: 100%;
  padding: 10px;
  background: rgb(49, 49, 160);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-left: 10px;
}
</style>
