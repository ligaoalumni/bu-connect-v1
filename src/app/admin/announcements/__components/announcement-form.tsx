"use client";

import { createAnnouncementAction } from "@/actions";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	RichTextEditor,
} from "@/components";
import { AnnouncementSchema } from "@/lib";
import { updateAnnouncement } from "@/repositories";
import { AnnouncementFormData } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Announcement } from "@prisma/client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface AnnouncementFormProps {
	edit?: boolean;
	announcement?: Announcement;
	readOnly?: boolean;
}

export default function AnnouncementForm({
	announcement,
	edit,
	readOnly,
}: AnnouncementFormProps) {
	const router = useRouter();
	const form = useForm<AnnouncementFormData>({
		resolver: zodResolver(AnnouncementSchema),
		defaultValues: {
			content: announcement ? announcement?.content : "",
			title: announcement ? announcement?.title : "",
		},
	});

	const handleSubmit = async (values: AnnouncementFormData) => {
		try {
			let announcementSlug = "";
			if (edit && announcement) {
				const anncement = await updateAnnouncement(announcement.slug, values);
				announcementSlug = anncement.slug;
			} else {
				const announcement = await createAnnouncementAction({
					content: values.content,
					title: values.title,
				});
				announcementSlug = announcement.slug;
			}

			router.push(`/admin/announcements/${announcementSlug}/info`);

			toast.success(`${edit ? "Updated" : "Created"} announcement`, {
				description: `Announcement ${
					edit ? "updated" : "created"
				} successfully.`,
				position: "top-center",
				richColors: true,
			});
		} catch (error) {
			console.error("Error submitting form:", error);
			toast.error(`Error ${edit ? "updating" : "creating"} announcement`, {
				description:
					error instanceof Error
						? error.message
						: `An error occurred while ${
								edit ? "updating" : "creating"
						  } the announcement. Please try again.`,
				position: "top-center",
				richColors: true,
			});
		}
	};

	const Actions = () => (
		<div className="flex items-center gap-2">
			<Button
				disabled={form.formState.isSubmitting || readOnly}
				type="reset"
				variant="destructive">
				Reset
			</Button>
			<Button
				onClick={() => form.handleSubmit(handleSubmit)}
				disabled={form.formState.isSubmitting || readOnly}
				type="submit">
				{form.formState.isSubmitting ? "Saving..." : "Save"}
			</Button>
		</div>
	);

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				onReset={() => form.reset()}>
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-2">
						<Button asChild size="icon" variant="ghost">
							<Link href="/admin/announcements">
								<ArrowLeft />
							</Link>
						</Button>
						<div className="">
							<h1 className="font-medium">
								{readOnly
									? "Announcement Details"
									: edit
									? "Edit Announcement"
									: "Add Announcement"}
							</h1>
							<p className="text-sm text-muted-foreground">
								{readOnly
									? "View the details of the announcement below."
									: edit
									? "Update the details of the existing announcement below."
									: "Fill in the fields below to create a new announcement."}
							</p>
						</div>
					</div>
					{!readOnly && <Actions />}
				</div>
				<FormField
					disabled={form.formState.isSubmitting}
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Announcement Title</FormLabel>
							<FormControl>
								<Input
									readOnly={readOnly}
									className="read-only:border-none read-only:rounded-none read-only:shadow-none read-only:font-medium focus:outline-none"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					disabled={form.formState.isSubmitting || readOnly}
					name="content"
					render={() => (
						<FormItem className={`${readOnly ? "mt-5" : ""}`}>
							<FormLabel>Content</FormLabel>
							<FormControl>
								<RichTextEditor
									editable={!readOnly}
									content={announcement ? announcement?.content : undefined}
									handleValue={(editor) => {
										form.setValue("content", JSON.stringify(editor.getJSON()));
										form.clearErrors("content");
									}}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="mt-5  block ml-auto">
					<div className="ml-auto max-w-fit">{!readOnly && <Actions />}</div>
				</div>
			</form>
		</Form>
	);
}
