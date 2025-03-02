import About from '../components/pages/About';
import Partnerships from '../components/pages/Partnerships';
import Home from '../components/pages/Home';
import Trade from '../components/pages/Trade';
import Profile from '../components/pages/Profile';
import Post from '../components/pages/Post';
import Leaderboard from '../components/pages/Leaderboard';

export const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/partnerships',
    component: Partnerships,
  },
  {
    path: '/trade',
    component: Trade,
  },
  {
    path: '/profile/:did',
    component: Profile,
  },
  {
    path: '/post/:post_id',
    component: Post,
  },
  {
    path: '/leaderboard',
    component: Leaderboard,
  },
];