"use client";

import { UserCredentials } from "@/types";
import { Notification } from "@prisma/client";

import { createContext, useState, useContext, ReactNode } from "react";

interface AuthContextType {
	user: UserCredentials;
	login: (userData: UserCredentials) => void;
	logout: VoidFunction;
	notifications: Notification[];
	setUser: React.Dispatch<React.SetStateAction<UserCredentials | null>>;
	setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const AuthContext = createContext<AuthContextType>({
	user: null,
	notifications: [],
	login: () => {},
	logout: () => {},
	setNotifications: () => [],
	setUser: () => {},
});

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<UserCredentials | null>(null);
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const login = (userData: UserCredentials) => {
		setUser(userData);
		// implement your login logic here (e.g., storing the token)
	};

	const logout = () => {
		setUser(null);
		// implement your logout logic here (e.g., removing the token)
	};

	return (
		<AuthContext.Provider
			value={{ user, notifications, setNotifications, login, logout, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
