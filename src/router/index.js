import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import EstudianteView from '@/views/EstudianteView.vue';

import { obtenerPaginasPermitidas } from '@/helpers/Autorizacion';

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
    component: EstudianteView,
    meta: {
      requireAuth: true,
    }

  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
    meta: {
      requireAuth: true, //protegida
    }
  },
  {
    path: '/notasIngreso',
    name: 'notasIngreso',
    component: () => import(/* webpackChunkName: "notasIngreso" */ '../views/NotasIngresoView.vue'),
    meta: {
      requireAuth: true, //protegida
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import(/* webpackChunkName: "recursoProhibido" */ '../views/RecursoProhibido.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  console.log('Antes')
  // la página hacia donde estoy yendo requiere autenticación?
  if (to.meta.requireAuth) {
    console.log('Auth')
    // esta autenticado?
    if (!estaAutenticado()) {
      next('/login');
    } else {
      // autenticado
      // Aqui valido si esta autenticado
      let usuario = localStorage.getItem('usuario');
      let paginas = obtenerPaginasPermitidas(usuario);
      if (paginas.includes(to.path)) {
        next();
      } else {
        next('/403')
      }
    }
  } else {
    // Si no requiere auth, permite igual
    next();
  }
})

export default router
