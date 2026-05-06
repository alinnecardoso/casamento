export default function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-[#e8d5b0]/50 rounded-sm ${className}`} />
  )
}

export function SkeletonGallery({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="aspect-square" />
      ))}
    </div>
  )
}
