"use client";

import type React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@/components";

import { RecruitmentSchema, cn } from "@/lib";
import { RecruitmentFormData } from "@/types";
import { Recruitment } from "@prisma/client";
import { toast } from "sonner";
import { createRecruitmentAction, updateRecruitmentAction } from "@/actions";
import { useRouter } from "next/navigation";
import { INDUSTRIES } from "@/constant";

// Form schema

interface RecruitmentFormProps {
  initialData?: Recruitment;
  batches: number[];
}

export function RecruitmentForm({
  initialData,
  batches,
}: RecruitmentFormProps) {
  const [topicInput, setTopicInput] = useState("");
  const [batchesOpen, setBatchesOpen] = useState(false);
  const router = useRouter();

  // Initialize form with default values or editing data
  const form = useForm<RecruitmentFormData>({
    resolver: zodResolver(RecruitmentSchema),
    defaultValues: initialData
      ? {
          allowedBatches: initialData.allowedBatches,
          date: initialData.date,
          industry: initialData.industry,
          eventTitle: initialData.eventTitle,
          topics: initialData.topics.split(","),
        }
      : {
          eventTitle: "",
          allowedBatches: [],
          industry: "",
          topics: [],
          date: new Date(),
        },
  });

  // Handle form submission
  const handleSubmit = async (values: RecruitmentFormData) => {
    try {
      let id = initialData?.id;
      if (initialData) {
        // UPDATE
        const recruitment = await updateRecruitmentAction(initialData.id, {
          ...values,
          topics: values.topics.join(","),
        });
        id = recruitment.id;
      } else {
        // CREATE
        const recruitment = await createRecruitmentAction({
          ...values,
          topics: values.topics.join(","),
        });
        id = recruitment.id;
      }
      router.push(`/admin/recruitment/${id}/info`);

      toast.success(
        `Successfully ${initialData ? "updated" : "created"} recruitment`,
        {
          description: "The recruitment has been successfully saved.",
          richColors: true,
          position: "top-center",
        },
      );
    } catch (error) {
      toast.error(
        `Failed to ${initialData ? "update" : "create"} recruitment`,
        {
          description:
            error instanceof Error ? error.message : "Please try again later.",
          richColors: true,
          position: "top-center",
        },
      );
    }
  };

  // Handle adding a new topic
  const handleAddTopic = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && topicInput.trim() !== "") {
      e.preventDefault();
      const currentTopics = form.getValues("topics") || [];
      if (!currentTopics.includes(topicInput.trim())) {
        form.setValue("topics", [...currentTopics, topicInput.trim()]);
        setTopicInput("");
      }
    }
  };

  // Handle removing a topic
  const handleRemoveTopic = (topic: string) => {
    const currentTopics = form.getValues("topics");
    form.setValue(
      "topics",
      currentTopics.filter((t) => t !== topic),
    );
  };

  // Toggle "All batches" selection
  const toggleAllBatches = () => {
    const currentBatches = form.getValues("allowedBatches");
    if (currentBatches.length === batches.length) {
      form.setValue("allowedBatches", []);
    } else {
      form.setValue(
        "allowedBatches",
        batches.map((batch) => batch),
      );
    }
  };

  // Toggle individual batch selection
  const toggleBatch = (batchId: number) => {
    const currentBatches = form.getValues("allowedBatches");
    if (currentBatches.includes(batchId)) {
      form.setValue(
        "allowedBatches",
        currentBatches.filter((id) => id !== batchId),
      );
    } else {
      form.setValue("allowedBatches", [...currentBatches, batchId]);
    }
  };

  return (
    <Form {...form}>
      <form
        onReset={() => form.reset()}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        <h1 className="text-3xl text-center font-medium ">
          <span className="capitalize">{form.getValues("recruiting")}</span>{" "}
          Recruitment
        </h1>

        <div className="shadow-md rounded-lg p-5 bg-white">
          <h2 className="text-2xl font-semibold mb-4">
            <span className="capitalize">{form.getValues("recruiting")}</span>{" "}
            Details
          </h2>
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="eventTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={form.formState.isSubmitting}
                      placeholder="Enter recruitment title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recruiting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recruiting</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={form.formState.isSubmitting}
                      placeholder="Enter what to recruit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowedBatches"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Allowed Batches</FormLabel>
                  <Popover open={batchesOpen} onOpenChange={setBatchesOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={form.formState.isSubmitting}
                          variant="outline"
                          role="combobox"
                          aria-expanded={batchesOpen}
                          className="w-full justify-between"
                        >
                          {field.value.length > 0
                            ? field.value.length === batches.length
                              ? "All batches"
                              : `${field.value.length} batch${
                                  field.value.length > 1 ? "es" : ""
                                } selected`
                            : "Select batches..."}
                          <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search batches..." />
                        <CommandList>
                          <CommandEmpty>No batches found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value="all-batches"
                              onSelect={toggleAllBatches}
                              className="cursor-pointer"
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  field.value.length === batches.length
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible",
                                )}
                              >
                                <svg
                                  className={cn("h-3 w-3")}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span>All batches</span>
                            </CommandItem>
                            {batches.map((batch) => (
                              <CommandItem
                                key={batch}
                                value={batch.toString()}
                                onSelect={() => toggleBatch(batch)}
                                className="cursor-pointer"
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    field.value.includes(batch)
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible",
                                  )}
                                >
                                  <svg
                                    className={cn("h-3 w-3")}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span>Batch {batch}</span>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value.length === batches.length ? (
                      <Badge variant="secondary" className="px-3 py-1">
                        All batches
                      </Badge>
                    ) : (
                      field.value.map((batchId) => {
                        const batch = batches.find((b) => b === batchId);
                        return (
                          <Badge
                            key={batchId}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            Batch {batch}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => toggleBatch(batchId)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {batch}</span>
                            </Button>
                          </Badge>
                        );
                      })
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <Select
                    disabled={form.formState.isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          {industry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="topics"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topics</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input
                        readOnly={form.formState.isSubmitting}
                        placeholder="Add topics (press Enter)"
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        onKeyDown={handleAddTopic}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {field.value.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="px-3 py-1"
                          >
                            {topic}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 ml-1"
                              onClick={() => handleRemoveTopic(topic)}
                            >
                              <X className="h-3 w-3" />
                              <span className="sr-only">Remove {topic}</span>
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  {field.value.length === 0 && (
                    <FormDescription>
                      Press Enter to add a topic after typing
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={form.formState.isSubmitting}
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-between items-center mt-7 mb-2 ">
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting
                ? "Saving..."
                : initialData
                  ? "Update Recruitment"
                  : "Create Recruitment"}
            </Button>
            <Button
              disabled={form.formState.isSubmitting}
              variant="destructive"
              type="reset"
            >
              Reset
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
