import {
  AdminProfileSchema,
  AdminSchema,
  AlumniSchema,
  AnnouncementSchema,
  ChangePasswordSchema,
  EventFormSchema,
  JobSchema,
  LoginFormSchema,
  ProfileSchema,
  RecruitmentSchema,
  SignupFormSchema,
} from "@/lib";
import { ColumnDef } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { z } from "zod";
import { EventPartialRelation } from "./event";

import {
  AnnouncementComment,
  Job,
  Post,
  PostComment,
  User,
  Batch as TBatch,
  Recruitment,
  OldAccount,
} from "@prisma/client";

export * from "./user";
export * from "./event";
export * from "./poll";

export type CreatePost = Omit<Post, "slug" | "createdAt" | "id" | "updatedAt">;
export type UpdateJob = Partial<
  Omit<Job, "id" | "createdAt" | "updatedAt" | "postedById">
>;
export type JobData = Pick<
  Job,
  "company" | "description" | "jobTitle" | "location" | "title" | "type"
> & { userId: number };

export type OldAlumniDataInput = Omit<
  OldAccount,
  "id" | "createdAt" | "updatedAt"
>;

export interface Attendant {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  strand?: string;
  batch: number;
}

export interface QRCodeValues {
  id: number;
  studentId: string;
  email: string;
  middleName?: string;
  lastName: string;
  firstName: string;
  batch: number;
  course?: string;
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

export type Pagination = {
  limit: number;
  page: number;
};

export type TEventPagination = {
  slug: string;
  pagination?: Pagination;
};

export type PaginationArgs<TStatus, SRole> = {
  filter?: string | number;
  pagination?: Pagination;
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
export type JobFormData = z.infer<typeof JobSchema>;
export type RecruitmentFormData = z.infer<typeof RecruitmentSchema>;

type DataTablePagination = {
  pageIndex: number;
  pageSize: number;
};

// Define the address type
export interface AddressData {
  lat: number;
  lng: number;
  address: string;
}

// Define the address type
export interface AddressData {
  lat: number;
  lng: number;
  address: string;
}

export interface DataTableProps<TData, TValue, FOption> {
  options?: FOption[];
  optionLabel?: string;
  onOptionChange?: (option: string) => void;
  optionValue?: string;
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
  "firstName" | "lastName" | "email" | "role" | "id" | "avatar" | "batch"
> | null;

export type UpdatePoll = {
  options: {
    id: number;
    content: string;
  }[];
  question: string;
};

export interface AnnouncementCommentWithUser extends AnnouncementComment {
  commentBy: {
    id: number;
    avatar: string | null;
    firstName: string;
    lastName: string;
    batch: number | null;
  };
}

export interface TPost extends Post {
  _count: {
    likedBy: number;
    comments: number;
  };
  likedBy: {
    id: number;
  }[];
  postedBy: {
    id: number;
    firstName: string;
    lastName: string;
    image?: string;
  };
}

export interface TPostComment extends PostComment {
  avatar: string;
  name: string;
  batch: string;
}

export interface ShareableComment {
  commentId: number;
  userId: number;
  name: string;
  avatar?: string;
  batch?: number;
  comment: string;
  timestamp: Date;
}

export interface Batch extends TBatch {
  students: number;
}

export type Applicant = Pick<
  User,
  "id" | "firstName" | "lastName" | "email"
> & {
  batch: number;
};
export interface RecruitmentWithApplicants extends Recruitment {
  applicants: Applicant[];
}
