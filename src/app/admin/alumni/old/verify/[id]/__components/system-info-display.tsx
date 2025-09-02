"use client";

import { UserInfoSkeleton } from "./skeleton-ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  GraduationCap,
  Hash,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { OldAccount } from "@prisma/client";
import { Alert, AlertDescription } from "@/components";

interface SystemInfoDisplayProps {
  account?: Omit<OldAccount, "createdAt" | "updatedAt">;
  isLoading?: boolean;
}

export default function SystemInfoDisplay({
  account,
  isLoading,
}: SystemInfoDisplayProps) {
  const fullName = `${account?.firstName} ${account?.lastName}`;

  return isLoading ? (
    <UserInfoSkeleton />
  ) : account ? (
    <Card className="shadow-sm bg-white">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-balance">
              {fullName}
            </CardTitle>
            <p className="text-sm text-muted-foreground">Account Information</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Batch</p>
              <Badge variant="secondary" className="mt-1">
                {account.batch}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Program</p>
              <p className="text-sm text-muted-foreground mt-1">
                {account.program}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Birthday</p>
              <p className="text-sm text-muted-foreground mt-1">
                {/*{formatDate(userInfo.birthDay)}*/}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <Alert
      variant="destructive"
      className="bg-muted/20 border-muted-foreground/20"
    >
      <div className="flex flex-col items-center  gap-3">
        <MessageCircleQuestionIcon className="h-24 w-24 text-destructive/70 " />
        <AlertDescription className="flex-1 text-lg max-w-[80%] text-center">
          No alumni records found in the system. The user information cannot be
          verified at this time.
        </AlertDescription>
      </div>
    </Alert>
  );
}
