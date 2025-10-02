"use client";

import { TPost } from "@/types";
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
  posts: TPost[];
  setPosts: Dispatch<SetStateAction<TPost[]>>;
}

const ContentContext = createContext<ContentContextType>({
  data: null,
  setData: () => null,
  posts: [],
  setPosts: () => null,
});

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider = ({ children }: ContentProviderProps) => {
  const [data, setData] = useState<null | ContentContextType["data"]>(null);
  const [posts, setPosts] = useState<TPost[]>([]);

  return (
    <ContentContext.Provider value={{ data, setData, posts, setPosts }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContentData = () => useContext(ContentContext);
