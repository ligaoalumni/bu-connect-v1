"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Users } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectLabel,
  SelectGroup,
  SelectItem,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components";
import { programs } from "@/constant";
import { DatePicker } from "./date-picker";

const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters"),
  middleName: z
    .string()
    .max(50, "Middle name must be less than 50 characters")
    .optional(),
  birthDate: z.date({
    required_error: "Birth date is required",
  }),
  program: z
    .string()
    .min(1, "Program is required")
    .max(100, "Program must be less than 100 characters"),
  batch: z.coerce.number().int().min(1, "Batch must be a positive number"),
});

export type OldAlumniData = z.infer<typeof formSchema>;

interface AddOldAlumniRecordFormProps {
  initialData?: Partial<OldAlumniData>;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 70 }, (_, i) => currentYear - i);

export function AddOldAlumniRecordForm({
  initialData,
}: AddOldAlumniRecordFormProps) {
  const form = useForm<OldAlumniData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      middleName: initialData?.middleName || "",
      birthDate: initialData?.birthDate || undefined,
      program: initialData?.program || "",
      batch: initialData?.batch || 1,
    },
  });

  const handleSubmit = async (data: OldAlumniData) => {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {initialData ? "Edit" : "Add"} Old Alumni Data
        </CardTitle>
        <CardDescription>
          {initialData
            ? "Edit student information to update the system."
            : "Enter student information to add a single student to the system."}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter middle name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birth Date</FormLabel>
                    <DatePicker value={field.value} onChange={field.onChange} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="program"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Program</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        {/* Option to prompt user */}
                        <SelectTrigger className="   ">
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

              <FormField
                control={form.control}
                name="batch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value.toString()}
                      >
                        <SelectTrigger className="w-full  ">
                          <SelectValue placeholder="Select alumnus/alumna batch" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Batch</SelectLabel>
                            {years.map((batch) => (
                              <SelectItem value={batch.toString()} key={batch}>
                                {batch.toString()}
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
              className="ml-auto min-w-72 "
            >
              {form.formState.isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
