import { useNavigate } from 'react-router-dom';
import React, { FormEvent, useContext } from 'react';
import { SessionContext } from '../session-context';
import { Card, Form, Button } from 'react-bootstrap';
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [phase, setPhase] = React.useState('initial');
  const sessionContext = useContext(SessionContext);

  function InitialPanel() {
    const [loading, setLoading] = React.useState(false);

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get('email') as string;
      setLoading(true);
      setEmail(email);
      fetch('/api/auth/login', {
        method: 'POST',
        body: formData,
      })
      .then((res) => {
        if(res.ok) {
          return res.json();
        }
        else {
          throw res;
        }
      })
      .then((res) => {
        switch(res.type) {
          case 'register':
            // TODO: alert이 아닌 걸로 바꾸기
            alert(`${email} 주소로 인증 메일을 발송했어요.`);
            navigate(`/register?email=${email}`);
            break;
          case 'login_password':
            setPhase('login');
            break;
          default:
            throw new Error('Unknown response');
        }
      })
      .catch((err) => {
        alert('로그인에 실패했어요.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
    }

    return <form onSubmit={handleSubmit}>
      <Card.Header>로그인</Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Label>이메일</Form.Label>
          <Form.Control type="email" name="email" required autoComplete="email webauthn"/>
          <Form.Text className="text-muted">가입하지 않으셨다면 회원가입 링크를 보내드릴게요.</Form.Text>
        </Form.Group>
      </Card.Body>
      <Card.Footer>
        <Button type="submit" variant="primary" disabled={loading}>로그인 / 회원가입</Button>
      </Card.Footer>
    </form>
  }

  function LoginByPasswordPanel() {
    const [loading, setLoading] = React.useState(false);

    function handleSubmit(e: FormEvent) {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      setLoading(true);
      fetch('/api/auth/login/password', {
        method: 'POST',
        body: formData
      })
      .then((res) => {
        if(res.ok) {
          return res.json();
        }
        else {
          throw res;
        }
      })
      .then((res) => {
        sessionContext.login(res.session);
        navigate('/');
      })
      .catch((err) => {
        if(err.status === 401) {
          alert('이메일이나 비밀번호가 올바르지 않아요.');
        }
        else {
          alert('로그인에 실패했어요.');
        }
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
    }

    return <>
      <form onSubmit={handleSubmit}>
        <Card.Header>비밀번호로 로그인</Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>이메일</Form.Label>
            <Form.Control type="email" name="email" readOnly defaultValue={email}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>비밀번호</Form.Label>
            <Form.Control type="password" name="password" minLength={8} autoComplete="current-password" autoFocus/>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Button type="submit" variant="primary" disabled={loading}>로그인</Button>
        </Card.Footer>
      </form>
    </>
  }

  function Panel() {
    switch(phase) {
      case 'login':
        return <LoginByPasswordPanel/>
      default:
        return <InitialPanel/>;
    }
  }

  return <>
    <Card>
      <Panel/>
    </Card>
  </>
}
