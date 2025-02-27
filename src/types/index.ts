import {
	EventFormSchema,
	LoginFormSchema,
	SignupFormSchema,
} from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { EventPartialRelation } from "./event";

export * from "./alumni";
export * from "./user";
export * from "./event";

export type Events = {
	start: Date;
	end: Date;
	title: string;
	id: string;
	location: string;
	backgroundColor?: string;
	borderColor?: string;
}[];

export interface EventFormProps {
	edit?: boolean;
	event?: EventPartialRelation;
	events?: Events;
}

export interface PaginationResult<T> {
	count: number;
	data: T[];
	hasMore: boolean;
}

export type PaginationArgs<TStatus> = {
	filter?: string | number;
	pagination?: {
		limit: number;
		page: number;
	};
	orderBy?: string;
	order?: "asc" | "desc";
	status?: TStatus[];
	role?: UserRole[];
};

export interface EventDateTime {
	startDate: Date; // Date object
	endDate: Date; // Date object
	startTime: Date; // Time is part of the Date object
	endTime: Date; // Time is part of the Date object
}

export type FormState =
	| {
			errors?: {
				name?: string[];
				email?: string[];
				password?: string[];
			};
			message?: string;
	  }
	| undefined;

export type SessionPayload = {
	id: number;
	role: UserRole;
	expiresAt: Date;
	email: string;
	alumniId?: number;
};

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";

export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type EventFormData = z.infer<typeof EventFormSchema>;
export type SignUpFormData = z.infer<typeof SignupFormSchema>;

type DataTablePagination = {
	pageIndex: number;
	pageSize: number;
};

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	rowCount: number;
	loading?: boolean;
	filterName?: string;
	handleRefresh?: VoidFunction;
	pagination: DataTablePagination;
	setPagination: Dispatch<SetStateAction<DataTablePagination>>;
	handleSearch?: (filter: string) => void;
}
