import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoaderComponent,
} from "@/components";
import React from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const PostForm = dynamic(
  () => import("../__components/post-form").then((mod) => mod.PostForm),
  {
    loading: LoaderComponent,
  },
);

export default function Page() {
  return (
    <div className="container mx-auto py-10 md:px-10 px-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Create Post</CardTitle>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="flex items-center gap-1"
          >
            <Link href="/">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <PostForm />
        </CardContent>
      </Card>
    </div>
  );
}
