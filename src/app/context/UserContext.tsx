"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface User {
    email: string;
    role: "admin" | "viewer" | "uploader";
}

interface UserContextProps {
    user: User | null;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

const UserContext = createContext<UserContextProps>({
    user: null,
    login: () => false,
    logout: () => {},
});

const users = [
    { email: "oussema_admin@gmail.com", password: "123456", role: "admin" },
    { email: "oussema_viewer@gmail.com", password: "123456", role: "viewer" },
    { email: "oussema_uploader@gmail.com", password: "123456", role: "uploader" },
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (email: string, password: string): boolean => {
        console.log("Login tesstttttt")
        const foundUser = users.find(
            (u) => u.email === email && u.password === password
        );
        if (foundUser) {
            setUser({ email: foundUser.email, role: foundUser.role });
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
