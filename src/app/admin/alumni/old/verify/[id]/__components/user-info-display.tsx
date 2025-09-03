"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, Hash, Loader2 } from "lucide-react";
import SystemInfoDisplay from "./system-info-display";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import { readOldAccountByCurrentAccountAction } from "@/actions";
import { OldAccount, User } from "@prisma/client";
import { ScrollArea } from "@/components";

interface UserInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  batch: number;
  program: string;
  birthDay: string;
  id: number;
  phoneNumber?: string;
}

type SystemRecordStatus = "found" | "not-found" | "already-connected";

interface UserInfoDisplayProps {
  userInfo: UserInfo;
  systemRecordStatus: SystemRecordStatus;
}

export function UserInfoDisplay({ userInfo }: UserInfoDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Array<OldAccount & { User: User | null }>>(
    [],
  );

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const r = await readOldAccountByCurrentAccountAction({
          batch: userInfo.batch,
          birthDate: userInfo.birthDay,
          firstName: userInfo.firstName,
          program: userInfo.program,
        });

        setData(r);
      } catch (error) {
        setData([]);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userInfo.id]);

  return (
    <div className="relative  mx-auto grid grid-cols-1 md:grid-cols-2  gap-5   ">
      {/* User Information Card */}
      <Card className="shadow-sm max-h-fit space-y-6  z-20 bg-white! md:block sticky top-10 ">
        <CardHeader className="pb-4 bg-white!">
          <div className="flex items-center gap-3 bg-white!">
            <div>
              <CardTitle className="text-xl font-semibold text-balance">
                Account Information
              </CardTitle>{" "}
              <p className="text-sm text-muted-foreground">
                View and manage your alumni account details below.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4  bg-white!">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">First Name</p>
                <Badge variant="secondary" className="mt-1">
                  {userInfo.firstName}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Last Name</p>
                <Badge variant="secondary" className="mt-1">
                  {userInfo.lastName}
                </Badge>
              </div>
            </div>
            {userInfo.middleName && (
              <div className="flex items-center gap-3">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Middle Name</p>
                  <Badge variant="secondary" className="mt-1">
                    {userInfo.middleName}
                  </Badge>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Batch</p>
                <Badge variant="secondary" className="mt-1">
                  {userInfo.batch}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-3 col-span-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Program</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {userInfo.program}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3  col-span-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Birthday</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatDate(userInfo.birthDay, "MMMM dd, yyyy")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <ScrollArea className="relative md:h-[75dvh]  p-3 z-10  rounded-md border">
        <div className="sticky top-0 bg-white">
          <h1 className="text-xl ">Old Alumni Records</h1>
          <hr className="my-3" />
          {isLoading ? (
            <div className="flex flex-col md:h-[72dvh] items-center justify-center ">
              <Loader2 className="animate-spin h-20 w-20" />
              <p className="text-black/70">Searching for data...</p>
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-3">
              {data.map((d) => (
                <SystemInfoDisplay
                  accountId={userInfo.id}
                  key={d.id}
                  account={d}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col md:h-[72dvh] items-center justify-center text-center px-3">
              <h2 className="text-2xl font-semibold mb-2">No Records Found</h2>
              <p className="text-muted-foreground md:px-5 md:max-w-[80%] mb-4">
                We couldn&apos;t find any matching records in the old alumni
                database. Please verify your information or contact support for
                assistance.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
