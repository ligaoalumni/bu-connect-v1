import { Option, Poll as TPoll } from "@prisma/client";

export interface Poll extends TPoll {
  votes: number;
  options: Array<
    Option & {
      votes: Array<{
        userId: number;
      }>;
    }
  >;
}

export interface PollDetail {
  id: number;
  question: string;
  status: Poll["status"];
  createdAt: Date;
  updatedAt: Date;
  options: Array<{
    id: number;
    pollId: number;
    content: string;
    votes: Array<{
      id: number;
      createdAt: Date;
    }>;
  }>;
}
