import React, { createContext, useState } from 'react';

// Crear el contexto
export const SessionContext = createContext();

// Crear el proveedor de contexto
export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
};

