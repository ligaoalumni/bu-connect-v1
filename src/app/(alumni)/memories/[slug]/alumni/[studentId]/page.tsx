import { readUserAction } from "@/actions";
import { AlumniData } from "@/app/admin/alumni/__components";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components";
import { formatDate } from "date-fns";
import { notFound } from "next/navigation";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;

  if (isNaN(Number(studentId))) return notFound();

  const user = await readUserAction(Number(studentId));

  if (!user) return notFound();

  return (
    <>
      <div className="space-y-3 px-5 md:px-10">
        <div className="rounded-3xl shadow-md   space-y-5 pb-10 m-2   dark:bg-[#5473a8]">
          <div className="flex  items-center shadow-md  p-5 rounded-2xl bg-[#15497a]">
            <Avatar className="h-[120px] w-[120px]">
              <AvatarImage src={user.avatar || ""} className="object-cover" />
              <AvatarFallback className="text-3xl text-black dark:text-white">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className=" ml-10 ">
              <h2 className="text-2xl text-white font-semibold ">
                {user?.firstName} {user?.lastName}
              </h2>
              <div className="flex items-center gap-1 text-white">
                <p className="text-sm  ">{user?.batch}</p>
                <Separator
                  orientation="vertical"
                  className="w-2 h-full bg-white text-white"
                />
                <p className="text-sm  ">{user?.course}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8 p-5">
            <Card className="bg-transparent  ">
              <CardHeader className="px-5 pb-2 pt-5 font-medium">
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  md:col-span-2">
                <AlumniData
                  useDefaultColors
                  label="First Name"
                  data={user?.firstName}
                />
                <AlumniData
                  useDefaultColors
                  label="Middle Name"
                  data={user?.middleName}
                />
                <AlumniData
                  useDefaultColors
                  label="Last Name"
                  data={user?.lastName}
                />
                <AlumniData
                  useDefaultColors
                  label="Birth Date"
                  data={
                    user?.birthDate
                      ? formatDate(user.birthDate, "MMMM dd, yyyy")
                      : null
                  }
                />
                <AlumniData
                  useDefaultColors
                  label="Gender"
                  data={`${user?.gender[0]}${user?.gender
                    .slice(1)
                    .toLocaleLowerCase()}`.replaceAll(/_/g, " ")}
                />
                <AlumniData useDefaultColors label="Email" data={user?.email} />
                {/* <AlumniData useDefaultColors label="Address" data={user?.address} /> */}
                <AlumniData
                  useDefaultColors
                  label="Contact Number"
                  data={user?.contactNumber}
                />
                <AlumniData
                  useDefaultColors
                  label="Nationality"
                  data={user?.nationality}
                />
                <AlumniData
                  useDefaultColors
                  label="Religion"
                  data={user?.religion}
                />

                {/* <AlumniData useDefaultColors label="Contact Number" data={alumni.user./} /> */}
              </CardContent>
            </Card>

            <Card className="bg-transparent  ">
              <CardHeader className="px-5 pb-2 pt-5 font-medium">
                <CardTitle>Academic Information</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  ">
                <AlumniData
                  useDefaultColors
                  label="Student ID"
                  data={user?.studentId}
                />
                <AlumniData
                  useDefaultColors
                  label="Batch"
                  data={user?.batch?.toString()}
                />
                <AlumniData
                  useDefaultColors
                  label="Course"
                  data={user?.course}
                />
              </CardContent>
            </Card>

            <Card className="bg-transparent  ">
              <CardHeader className="px-5 pb-2 pt-5 font-medium">
                <CardTitle>Post - Graduation Information</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3  ">
                <AlumniData
                  useDefaultColors
                  label="Industry"
                  data={user?.industry}
                />
                <AlumniData
                  useDefaultColors
                  label="Company"
                  data={user?.company}
                />
                <AlumniData
                  useDefaultColors
                  label="Job Title"
                  data={user?.jobTitle}
                />
                <AlumniData
                  useDefaultColors
                  label="Years to get this job (if job is related to your course)"
                  data={user?.years ? user.years.toString() : ""}
                />
                <AlumniData
                  useDefaultColors
                  label="Name of University/College"
                  data={user?.postStudyUniversity}
                />
                <AlumniData
                  useDefaultColors
                  label="Current Occupation"
                  data={
                    user?.currentOccupation
                      ? user.currentOccupation.slice(0, 1).toUpperCase() +
                        user.currentOccupation.slice(1).toLowerCase()
                      : ""
                  }
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
