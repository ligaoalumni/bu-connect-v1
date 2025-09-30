import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { BookOpen, Hash, Mail, User, Calendar } from "lucide-react";
import { User as UserT } from "@prisma/client";
import Link from "next/link";

interface ViewQRCodeDetailProps {
  alumni: Pick<
    UserT,
    | "firstName"
    | "middleName"
    | "lastName"
    | "studentId"
    | "email"
    | "course"
    | "batch"
    | "industry"
    | "company"
    | "jobTitle"
    | "currentOccupation"
    | "isOldAccount"
    | "years"
    | "postStudyUniversity"
  >;
}

const ViewQRCodeDetail = ({ alumni }: ViewQRCodeDetailProps) => {
  const fullName = `${alumni.firstName} ${alumni.middleName ? alumni.middleName + " " : ""}${alumni.lastName}`;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Alumni Profile
        </h1>
        <p className="text-muted-foreground">Academic Information Portal</p>
      </div>

      {/* Main Profile Card */}
      <Card className="mb-6 shadow-lg">
        <CardHeader className="bg-card border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <Link href={`#`}>
                  <CardTitle className="text-2xl text-balance capitalize">
                    {fullName}
                  </CardTitle>
                </Link>
                <p className="text-muted-foreground">
                  Student ID: {alumni.studentId || "No data"}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="text-sm font-medium">
                Batch {alumni.batch}
              </Badge>
              {alumni.isOldAccount && (
                <Badge variant="default" className="text-sm font-medium">
                  Old Alumni Account
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Personal Information
              </h3>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Hash className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Student ID</p>
                  <p className="font-medium">{alumni.studentId || "No data"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <a
                    href={`mailto:${alumni.email}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {alumni.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Academic Information
              </h3>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Course</p>
                  <p className="font-medium">{alumni.course}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Batch Year</p>
                  <p className="font-medium">{alumni.batch}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Post Graduate</p>
                  <p className="font-medium">
                    {alumni.postStudyUniversity || "No data"}
                  </p>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Employment Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Occupation
                    </p>
                    <p className="font-medium">
                      {alumni.currentOccupation || "No data"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">
                      {alumni.industry || "No data"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{alumni.company || "No data"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Title</p>
                    <p className="font-medium">
                      {alumni.jobTitle || "No data"}
                    </p>
                  </div>
                </div>
              </div>

              {/*<div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Years to get this job</p>
                  <p className="font-medium">{alumni.years || "|| "No data""}</p>
                </div>
              </div>*/}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          For assistance, contact the Academic Office or visit the Help Center
        </p>
      </footer>
    </div>
  );
};

export default ViewQRCodeDetail;
