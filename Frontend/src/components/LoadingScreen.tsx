export function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in">
      <div className="relative flex items-center justify-center mb-4">
        {/* Outer slow pulse */}
        <div className="absolute w-16 h-16 rounded-full border-2 border-purple-500/20 animate-pulse-slow" />
        
        {/* Inner spinner */}
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500/30 border-t-purple-500 animate-spin" />
      </div>
      <p className="text-gray-500 font-medium tracking-wide text-sm">Loading...</p>
    </div>
  );
}
