export function getTimerState(durationSeconds: number, elapsedMs: number) {
  const remaining = Math.max(0, durationSeconds - elapsedMs / 1000)
  const progress = Math.min(1, remaining / durationSeconds)
  return {
    remainingSeconds: Math.ceil(remaining),
    progress,
    color: progress <= 0.1 ? 'text-red-500' : progress <= 0.25 ? 'text-orange-500' : progress <= 0.5 ? 'text-amber-500' : 'text-fuchsia-400',
  }
}

export function getSessionState(
  moveSeconds: number,
  breakSeconds: number,
  reps: number,
  elapsedMs: number,
) {
  const cycleMs = (moveSeconds + breakSeconds) * 1000
  const totalMs = cycleMs * reps
  const completed = elapsedMs >= totalMs
  const rep = completed ? reps : Math.floor(elapsedMs / cycleMs) + 1
  const cycleElapsedMs = elapsedMs % cycleMs
  const phase = completed ? 'Complete' : cycleElapsedMs < moveSeconds * 1000 ? 'Move' : 'Break'
  const duration = phase === 'Break' ? breakSeconds : moveSeconds
  const phaseElapsedMs = phase === 'Break' ? cycleElapsedMs - moveSeconds * 1000 : cycleElapsedMs

  return {
    ...getTimerState(duration, completed ? duration * 1000 : phaseElapsedMs),
    phase,
    rep,
    completed,
    totalMs,
  }
}
