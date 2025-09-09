import { User } from "@prisma/client";
import { AddressData } from "./index";

export type UserRole = "ADMIN" | "SUPER_ADMIN" | "ALUMNI";

export type UserTableData = Omit<
  User,
  "password" | "notifications" | "rate"
> & {
  rate?: number;
};

export interface UpdateProfileData {
  address?: AddressData;
  avatar?: string;
  birthDate?: string;
  company?: string;
  contactNumber?: string;
  firstName: string;
  gender?: Gender;
  lastName: string;
  middleName?: string;
  nationality?: string;
  religion?: string;
  industry?: string;
  batch?: number;
  postStudyUniversity?: string;
  years?: number;
  jobTitle?: string;
  course?: string;
  currentOccupation?: string;
}

export type Gender = "MALE" | "FEMALE" | "PREFER_NOT_TO_SAY";

export type AlumniDataTableColumns = Pick<
  User,
  | "id"
  | "studentId"
  | "firstName"
  | "lastName"
  | "middleName"
  | "email"
  | "contactNumber"
  | "address"
  | "birthDate"
  | "batch"
  | "course"
  | "gender"
  | "status"
>;

export type UpdateUserArgs = Partial<
  Pick<
    User,
    | "avatar"
    | "firstName"
    | "lastName"
    | "middleName"
    | "verifiedAt"
    | "shareLocation"
    | "occupationStatus"
    | "rate"
  >
>;
