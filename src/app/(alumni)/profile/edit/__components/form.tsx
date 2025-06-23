"use client";

import { updateProfileActions } from "@/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  Form,
  FormLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Button,
  LocationPicker,
} from "@/components";
import AvatarUpload from "@/components/custom/avatar-upload";
import { alumniLabel } from "@/constant";
import { ProfileSchema } from "@/lib";
import type { AddressData, ProfileFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Gender, User } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const currentYear = new Date().getFullYear() - 1; // Get the current year
const years = Array.from({ length: 50 }, (_, i) => currentYear - i); // Create a range of years for the last 50 years

interface EditProfileFormProps {
  user: Omit<User, "address" | "rate"> & {
    address?: AddressData;
    rate?: number;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const defaultValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    middleName: user.middleName || "",
    birthDate: user.birthDate.toISOString(),
    contactNumber: user.contactNumber || "",
    religion: user.religion || "",
    nationality: user.nationality || "",
    address: user.address,
    avatar: user.avatar || "",
    gender: user.gender || "MALE",
    batch: String(user.batch),
    company: user.company || "",
    course: user.course || "",
    currentOccupation: user.currentOccupation || "",
    jobTitle: user.jobTitle || "",
    studentId: user.studentId || "",
    bio: user.bio || "",
  };

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
  });

  const handleSignUp = async (values: ProfileFormData) => {
    try {
      await updateProfileActions(user.id, {
        ...values,
        gender: values.gender as Gender,
        batch: Number(values.batch),
      });

      toast.success("Profile updated successfully", {
        richColors: true,
        description: "Your profile has been updated successfully",
        position: "top-center",
      });
      router.push("/profile");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error uploading file", {
        richColors: true,
        description: "Please try again",
        position: "top-center",
      });
    }
  };

  const Actions = () => (
    <div className="flex gap-2 justify-end">
      <Button
        type="reset"
        variant="destructive"
        // onClick={() => form.reset(defaultValues)}>
      >
        Reset
      </Button>
      <Button type="submit" variant="secondary">
        {form.formState.isSubmitting ? "Saving..." : "Save"}
      </Button>
    </div>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSignUp)}
        onReset={() => form.reset()}
      >
        <div className="rounded-3xl space-y-5 px-5 bg-[#2F61A0] py-10 dark:bg-[#5473a8]">
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              <Button asChild size="icon" variant="ghost">
                <Link href="/profile" className="text-white">
                  <ArrowLeft className="" />
                </Link>
              </Button>
              <h1 className="text-2xl text-white">Edit Profile</h1>
            </div>
            <Actions />
          </div>

          <AvatarUpload
            avatarFallback={`${user.firstName[0]}${user.lastName[0]}`}
            isDisabled={form.formState.isSubmitting}
            handleSetValue={(value) => {
              form.setValue("avatar", value || "");
            }}
            avatarImage={form.getValues("avatar")}
          />

          <Card className="bg-transparent text-white">
            <CardHeader className="px-5 pb-2 pt-5 font-medium">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pt-2 pb-4 grid grid-cols-1 gap-3  md:grid-cols-3  md:col-span-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
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
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
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
                    <FormLabel>Birth Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="text-white data-[placeholder]:text-white/80 first-letter:uppercase">
                          <SelectValue
                            placeholder="Select gender"
                            className="text-white  "
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2F61A0] shadow-lg border-none dark:bg-[#5473a8]">
                          <SelectGroup>
                            <SelectLabel className="text-white">
                              Gender
                            </SelectLabel>
                            {Object.keys(alumniLabel).map((item) => (
                              <SelectItem
                                key={item}
                                value={item}
                                className="first-letter:capitalize text-white"
                              >
                                {item.replaceAll(/_/g, " ").toLowerCase()}
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

              {/* Add the address field with location picker */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <LocationPicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="religion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Religion</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Rest of your form remains the same */}
          <Card className="bg-transparent text-white">
            <CardHeader className="px-5 pb-2 pt-5 font-medium">
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pt-2 pb-4 grid grid-cols-2 gap-3 sms:grid-cols-2 md:grid-cols-3 ">
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={true}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
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
                          field.onChange(String(value))
                        }
                        value={field.value.toString()}
                      >
                        {/* Option to prompt user */}
                        <SelectTrigger className="text-white data-[placeholder]:text-white/80 first-letter:uppercase">
                          <SelectValue
                            placeholder="Select gender"
                            className="text-white  "
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2F61A0] shadow-lg border-none dark:bg-[#5473a8]">
                          <SelectGroup>
                            <SelectLabel className="text-white">
                              Batch Year
                            </SelectLabel>
                            {years.map((year) => (
                              <SelectItem
                                value={year.toString()}
                                key={year}
                                className="first-letter:capitalize text-white"
                              >
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
            </CardContent>
          </Card>

          <Card className="bg-transparent text-white">
            <CardHeader className="px-5 pb-2 pt-5 font-medium">
              <CardTitle>Post - Graduation Information</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pt-2 pb-4 grid grid-cols-1 gap-3  md:grid-cols-3  md:col-span-2">
              <FormField
                control={form.control}
                name="currentOccupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input
                        readOnly={form.formState.isSubmitting}
                        className="  dark:text-white  dark:selection:bg-black/15 border-x-0 border-t-0 border-b-2 h-10 rounded-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Actions />
        </div>
      </form>
    </Form>
  );
}
