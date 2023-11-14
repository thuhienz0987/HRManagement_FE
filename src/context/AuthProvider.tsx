"use client";

import { useState, createContext, Dispatch, SetStateAction } from 'react';

type AuthContextType = {
    auth: any;
    setAuth: Dispatch<SetStateAction<any>>;
};

const AuthContext = createContext<AuthContextType>({ auth: {}, setAuth: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [auth, setAuth] = useState({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;