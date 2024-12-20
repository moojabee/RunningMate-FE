import UserAuthLogin from '@/components/userAuth/UserAuthLogin.vue'
import UserAuthFindPassword from '@/components/userAuth/UserAuthFindPassword.vue'
import UserAuthRegist from '@/components/userAuth/UserAuthRegist.vue'
import UserAuthView from '@/views/UserAuthView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import BoardView from '@/components/board/BoardView.vue'
import BoardListFollow from '@/components/board/BoardListFollow.vue'
import BoardListNeighbor from '@/components/board/BoardListNeighbor.vue'
import ChatView from '@/components/chat/ChatView.vue'
import ChatListPrivate from '@/components/chat/ChatListPrivate.vue'
import ChatListOpen from '@/components/chat/ChatListOpen.vue'
import ChatCreate from '@/components/chat/ChatCreate.vue'
import BoardCreate from '@/components/board/BoardCreate.vue'
import BoardUpdate from '@/components/board/BoardUpdate.vue'
import MyPageView from '@/components/myPage/MyPageView.vue'
import MyBoard from '@/components/myPage/MyBoard.vue'
import MyRun from '@/components/myPage/MyRun.vue'
import ChatEntryRoom from '@/components/chat/ChatEntryRoom.vue'
import MyBoardUpdate from '@/components/myPage/MyBoardUpdate.vue'
import MyPageUpdate from '@/components/myPage/MyPageUpdate.vue'
import RunView from '@/components/run/RunView.vue'
import Running from '@/components/run/Running.vue'
import RunningResult from '@/components/run/RunningResult.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/',
      name:'main',
      component: MainView,
            redirect: () => {
        // session이 없으면 로그인 페이지로 리다이렉트
        if (!sessionStorage.getItem('session')) {
          return { name: 'userAuth' };
        }
        return { name: 'board' }; // 세션이 있을 경우 메인 페이지로 이동
      },
      children: [
        {
          path: '/board',
          name: 'board',
          component: BoardView,
          redirect: { name: 'neighborBoardList' },
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
            {
              path: 'create',
              name: 'boardCreate',
              component: BoardCreate
            },
            {
              path: 'update/:boardId',
              name: 'boardUpdate',
              component: BoardUpdate
            },
          ]
        },
        {
          path: '/chat',
          name: 'chat',
          component: ChatView,
          redirect: {name : 'privateChatList'},
          children: [
            {
              path: 'private',
              name: 'privateChatList',
              component: ChatListPrivate
            },
            {
              path: 'open',
              name: 'openChatList',
              component: ChatListOpen
            },
            {
              path: 'create',
              name: 'createChat',
              component: ChatCreate
            },
            {
              path: 'entry/:roomId/:roomName',
              name: 'entryRoom',
              component: ChatEntryRoom
            },
          ]
        },
        {
          path: '/run',
          name: 'run',
          component: RunView,
        },
        {
          path: '/running',
          name: 'running',
          component: Running
        },
        {
          path: '/runningResult',
          name: 'runningResult',
          component: RunningResult
        },
        {
          path: '/myPage/:userId',
          name: 'myPage',
          component: MyPageView,
          redirect: { name: 'myBoard' },
          children: [
            {
              path: 'myBoard',
              name: 'myBoard',
              component: MyBoard
            },
            {
              path: 'myRun',
              name: 'myRun',
              component: MyRun
            },
          ]
        },
        {
          path: 'myBoardUpdate/:boardId',
          name: 'myBoardUpdate',
          component: MyBoardUpdate
        },
        {
          path: "MyPageUpdate/:userId",
          name: "MyPageUpdate",
          component: MyPageUpdate
        },
      ]
    },
    {
      path: '/userAuth',
      name: 'userAuth',
      component: UserAuthView,
      redirect: {name : 'login'},
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
