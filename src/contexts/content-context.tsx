"use client";

import {
	createContext,
	useState,
	useContext,
	ReactNode,
	SetStateAction,
	Dispatch,
} from "react";

interface ContentContextType {
	data: {
		id: number;
		likes: number;
		comments: number;
		isLiked?: boolean;
	} | null;
	setData: Dispatch<SetStateAction<ContentContextType["data"] | null>>;
}

const ContentContext = createContext<ContentContextType>({
	data: null,
	setData: () => null,
});

interface ContentProviderProps {
	children: ReactNode;
}

export const ContentProvider = ({ children }: ContentProviderProps) => {
	const [data, setData] = useState<null | ContentContextType["data"]>(null);

	return (
		<ContentContext.Provider value={{ data, setData }}>
			{children}
		</ContentContext.Provider>
	);
};

export const useContentData = () => useContext(ContentContext);
