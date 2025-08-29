"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components";
import { programs } from "@/constant";
import { OldAccount } from "@prisma/client";
import {
  createOldAccountAction,
  revalidatePathAction,
  updateOldAccountAction,
} from "@/actions";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const formSchema = z.object({
  studentID: z
    .string()
    .min(1, "Student ID is required")
    .max(20, "Student ID must be less than 20 characters"),
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
  birthDate: z.string().min(1, "Birth date is required"),
  program: z.string().min(1, "Program is required"),
  batch: z.string().min(1, "Batch is required"),
});

type OldAccountFormData = z.infer<typeof formSchema>;

interface OldAccountProps {
  initialValue?: OldAccount;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export const OldAlumniForm = ({ initialValue }: OldAccountProps) => {
  const form = useForm<OldAccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentID: initialValue?.studentId ?? "",
      firstName: initialValue?.firstName ?? "",
      lastName: initialValue?.lastName ?? "",
      middleName: initialValue?.middleName ?? "",
      program: initialValue?.program ?? "",
      batch: initialValue?.batch.toString() ?? "",
      birthDate: initialValue
        ? initialValue.birthDate.toISOString().split("T")[0]
        : "",
    },
  });

  const onSubmit = async (data: OldAccountFormData) => {
    // console.log("Student data:", data);
    // // Handle form submission here

    // handleOnOpenChange();
    // form.reset();

    try {
      const toUpdate = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        program: data.program,
        middleName: data.middleName || "",
        batch: Number(data.batch),
        birthDate: new Date(data.birthDate),
        studentId: data.studentID.trim(),
      };

      if (initialValue) {
        await updateOldAccountAction(initialValue.id, toUpdate);
      } else {
        await createOldAccountAction(toUpdate);
      }
      revalidatePathAction("/admin/alumni/old", "/admin/alumni/old");

      toast.success(
        initialValue
          ? "Old account updated successfully!"
          : "Old account created successfully!",
        {
          description: `The old account information has been saved.`,
          position: "top-center",
          richColors: true,
        },
      );
      form.reset();
    } catch (error) {
      console.log(`Error: ${error}`);
      toast.error("Something went wrong!", {
        description: (error as Error).message || "Failed to save old account.",
        position: "top-center",
        richColors: true,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Add Old Alumni Data</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="studentID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter student ID" {...field} />
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
                    <FormLabel>Batch *</FormLabel>
                    <Select
                      defaultValue={field.value.toString()}
                      onValueChange={(v) => {
                        field.onChange(v);
                        form.clearErrors("batch");
                      }}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select student's batch" />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
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
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter middle name (optional)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birth Date *</FormLabel>
                  <FormControl>
                    {/*<DatePicker value={field.value} onChange={field.onChange} />*/}
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="program"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Program *</FormLabel>
                  <Select
                    onValueChange={(v) => {
                      field.onChange(v);
                      form.clearErrors("program");
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student's program" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-end gap-3 pt-4 ">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <>
                  <Loader className="mr-2" />
                  <span> Saving...</span>
                </>
              ) : (
                "Save"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};
