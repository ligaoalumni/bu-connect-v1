"use client";

import { UserCredentials } from "@/types";

import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
	user: UserCredentials;
	login: (userData: UserCredentials) => void;
	logout: VoidFunction;
	setUser: React.Dispatch<React.SetStateAction<UserCredentials | null>>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	login: () => {},
	logout: () => {},
	setUser: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<UserCredentials | null>(null);

	const login = (userData: UserCredentials) => {
		setUser(userData);
		// implement your login logic here (e.g., storing the token)
	};

	const logout = () => {
		setUser(null);
		// implement your logout logic here (e.g., removing the token)
	};

	return (
		<AuthContext.Provider value={{ user, login, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
