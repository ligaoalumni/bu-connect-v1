export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-700">
      <div className="flex items-center space-x-2">
        <div className="h-5 w-5 rounded-full border-t-4 border-blue-500 border-solid animate-spin" />
        <span className="text-base">Loading...</span>
      </div>
    </div>
  );
}
