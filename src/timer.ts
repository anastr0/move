export function getTimerState(durationSeconds: number, elapsedMs: number) {
  const remaining = Math.max(0, durationSeconds - elapsedMs / 1000)
  const progress = Math.min(1, remaining / durationSeconds)
  return {
    remainingSeconds: Math.ceil(remaining),
    progress,
    color: progress <= 0.1 ? 'text-red-500' : progress <= 0.25 ? 'text-amber-500' : 'text-green-500',
  }
}
