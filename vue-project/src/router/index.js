import UserAuthLogin from '@/components/userAuth/UserAuthLogin.vue'
import UserAuthFindPassword from '@/components/userAuth/UserAuthFindPassword.vue'
import UserAuthRegist from '@/components/userAuth/UserAuthRegist.vue'
import UserAuthView from '@/views/UserAuthView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import BoardView from '@/components/board/BoardView.vue'
import BoardListFollow from '@/components/board/BoardListFollow.vue'
import BoardListNeighbor from '@/components/board/BoardListNeighbor.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'main',
      component: MainView,
      children: [
        {
          path: '/board',
          name: 'board',
          component: BoardView,
          redirect: { name: 'followBoardList' },
          children: [
            {
              path: 'follow',
              name: 'followBoardList',
              component: BoardListFollow
            },
            {
              path: 'neighbor',
              name: 'neighborBoardList',
              component: BoardListNeighbor
            },
          ]
        },
      ]
    },
    {
      path: '/userAuth',
      name: 'userAuth',
      component: UserAuthView,
      children: [
        {
          path: '',
          name: 'login',
          component: UserAuthLogin
        },
        {
          path: 'find',
          name: 'findPassword',
          component: UserAuthFindPassword
        },
        {
          path: 'regist',
          name: 'regist',
          component: UserAuthRegist
        }
      ]
    },

  ],
})

export default router
