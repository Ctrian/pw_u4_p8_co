import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

function estaAutenticado() {
  return localStorage.getItem('auth') === 'true';

}

const routes = [
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: {
      requireAuth: true, //protegida
    }
  },
  {
    path: '/estudiante',
    name: 'estudiante',
    component: () => import(/* webpackChunkName: "estudiante" */ '../views/EstudianteView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  // la página hacia donde estoy yendo requiere autenticación?
  if (to.meta.requireAuth) {
    // esta autenticado?
    if (estaAutenticado()) {
      next();
    } else {
      next('/login');
    }
  } else {
    // Si no requiere auth, permite igual
    next();
  }
})

export default router
