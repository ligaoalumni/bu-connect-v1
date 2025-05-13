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
