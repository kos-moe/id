import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../session-context';
import { useCallback, useContext, useEffect } from 'react';

export default function AuthorizePage() {
  const sessionContext = useContext(SessionContext);
  const navigate = useNavigate();
  
  const fetchApp = useCallback(() => {
    if(!localStorage.getItem('session')) {
      sessionContext.setApp({id: 'kosmo', redirectURI: 'https://kos.moe/auth/callback'});
      navigate('/login');
    }
    else {
      if(!sessionContext.app) {
        // TODO: Fetch app info
      }
      const app = sessionContext.app || {id: 'kosmo', redirectURI: 'https://kos.moe/auth/callback'};
      fetch('/api/oauth/app/authorize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionContext.session}`
        }
      })
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((res) => {
        const redirectURI = new URL(app.redirectURI);
        redirectURI.searchParams.append('token', res.token);
        window.location.href = redirectURI.toString();
      });
    }
  }, [sessionContext, navigate]);

  useEffect(() => {
    fetchApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <></>;
}