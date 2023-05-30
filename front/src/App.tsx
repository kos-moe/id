import { useCallback, useEffect, useState } from 'react';
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import { SessionContext, App as AppType } from './session-context';
import routes from './route';

const router = createBrowserRouter(
  createRoutesFromElements(routes)
);
    
function App() {
  const [session, setSession] = useState<string | null>(localStorage.getItem('session'));
  const [username, setUsername] = useState('');
  const [app, setApp] = useState<AppType>(null);

  const login = useCallback((session: string) => {
    setSession(session);
    fetch('/api/account', {
      headers: {
        'Authorization': `Bearer ${session}`
      }
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
      localStorage.setItem('session', session);
      setUsername(res.name);
    })
    .catch(() => {
      logout();
    });
  }, []);

  const logout = () => {
    setSession(null);
    setUsername('');
    localStorage.removeItem('session');
  };

  const fetchApp = useCallback(() => {
    const session = localStorage.getItem('session');
    if(session) {
      login(session);
    }
  }, [login]);

  useEffect(fetchApp, [fetchApp]);

  return <SessionContext.Provider value={{
    session,
    username,
    app,
    login,
    logout,
    setApp: (app: AppType) => {
      setApp(app);
    }
  }}>
    <RouterProvider router={router}/>
  </SessionContext.Provider>
}
    
export default App
    