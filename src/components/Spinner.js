export default function Spinner() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white/60 z-50">
      <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
    </div>
  );
}
