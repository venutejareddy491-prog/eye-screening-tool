export default function LoadingSkeleton({ fullPage = false, rows = 3 }) {
  const bars = Array.from({ length: rows }, (_, i) => i);
  const content = (
    <div className="animate-pulse space-y-4 p-6">
      {bars.map((i) => (
        <div
          key={i}
          className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
      <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-6" />
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">{content}</div>
      </div>
    );
  }
  return content;
}
