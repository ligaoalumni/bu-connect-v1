"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components";
import { Users } from "lucide-react";
import { AlumniFormData } from "@/types";
import { AlumniSchema } from "@/lib";
import { toast } from "sonner";
import {
  addAlumniData,
  revalidatePathAction,
  updateAlumniRecord,
} from "@/actions";
import { formatDate } from "date-fns";
import { User } from "@prisma/client";
import { programs } from "@/constant";

// Define the form's type
const currentYear = new Date().getFullYear() - 1; // Get the current year
const years = Array.from({ length: 75 }, (_, i) => currentYear - i); // Create a range of years for the last 50 years

interface AlumniRecordFormProps {
  alumni?: Omit<User, "rate"> & { rate?: number };
}

export function AlumniRecordForm({ alumni }: AlumniRecordFormProps) {
  // Initialize the form
  const form = useForm<AlumniFormData>({
    resolver: zodResolver(AlumniSchema),
    defaultValues: {
      studentId: alumni?.studentId || "",
      firstName: alumni?.firstName || "",
      lastName: alumni?.lastName || "",
      middleName: alumni?.middleName || "",
      birthDate: alumni?.birthDate
        ? formatDate(alumni.birthDate, "yyyy-MM-dd")
        : "",
      batch: Number(alumni?.batch || new Date().getFullYear()),
      email: alumni?.email || "",
      course: alumni?.course || "",
    },
  });

  // Handle single student form submission
  const onSubmit = async (data: AlumniFormData) => {
    try {
      // For demo purposes, simulate an API call

      if (alumni) {
        await updateAlumniRecord(alumni.id, data);
      } else {
        await addAlumniData({
          ...data,
          middleName: data.middleName || "",
          birthDate: new Date(data.birthDate),
        });
      }

      await revalidatePathAction("/alumni/records");

      // Show success message with Sonner toast
      toast.success(alumni ? "Student updated" : "Student Added", {
        description: alumni
          ? "Successfully updated student record"
          : "Successfully added student record",
        richColors: true,
        position: "top-center",
      });

      // Reset form
      if (!alumni) {
        form.reset({
          studentId: "",
          firstName: "",
          lastName: "",
          middleName: "",
          birthDate: "",
          batch: new Date().getFullYear() - 1,
          email: "",
          course: "",
        });
      }
    } catch (error) {
      toast.error("Error ", {
        description:
          error instanceof Error ? error.message : "Failed to save student",
        richColors: true,
        position: "top-center",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {alumni ? "Edit" : "Add"} Student
        </CardTitle>
        <CardDescription>
          {alumni
            ? "Edit student information to update the system."
            : "Enter student information to add a single student to the system."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input className="h-12 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-2 md:col-span-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="h-12 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="col-span-3 md:col-span-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input className="h-12 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem className="col-span-3 md:col-span-1">
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input className="h-12 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="col-span-3 md:col-span-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input className="h-12 text-lg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4  ">
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="h-12 text-lg"
                        type="date"
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) =>
                          field.onChange(Number(value))
                        }
                        value={field.value.toString()}
                      >
                        {/* Option to prompt user */}
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select a year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Year</SelectLabel>
                            {years.map((year) => (
                              <SelectItem value={year.toString()} key={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        {/* Option to prompt user */}
                        <SelectTrigger className="w-full h-12">
                          <SelectValue placeholder="Select student's program" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Program</SelectLabel>
                            {programs.map((program) => (
                              <SelectItem value={program} key={program}>
                                {program}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Student"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
