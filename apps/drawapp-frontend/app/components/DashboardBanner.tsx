export function DashboardBanner() {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden shadow-lg bg-cover bg-center" 
    >
      <div className="bg-gradient-to-r from-black/40 via-transparent to-transparent p-6 md:p-10">
        <h2 className="text-2xl md:text-4xl font-bold text-white">Your Rooms</h2>
        <p className="mt-2 text-sm md:text-base text-white/90 max-w-xl">
          Create new rooms, join an session You have created.
        </p>
      </div>
    </div>
  );
}
