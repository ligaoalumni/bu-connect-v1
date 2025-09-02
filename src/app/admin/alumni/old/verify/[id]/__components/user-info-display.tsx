"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, GraduationCap, Hash } from "lucide-react";
import SystemInfoDisplay from "./system-info-display";
import { formatDate } from "date-fns";
import { useEffect, useState } from "react";
import { readOldAccountByCurrentAccountAction } from "@/actions";
import { OldAccount } from "@prisma/client";
import { ScrollArea } from "@/components";

interface UserInfo {
  firstName: string;
  lastName: string;
  middleName?: string;
  batch: number;
  program: string;
  birthDay: string;
  id: number;
}

type SystemRecordStatus = "found" | "not-found" | "already-connected";

interface UserInfoDisplayProps {
  userInfo: UserInfo;
  systemRecordStatus: SystemRecordStatus;
}

export function UserInfoDisplay({
  userInfo,
  systemRecordStatus,
}: UserInfoDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OldAccount[]>([]);

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
    <div className="relative max-w-2xl mx-auto flex flex-col gap-5 items-center  ">
      {/* User Information Card */}
      <Card className="shadow-sm space-y-6   ">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div>
              <CardTitle className="text-xl font-semibold text-balance">
                Account Information
              </CardTitle>
              <p className="text-sm text-muted-foreground"></p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4  ">
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

            <div className="flex items-center gap-3">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Program</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {userInfo.program}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
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

      <ScrollArea className="h-[50dvh] p-3   rounded-md border">
        {/* System Record Status */}
        <div className="my-3">
          <SystemInfoDisplay
            // account={{
            //   batch: userInfo.batch,
            //   firstName: userInfo.firstName,
            //   lastName: userInfo.lastName,
            //   program: userInfo.program,
            //   id: userInfo.id,
            //   middleName: userInfo.middleName || "",
            //   studentId: userInfo.
            //   // birthDate: userInfo.birthDay,
            // }}
            isLoading={isLoading}
          />
        </div>
        <div className="my-3">
          <SystemInfoDisplay
            // account={{
            //   batch: userInfo.batch,
            //   firstName: userInfo.firstName,
            //   lastName: userInfo.lastName,
            //   program: userInfo.program,
            //   id: userInfo.id,
            //   middleName: userInfo.middleName || "",
            //   studentId: userInfo.
            //   // birthDate: userInfo.birthDay,
            // }}
            isLoading={isLoading}
          />
        </div>
        <div className="my-3">
          <SystemInfoDisplay
            // account={{
            //   batch: userInfo.batch,
            //   firstName: userInfo.firstName,
            //   lastName: userInfo.lastName,
            //   program: userInfo.program,
            //   id: userInfo.id,
            //   middleName: userInfo.middleName || "",
            //   studentId: userInfo.
            //   // birthDate: userInfo.birthDay,
            // }}
            isLoading={isLoading}
          />
        </div>
        <div className="my-3">
          <SystemInfoDisplay
            // account={{
            //   batch: userInfo.batch,
            //   firstName: userInfo.firstName,
            //   lastName: userInfo.lastName,
            //   program: userInfo.program,
            //   id: userInfo.id,
            //   middleName: userInfo.middleName || "",
            //   studentId: userInfo.
            //   // birthDate: userInfo.birthDay,
            // }}
            isLoading={isLoading}
          />
        </div>
        <div className="my-3">
          <SystemInfoDisplay
            // account={{
            //   batch: userInfo.batch,
            //   firstName: userInfo.firstName,
            //   lastName: userInfo.lastName,
            //   program: userInfo.program,
            //   id: userInfo.id,
            //   middleName: userInfo.middleName || "",
            //   studentId: userInfo.
            //   // birthDate: userInfo.birthDay,
            // }}
            isLoading={isLoading}
          />
        </div>
      </ScrollArea>
    </div>
  );
}
