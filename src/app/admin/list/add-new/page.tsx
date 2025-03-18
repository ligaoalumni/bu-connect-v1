import { AdminCredentialsGenerator } from "../../_components/admin-credentials-generator";

export default function CreateAdminPage() {
	return (
		<div className="container mx-auto py-5">
			<h1 className="text-3xl font-bold mb-6">Create New Admin</h1>
			<p className="text-muted-foreground mb-8">
				Generate secure credentials for a new administrator and send them via
				email.
			</p>
			<AdminCredentialsGenerator />
		</div>
	);
}
