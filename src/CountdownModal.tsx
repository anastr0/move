import { useEffect, useRef, useState } from 'react'
import type { CountdownConfig } from './Countdown'
import { getSessionState } from './timer'
import { enableCountdownAudio, playCountdownTone, stopCountdownTone } from './countdownAudio'

interface CountdownModalProps {
  countdown: CountdownConfig
  onClose: () => void
}

export default function CountdownModal({ countdown, onClose }: CountdownModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const lastToneRef = useRef('')
  const elapsedRef = useRef(0)
  const startedAtRef = useRef(0)
  const [isPaused, setIsPaused] = useState(false)
  const [restartCount, setRestartCount] = useState(0)
  const [elapsedMs, setElapsedMs] = useState(0)
  const { remainingSeconds, progress, color, phase, rep, completed, totalMs } = getSessionState(
    countdown.moveSeconds, countdown.breakSeconds, countdown.reps, elapsedMs,
  )

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
    if (isPaused) return
    startedAtRef.current = performance.now() - elapsedRef.current
    let frame: number
    const tick = () => {
      const elapsed = Math.min(totalMs, performance.now() - startedAtRef.current)
      elapsedRef.current = elapsed
      setElapsedMs(elapsed)
      const state = getSessionState(countdown.moveSeconds, countdown.breakSeconds, countdown.reps, elapsed)
      const toneKey = `${state.rep}:${state.remainingSeconds}`
      if (state.phase === 'Move' && state.remainingSeconds <= 3 && toneKey !== lastToneRef.current) {
        lastToneRef.current = toneKey
        playCountdownTone()
      }
      if (elapsed < totalMs) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      stopCountdownTone()
    }
  }, [totalMs, countdown.moveSeconds, countdown.breakSeconds, countdown.reps, restartCount, isPaused])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="timer-heading"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      className={`fixed inset-0 m-auto max-h-[calc(100dvh-3rem)] w-[calc(100%-3rem)] max-w-md overflow-y-auto rounded-2xl border p-6 text-zinc-100 shadow-2xl shadow-black/40 transition-colors duration-700 backdrop:bg-black/60 backdrop:backdrop-blur-md motion-reduce:transition-none sm:p-8 ${completed ? 'border-zinc-800 bg-zinc-900' : phase === 'Break' ? 'border-cyan-900 bg-slate-950' : 'border-fuchsia-900 bg-fuchsia-950'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 id="timer-heading" className="break-words text-xl font-semibold">{countdown.label} <span className="font-normal text-zinc-400">· {phase}</span></h2>
        <button type="button" onClick={onClose} aria-label="Close countdown" className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M6 18 18 6" /></svg>
        </button>
      </div>
      <p role="status" className="mt-4 text-center text-sm font-medium text-zinc-300">
        {completed ? 'Session complete' : `Rep ${rep} of ${countdown.reps}`}
      </p>
      <div className="relative mx-auto my-8 w-full max-w-72">
        <svg viewBox="0 0 240 240" aria-hidden="true" className="w-full -rotate-90">
          <circle cx="120" cy="120" r="106" fill="none" stroke="currentColor" strokeWidth="10" className="text-zinc-800" />
          <circle cx="120" cy="120" r="106" fill="none" stroke="currentColor" strokeWidth="10" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - progress} strokeLinecap={completed ? 'butt' : 'round'} className={`${phase === 'Break' ? 'text-cyan-400' : color} transition-colors duration-300 motion-reduce:transition-none`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          <span role="timer" aria-label={`${phase}: ${remainingSeconds} seconds remaining`} className="max-w-full break-all px-5 text-center font-mono text-5xl tabular-nums">{remainingSeconds}</span>
          <span className="text-sm text-zinc-400">{completed ? 'Complete' : isPaused ? 'Paused' : 'seconds remaining'}</span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p role="status" className="text-sm text-zinc-400">{completed ? 'Session complete. Nice work!' : isPaused ? 'Paused · Resume when you’re ready.' : phase === 'Break' ? 'Recover · Catch your breath.' : 'Move · Give this effort your focus.'}</p>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            aria-label={isPaused ? 'Resume countdown' : 'Pause countdown'}
            title={isPaused ? 'Resume countdown' : 'Pause countdown'}
            disabled={completed}
            onClick={() => {
              if (isPaused) enableCountdownAudio()
              if (!isPaused) {
                elapsedRef.current = Math.min(totalMs, performance.now() - startedAtRef.current)
                setElapsedMs(elapsedRef.current)
              }
              setIsPaused((paused) => !paused)
            }}
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-default disabled:opacity-40 motion-reduce:transition-none"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              {isPaused ? <path d="m8 5 11 7-11 7V5Z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
            </svg>
          </button>
        <button
          type="button"
          aria-label="Restart countdown"
          title="Restart countdown"
          onClick={() => {
            enableCountdownAudio()
            stopCountdownTone()
            lastToneRef.current = ''
            elapsedRef.current = 0
            setElapsedMs(0)
            setIsPaused(false)
            setRestartCount((count) => count + 1)
          }}
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white motion-reduce:transition-none"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
            <path d="M3 11a9 9 0 1 1 2.7 7.4M3 4v7h7" />
          </svg>
        </button>
        </div>
      </div>
    </dialog>
  )
}
