export interface CountdownConfig {
  id: string
  label: string
  moveSeconds: number
  reps: number
  breakSeconds: number
}

export default function Countdown({ label, moveSeconds, reps, breakSeconds, onPlay }: CountdownConfig & { onPlay: () => void }) {
  const minutes = Math.floor(moveSeconds / 60)
  const seconds = moveSeconds % 60
  const duration = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="break-words text-lg font-medium">{label}</h3>
        <span className="shrink-0 rounded-full border border-fuchsia-700/50 px-3 py-1 text-xs text-zinc-300">Ready</span>
      </div>
      <p className="my-8 text-center font-mono text-5xl tabular-nums" aria-label={`${minutes} minutes ${seconds} seconds`}>{duration}</p>
      <button type="button" onClick={onPlay} aria-label={`Play ${label}`} aria-haspopup="dialog" className="mb-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-fuchsia-700 px-5 py-3 text-sm font-semibold text-white hover:bg-fuchsia-800">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-4"><path d="m8 5 11 7-11 7V5Z" /></svg>
        Play
      </button>
      <dl className="grid grid-cols-3 gap-3 border-t border-zinc-800 pt-4 text-center">
        <div><dt className="text-xs text-zinc-400">Move</dt><dd className="mt-1 text-sm">{moveSeconds} sec</dd></div>
        <div><dt className="text-xs text-zinc-400">Reps</dt><dd className="mt-1 text-sm">{reps}</dd></div>
        <div><dt className="text-xs text-zinc-400">Break</dt><dd className="mt-1 text-sm">{breakSeconds} sec</dd></div>
      </dl>
    </article>
  )
}
