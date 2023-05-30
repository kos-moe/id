import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Navbar from './components/navbar';
import './layout.css';

export default function Layout() {
  return (
    <div>
      <Navbar/>
      <Container>
        <Outlet/>
      </Container>
    </div>
  );
}