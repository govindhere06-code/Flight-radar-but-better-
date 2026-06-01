'use client'

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
      </div>
      <p className="text-muted-foreground">Searching for flights...</p>
    </div>
  )
}
