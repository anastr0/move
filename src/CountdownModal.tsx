import { useEffect, useRef, useState } from 'react'
import type { CountdownConfig } from './Countdown'
import { getTimerState } from './timer'

interface CountdownModalProps {
  countdown: CountdownConfig
  onClose: () => void
}

export default function CountdownModal({ countdown, onClose }: CountdownModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [restartCount, setRestartCount] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const { remainingSeconds, progress, color } = getTimerState(countdown.moveSeconds, elapsedMs)
  const completed = remainingSeconds === 0

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const startedAt = performance.now()
    let frame: number
    const tick = () => {
      const elapsed = performance.now() - startedAt
      setElapsedMs(elapsed)
      if (elapsed < countdown.moveSeconds * 1000) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [countdown.moveSeconds, restartCount])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="timer-heading"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-3rem)] w-[calc(100%-3rem)] max-w-md overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-2xl shadow-black/40 backdrop:bg-black/60 backdrop:backdrop-blur-md sm:p-8"
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="timer-heading" className="break-words text-xl font-semibold">{countdown.label}</h2>
        <button type="button" onClick={onClose} aria-label="Close countdown" className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </div>
      <div className="relative mx-auto my-8 w-full max-w-72">
        <svg viewBox="0 0 240 240" aria-hidden="true" className="w-full -rotate-90">
          <circle cx="120" cy="120" r="106" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-800" />
          <circle cx="120" cy="120" r="106" fill="none" stroke="currentColor" strokeWidth="10" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} strokeLinecap={completed ? 'butt' : 'round'} className={`${color} transition-colors duration-300 motion-reduce:transition-none`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span role="timer" aria-label={`${remainingSeconds} seconds remaining`} className="max-w-full break-all px-5 text-center font-mono text-5xl tabular-nums">{remainingSeconds}</span>
          <span className="text-sm text-zinc-400">{completed ? 'Complete' : 'seconds remaining'}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p role="status" className="text-sm text-zinc-400">{completed ? 'Effort complete. Nice work!' : 'Move · Give this effort your focus.'}</p>
        <button
          type="button"
          aria-label="Restart countdown"
          title="Restart countdown"
          onClick={() => {
            setElapsedMs(0)
            setRestartCount((count) => count + 1)
          }}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M3 11a9 9 0 1 1 2.7 7.4M3 4v7h7" />
          </svg>
        </button>
      </div>
    </dialog>
  )
}
