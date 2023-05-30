/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react';

export type App = {
  id: string;
  redirectURI: string;
} | null;

export const SessionContext = createContext({
  session: <string | null>null,
  username: '',
  app: {
    id: '',
    redirectURI: ''
  } as App,
  login: (session: string) => { session },
  logout: () => {},
  setApp: (app: App) => { app }
});