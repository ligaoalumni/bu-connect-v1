import { Option, Poll as TPoll } from "@prisma/client";

export interface Poll extends TPoll {
	votes: number;
	options: Option[];
}
