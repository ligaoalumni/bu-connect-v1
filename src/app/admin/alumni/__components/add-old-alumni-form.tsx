"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { programs } from "@/constant";
import { OldAccount } from "@prisma/client";
import { useState } from "react";
import { TabsContent, TabsList, TabsTrigger } from "@/components";
import { Tabs } from "@radix-ui/react-tabs";
import CSVUploader from "../../_components/csv-uploader";
import { createOldAccountAction, revalidatePathAction } from "@/actions";
import { toast } from "sonner";
import { sub } from "date-fns";

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

interface OldAccountModalProps {
  initialValue?: OldAccount;
}

const currentYear = sub(new Date(), { years: 1 }).getFullYear() - 1;
const years = Array.from({ length: 75 }, (_, i) => currentYear - i);

export function OldAccountModal({ initialValue }: OldAccountModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<OldAccountFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentID: "",
      firstName: "",
      lastName: "",
      middleName: "",
      program: "",
      batch: "",
    },
  });

  const handleOnOpenChange = () => setIsOpen((state) => !state);

  const onSubmit = async (data: OldAccountFormData) => {
    // console.log("Student data:", data);
    // // Handle form submission here

    // handleOnOpenChange();
    // form.reset();

    try {
      if (initialValue) {
      } else {
        await createOldAccountAction({
          ...data,
          middleName: data.middleName || "",
          batch: Number(data.batch),
          birthDate: new Date(data.birthDate),
          studentId: data.studentID,
        });
        revalidatePathAction("/admin/alumni/old");
      }

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
      handleOnOpenChange();
      form.reset();
    } catch (error) {
      console.log(`Error: ${error}`);
      toast.error("Something went wrong!", {
        description: "An error occurred while creating the old account.",
        position: "top-center",
        richColors: true,
      });
    }
  };

  const FormComponent = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                <Select onValueChange={field.onChange} value={field.value}>
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

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleOnOpenChange}
            >
              Cancel
            </Button>
            <Button type="submit">
              {form.formState.isSubmitting ? "Saving" : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={handleOnOpenChange}>
        <Button variant="outline">Add Old Alumni</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        {initialValue ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Data</DialogTitle>
              <DialogDescription>
                Manually input or upload historical data that was collected
                before the current system was implemented.
              </DialogDescription>
            </DialogHeader>
            <hr className="my-2" />
            <FormComponent />
          </>
        ) : (
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual</TabsTrigger>
              <TabsTrigger value="automatic">Batch Upload</TabsTrigger>
            </TabsList>
            <TabsContent value="manual">
              <DialogHeader>
                <DialogTitle>Add Old Data</DialogTitle>
                <DialogDescription>
                  Manually input or upload historical data that was collected
                  before the current system was implemented.
                </DialogDescription>
              </DialogHeader>
              <hr className="my-2" />
              <FormComponent />
            </TabsContent>
            <TabsContent value="automatic">
              <DialogHeader className="mb-4">
                <DialogTitle>Upload Batch Data</DialogTitle>
                <DialogDescription>
                  Upload a CSV or Excel file to add multiple records at once.
                  Make sure your data follows the required format.
                </DialogDescription>
              </DialogHeader>
              <hr className="mb-4" />
              <CSVUploader isOldAlumni />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
