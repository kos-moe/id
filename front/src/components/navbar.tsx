import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { SessionContext } from '../session-context';
import { Nav, Navbar, Container } from 'react-bootstrap';

export default function MyNav() {
  const navigate = useNavigate();
  const sessionContext = useContext(SessionContext);

  function UserNav() {
    if(sessionContext.username) {
      return <Nav.Link onClick={() => sessionContext.logout()}>{sessionContext.username}</Nav.Link>;
    }
    else if(!sessionContext.session) {
      return <Nav.Link onClick={() => navigate('/login')}>로그인</Nav.Link>;
    }
    else {
      return <></>;
    }
  }
  return <Navbar bg="light">
    <Container>
      <Navbar.Brand href="/">Kosmo ID</Navbar.Brand>
      <Nav>
        <UserNav/>
      </Nav>
    </Container>
  </Navbar>
}
  