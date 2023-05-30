import { Route } from 'react-router-dom';
import Layout from './layout';

import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import AuthorizePage from './pages/authorize';

const routes = <Route element={<Layout/>}>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/oauth/authorize" element={<AuthorizePage/>}/>
</Route>;

export default routes;