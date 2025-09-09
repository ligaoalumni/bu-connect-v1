import { Icon } from "@iconify/react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";

interface LoginAlertProps {
  action: string;
}

export function LoginAlert({ action }: LoginAlertProps) {
  return (
    <Alert className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <Icon icon="fluent-color:alert-24" width="24" height="24" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-amber-800 dark:text-amber-200">
          You must be logged in to {action}
        </span>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="ml-4 border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-900 bg-transparent"
        >
          <Link href={"/login"}>
            <LogIn className="h-3 w-3 mr-1" />
            Login
          </Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
