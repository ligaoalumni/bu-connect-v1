import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User, Hash, GraduationCap, Calendar } from "lucide-react";

export function UserInfoSkeleton() {
  return (
    <Card className="shadow-sm w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded animate-pulse mb-2 w-48"></div>
            <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Batch</p>
              <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Program</p>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:col-span-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Birthday</p>
              <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
