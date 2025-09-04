"use server";

import {
  PaginationArgs,
  PaginationResult,
  UpdateProfileData,
  UpdateUserArgs,
  UserRole,
} from "@/types";
import { Prisma, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addMinutes } from "date-fns";
import { generateEmailHTML, prisma, formatAddress } from "@/lib";
import { transporter } from "@/lib/email";

const generateOTP = () => {
  // Generate a 6-digit OTP
  const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
  return newOTP;
};

type UserWithoutRate = Omit<User, "rate"> & { rate?: number };

export const readUser = async (
  id: number,
  email?: string,
): Promise<UserWithoutRate | null> => {
  let where: Prisma.UserWhereUniqueInput = {
    id,
  };

  if (email) {
    where = {
      email,
    };
  }

  const user = await prisma.user.findUnique({
    where,
  });

  if (!user) return null;

  return {
    ...user,
    rate: user.rate ? user.rate.toNumber() : undefined,
  };
};

export const createUser = async (
  user: Pick<
    User,
    | "email"
    | "password"
    | "role"
    | "firstName"
    | "lastName"
    | "middleName"
    | "birthDate"
    | "avatar"
  > & { batchYear: number; program: string },
) => {
  const createdUser = await prisma.user.create({
    data: {
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      birthDate: user.birthDate,
      password: user.password,
      batch: user.batchYear,
      course: user.program,
      isOldAccount: true,
      status: "PENDING",
    },
    omit: {
      rate: true,
    },
  });

  return createdUser;
};

export const readUsers = async ({
  filter,
  order,
  orderBy,
  pagination,
  role = ["ADMIN", "ALUMNI"],
  batch,
}: PaginationArgs<never, UserRole> & { batch?: number } = {}): Promise<
  PaginationResult<Omit<User, "password" | "notifications" | "rate">>
> => {
  let where: Prisma.UserWhereInput = {};

  if (filter && typeof filter === "number") {
    where = {
      id: filter,
    };
  }

  if (batch) {
    where = {
      ...where,
      batch,
    };
  }

  if (typeof filter === "string") {
    where = {
      OR: [
        {
          email: { contains: filter, mode: "insensitive" },
        },
        {
          firstName: { contains: filter, mode: "insensitive" },
        },
        {
          lastName: { contains: filter, mode: "insensitive" },
        },
      ],
    };
  }

  where.role = {
    in: role,
  };

  const users = await prisma.user.findMany({
    where,
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
    omit: {
      password: true,
      rate: true,
    },
    orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
  });

  const count = await prisma.user.count({ where });

  return {
    count,
    hasMore: users.length === pagination?.limit,
    data: users.map((user) => ({
      ...user,
      notifications: [],
    })),
  };
};

export const updateUserStatus = async (id: number, status: User["status"]) => {
  const updatedUser = await prisma.user.update({
    where: { id },
    data: { status },
    omit: {
      rate: true,
    },
  });

  return updatedUser;
};

export const updateLocationSharing = async (
  id: number,
  shareLocation: boolean,
) => {
  return await prisma.user.update({
    where: { id },
    data: { shareLocation },
    omit: {
      rate: true,
    },
  });
};

export const updateUser = async (id: number, data: UpdateUserArgs) => {
  const isExists = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!isExists) {
    throw new Error("Account not found!");
  }

  const updatedAccount = await prisma.user.update({
    data: {
      ...data,
      rate: data.rate && new Prisma.Decimal(data.rate.toFixed(1)),
    },
    where: { id },
  });

  if (!updatedAccount) {
    throw new Error("Failed to update account");
  }

  return {
    ...updatedAccount,
    rate: updatedAccount.rate?.toNumber(),
  };
};

export const updateProfile = async (
  id: number,
  data: UpdateProfileData,
): Promise<void> => {
  const {
    address,
    avatar,
    birthDate,
    company,
    contactNumber,
    course,
    firstName,
    gender,
    jobTitle,
    lastName,
    middleName,
    nationality,
    currentOccupation,
    religion,
    batch,
    industry,
  } = data;

  // Input validation
  if (!id) throw new Error("User ID is required.");
  if (!firstName || !lastName)
    throw new Error("First and last names are required.");

  let parsedBirthDate: Date | undefined = undefined;
  if (birthDate) {
    parsedBirthDate = new Date(birthDate);
    if (isNaN(parsedBirthDate.getTime())) {
      throw new Error("Invalid birth date format.");
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Update user details
      const user = await tx.user.update({
        where: { id },
        data: {
          avatar,
          religion,
          address: address ? JSON.stringify(address) : undefined,
          birthDate: parsedBirthDate,
          contactNumber,
          firstName,
          middleName,
          lastName,
          nationality,
          gender,
          company,
          course,
          jobTitle,
          currentOccupation,
          batch,
          industry,
          shareLocation: address ? true : false,
        },
      });
      if (!user) throw new Error("Failed to update user profile.");
    });
  } catch (error) {
    // Log the error (placeholder for actual logging)
    console.error("Transaction failed:", error);
    throw new Error(
      "An error occurred while updating the profile. Please try again later.",
    );
  }
};

export const updatePasswordWithCurrentPassword = async ({
  currentPassword,
  id,
  newPassword,
}: {
  id: number;
  currentPassword: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { password: true },
  });

  if (!user) throw new Error("User not found!");

  const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatch) throw new Error("Current Password is incorrect!");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    data: {
      password: hashedPassword,
    },
    where: { id },
  });
};

export const updateResetPassword = async ({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    data: {
      password: hashedPassword,
    },
    where: { email },
  });
};

export const changeEmail = async ({ email }: { email: string }) => {
  const isEmailExists = await prisma.user.findUnique({ where: { email } });

  if (isEmailExists) throw new Error("Email is already use");

  const token = generateOTP();
  const validUntil = addMinutes(new Date(), 5);

  const mailOptions = {
    from: process.env.EMAIL,
    sender: {
      name: "LNHS | Alumni Association",
      address: process.env.EMAIL!,
    },
    to: email,
    subject: "Verify Your New Email Address",
    html: generateEmailHTML(`
			<p>Hello,</p>

			<p>You have requested to change your email address. Please use the verification code below to confirm your new email:</p>

			<div style="background-color: #f4f4f4; padding: 20px; margin: 20px 0; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
				${token}
			</div>

			<p>This code will expire in 5 minutes.</p>

			<p class="warning">Important: Never share this code with anyone. Our team will never ask for your verification code.</p>

			<p>If you did not request this change, please contact our support immediately.</p>

			<p>Thank you,<br>The Team</p>
		`),
  };

  await prisma.token.upsert({
    create: {
      email,
      token,
      validUntil,
    },
    update: {
      token,
      validUntil,
    },
    where: {
      email,
    },
  });

  await transporter.sendMail(mailOptions);
};

export const updateEmail = async (id: number, email: string) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: { email },

    omit: {
      rate: true,
    },
  });
};

export const getAdmins = async () => {
  return await prisma.user.findMany({
    where: {
      role: {
        not: "ALUMNI",
      },
      status: "ACTIVE",
    },
    omit: {
      rate: true,
    },
  });
};

export const getUsersId = async () => {
  const users = await prisma.user.findMany({
    where: { role: "ALUMNI", status: "ACTIVE" },
    omit: {
      rate: true,
    },
  });

  return users.map((user) => user.id);
};

export const readUserLocations = async () => {
  const users = await prisma.user.findMany({
    where: {
      shareLocation: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      middleName: true,
      avatar: true,
      address: true,
      batch: true,
    },
  });

  return users.map((user) => ({
    id: user.id,
    name: `${user.firstName} ${user.middleName ? user.middleName + " " : ""}${
      user.lastName
    }`,
    avatar: user.avatar,
    batch: user.batch,
    address: formatAddress(user.address),
  }));
};

export const getOldAccountsToVerify = async ({
  filter,
  order,
  orderBy,
  pagination,
  role,
}: PaginationArgs<never, UserRole>) => {
  let where: Prisma.UserWhereInput = {};

  if (filter && typeof filter === "number") {
    where = {
      id: filter,
    };
  }

  if (typeof filter === "string") {
    where = {
      OR: [
        {
          email: { contains: filter, mode: "insensitive" },
        },
        {
          firstName: { contains: filter, mode: "insensitive" },
        },
        {
          lastName: { contains: filter, mode: "insensitive" },
        },
      ],
    };
  }

  where.role = {
    in: role,
  };

  const users = await prisma.user.findMany({
    where: {
      AND: [
        { ...where },
        { isOldAccount: true },
        { status: "PENDING" },
        { verifiedAt: null },
        { oldAccount: null },
      ],
    },
    skip: pagination ? pagination.limit * pagination.page : undefined,
    take: pagination ? pagination.limit : undefined,
    omit: {
      password: true,
      rate: true,
    },
    orderBy: orderBy ? { [orderBy]: order || "asc" } : { id: "asc" },
  });

  const count = await prisma.user.count({ where });

  return {
    count,
    hasMore: users.length === pagination?.limit,
    // data: users.map((u) => ({ years: u.years || null, address: u.address || null, ...u })),
    data: users,
  };
};

export const connectAccount = async ({
  id,
  oldAccountId,
}: {
  id: number;
  oldAccountId: number;
}) => {
  return await prisma.user.update({
    where: {
      id,
    },
    data: {
      oldAccount: {
        connect: {
          id: oldAccountId,
        },
      },
    },
  });
};
