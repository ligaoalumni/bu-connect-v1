import {
	AdminProfileSchema,
	AdminSchema,
	AlumniSchema,
	AnnouncementSchema,
	ChangePasswordSchema,
	EventFormSchema,
	LoginFormSchema,
	ProfileSchema,
	SignupFormSchema,
} from "@/lib/definitions";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { EventPartialRelation } from "./event";
import { Alumni, AlumniAccount, User } from "@prisma/client";

export * from "./alumni-account";
export * from "./user";
export * from "./event";
export * from "./alumni-record";

export interface AlumniWithRelation extends Alumni {
	alumniAccount: AlumniAccount | null;
}

export interface Attendant {
	avatar: string;
	firstName: string;
	lastName: string;
	email: string;
	lrn: string;
	strand?: string;
	batch: number;
}

export interface QRCodeValues {
	lrn: string;
	middleName?: string;
	lastName: string;
	firstName: string;
	batch: number;
	strand?: string;
	educationLevel: string;
}

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

export type TEventPagination = {
	slug: string;
	pagination?: {
		limit: number;
		page: number;
	};
};

export type PaginationArgs<TStatus, SRole> = {
	filter?: string | number;
	pagination?: {
		limit: number;
		page: number;
	};
	orderBy?: string;
	order?: "asc" | "desc";
	status?: TStatus[];
	role?: SRole[];
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
	verified?: boolean;
};

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";

export type LoginFormData = z.infer<typeof LoginFormSchema>;
export type EventFormData = z.infer<typeof EventFormSchema>;
export type SignUpFormData = z.infer<typeof SignupFormSchema>;
export type AlumniFormData = z.infer<typeof AlumniSchema>;
export type AdminFormData = z.infer<typeof AdminSchema>;
export type ProfileFormData = z.infer<typeof ProfileSchema>;
export type AdminProfileFormData = z.infer<typeof AdminProfileSchema>;
export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>;
export type AnnouncementFormData = z.infer<typeof AnnouncementSchema>;

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

export type UserCredentials = Pick<
	User,
	"firstName" | "lastName" | "email" | "role" | "id" | "avatar"
> | null;
