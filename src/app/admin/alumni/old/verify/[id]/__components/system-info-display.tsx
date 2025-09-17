"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronsUpDown,
  FileWarning,
  GraduationCap,
  Hash,
  MessageCircleQuestionIcon,
} from "lucide-react";
import { OldAccount, User } from "@prisma/client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components";
import { formatDate } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { connectAccountAction, revalidatePathAction } from "@/actions";

interface SystemInfoDisplayProps {
  account?: OldAccount & {
    User: User | null;
  };
  accountId: number;
}

export default function SystemInfoDisplay({
  account,
  accountId,
}: SystemInfoDisplayProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    // Logic to connect the old account to a new user account
    if (!account) return;
    let success = false;
    try {
      setIsLoading(true);
      await connectAccountAction({ id: accountId, oldAccountId: account.id });

      success = true;
      toast.success("Success!", {
        description: "Account connected successfully.",
        richColors: true,
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to connect the account.", {
        description:
          (error as Error).message || "An unexpected error occurred.",
        richColors: true,
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
      if (success) {
        await revalidatePathAction(
          "/alumni/old/verify",
          "/admin/alumni/old/verify",
        );
      }
    }
  };

  return account ? (
    <Card className="shadow-sm pt-12 max-h-fit space-y-6  z-20 bg-white! md:block sticky top-12 ">
      <CardContent className="space-y-4  bg-white!">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">First Name</p>
              <Badge variant="secondary" className="mt-1">
                {account.firstName}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Last Name</p>
              <Badge variant="secondary" className="mt-1">
                {account.lastName}
              </Badge>
            </div>
          </div>
          {account.middleName && (
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Middle Name</p>
                <Badge variant="secondary" className="mt-1">
                  {account.middleName}
                </Badge>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Batch</p>
              <Badge variant="secondary" className="mt-1">
                {account.batch}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-3 col-span-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Program</p>
              <p className="text-sm text-muted-foreground mt-1">
                {account.program}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3  col-span-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Birthday</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDate(account.birthDate, "MMMM dd, yyyy")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-5 justify-end">
        {account.User ? (
          <>
            <Alert variant="destructive">
              <FileWarning />
              <AlertTitle>
                This record already has a connected account!
              </AlertTitle>
              <AlertDescription>
                Use the CLI to add components and manage dependencies for your
                app.
              </AlertDescription>
            </Alert>
            <Collapsible className="flex  w-full flex-col gap-2">
              <div className="flex items-center justify-between gap-4  ">
                <h4 className="text-sm font-medium">
                  View connected alumni account details
                </h4>
                <CollapsibleTrigger asChild>
                  <Button
                    disabled={isLoading}
                    variant="ghost"
                    size="icon"
                    className="size-8"
                  >
                    <ChevronsUpDown />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="flex flex-col gap-2">
                <div className="grid grid-cols-2">
                  <p className="text-black/80">Account ID:</p>
                  <p className="font-medium">{account.User.id}</p>
                </div>

                <div className="grid grid-cols-2">
                  <p className="text-black/80">First Name:</p>
                  <p className="font-medium capitalize">
                    {account.User.firstName}
                  </p>
                </div>
                <div className="grid grid-cols-2">
                  <p className="text-black/80">Last Name:</p>
                  <p className="font-medium capitalize">
                    {account.User.lastName}
                  </p>
                </div>
                {account.User.middleName && (
                  <div className="grid grid-cols-2">
                    <p className="text-black/80">Middle Name:</p>
                    <p className="font-medium capitalize">
                      {account.User.middleName}
                    </p>
                  </div>
                )}
                <div className="grid grid-cols-2">
                  <p className="text-black/80">Email:</p>
                  <p className="font-medium">{account.User.email}</p>
                </div>
                {account.User.verifiedAt && (
                  <div className="grid grid-cols-2">
                    <p className="text-black/80">Verified At:</p>
                    <p className="font-medium">
                      {formatDate(
                        account.User.verifiedAt,
                        "MMM, dd yyyy - hh:mm",
                      )}
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </>
        ) : (
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? "Connecting..." : "Connect Account"}
          </Button>
        )}
      </CardFooter>
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
