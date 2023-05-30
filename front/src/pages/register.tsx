import { useNavigate, useSearchParams } from 'react-router-dom';
import React, { FormEvent, useContext } from 'react';
import { Card, Form, Button, InputGroup } from 'react-bootstrap';
import { SessionContext } from '../session-context';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [params] = useSearchParams();
  const sessionContext = useContext(SessionContext);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    fetch('/api/auth/register', {
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
      sessionContext.login(res.session);
      //Toaster.show({message: `${formData.get('name')}님, Kosmo에 가입하신 걸 환영합니다!`, intent: Intent.SUCCESS});
      navigate('/');
    })
    .catch((err) => {
      if(err.error === 'email_exists') {
        alert('이미 가입된 이메일입니다.');
      }
      else if(err.error === 'code_invalid') {
        alert('인증 코드가 올바르지 않습니다.');
      }
      else {
        alert('회원 가입에 실패했습니다.');
      }
      console.error(JSON.stringify(err));
    })
    .finally(() => setLoading(false));
  }
  return <>
    <Card>
      <Card.Header>회원 가입</Card.Header>
      <form onSubmit={handleSubmit}>
        <Card.Body>
          <Form.Group>
            <Form.Label>이메일</Form.Label>
            <Form.Control type="email" name="email" required autoComplete="email webauthn" defaultValue={params.get('email') || ''}/>
          </Form.Group>
          <Form.Group>
            <Form.Label>인증 코드</Form.Label>
            <InputGroup>
              <Form.Control type="text" name="authCode" required maxLength={6} autoComplete="no" defaultValue={params.get('authCode') || ''}/>
              <Button style={{} || {height: 'fit-content', alignSelf: 'end', marginBottom: '15px'}}>재발송</Button>
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>계정 이름</Form.Label>
            <Form.Text muted style={{marginLeft: '5px'}}>20자 이하</Form.Text>
            <Form.Control type="text" name="name" required maxLength={20} autoComplete="nickname" defaultValue={params.get('email')?.split('@')[0]}/>
            <Form.Text muted>계정 이름은 언제든 바꿀 수 있어요.</Form.Text>
          </Form.Group>
          <Form.Group>
            <Form.Label>비밀번호</Form.Label>
            <Form.Text muted style={{marginLeft: '5px'}}>8자 이상</Form.Text>
            <Form.Control type="password" name="password" minLength={8} autoComplete="new-password"/>
            <Form.Text muted>가급적이면 다른 사이트에서 쓰지 않는 비밀번호를 사용해 주세요. <br/>비밀번호 관리자를 사용하는 것도 좋아요.</Form.Text>
          </Form.Group>
        </Card.Body>
        <Card.Footer>
          <Button type="submit" variant="primary" disabled={loading}>회원 가입</Button>
        </Card.Footer>
      </form>
    </Card>
  </>
}