import { Button } from "@/components";

interface ApprovalProps {
  handleClick: VoidFunction;
}

export default function Approval({ handleClick }: ApprovalProps) {
  return (
    <>
      <h1 className="text-2xl mt-4 font-bold text-center text-white">
        Registration Successful
      </h1>
      <p className="text-lg text-center text-white">
        Your account is pending approval
      </p>
      <p className="text-white text-center mt-2">
        Thank you for registering! Your account is currently under review by our
        administrators.
      </p>
      <div className="bg-gray-100 rounded-lg p-6 shadow-md mt-4">
        <h3 className="font-semibold text-lg text-gray-800">
          What happens next?
        </h3>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mt-2">
          <li>Our admin team will review your registration</li>
          <li>You will receive an email once your account is approved</li>
          <li>After approval, you can log in to your account</li>
        </ul>
      </div>
      <p className="text-sm text-white text-center mt-4">
        This process typically takes 1-2 business days. Please check your email
        for updates.
      </p>

      <Button
        type="button"
        onClick={handleClick}
        variant="default"
        className="mx-auto block mt-3 mb-5"
      >
        Back to log in
      </Button>
    </>
  );
}
