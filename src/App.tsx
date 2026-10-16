import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import Countdown from './Countdown'
import CountdownModal from './CountdownModal'
import { enableCountdownAudio } from './countdownAudio'
import { loadCountdowns, saveCountdowns } from './countdownStorage'
import type { CountdownConfig } from './Countdown'

const inputClass = 'mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-3 text-zinc-100 placeholder:text-zinc-600'

function App() {
  const [countdowns, setCountdowns] = useState<CountdownConfig[]>(loadCountdowns)

  const [activeCountdown, setActiveCountdown] = useState<CountdownConfig | null>(null)
  const [storageError, setStorageError] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  const dialogRef = useRef<HTMLDialogElement>(null)
  const showForm = countdowns.length === 0 || isFormOpen

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!showForm) {
      dialog.close()
      return
    }

    dialog.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [showForm])

  function createCountdown(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const label = String(data.get('label') ?? '').trim()
    const move = String(data.get('move') ?? '')
    if (!/^[0-9]+$/.test(move)) return
    const moveSeconds = Number(move)
    const reps = Number(data.get('reps'))
    const breakSeconds = Number(data.get('breakSeconds'))

    if (!label || !Number.isSafeInteger(moveSeconds) || moveSeconds < 1 ||
        !Number.isSafeInteger(reps) || reps < 1 ||
        !Number.isSafeInteger(breakSeconds) || breakSeconds < 0) return

    const nextCountdowns = [...countdowns, {
      id: crypto.randomUUID(), label, moveSeconds, reps, breakSeconds,
    }]
    setStorageError(!saveCountdowns(nextCountdowns))
    setCountdowns(nextCountdowns)
    setIsFormOpen(false)
    form.reset()
  }

  return (
    <div className="mx-auto flex min-h-svh max-w-5xl flex-col px-6 sm:px-10">
      <header className="flex items-center justify-between border-b border-zinc-800 py-6">
        <a href="/" className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-lg bg-fuchsia-700 text-white" aria-hidden="true">m</span>
          move
        </a>
        {countdowns.length > 0 && (
          <button
            type="button"
            aria-label="Create a new countdown"
            aria-haspopup="dialog"
            aria-expanded={isFormOpen}
            aria-controls="countdown-dialog"
            onClick={() => setIsFormOpen(true)}
            className="flex size-10 cursor-pointer items-center justify-center rounded-lg bg-fuchsia-700 text-white transition-colors hover:bg-fuchsia-800 motion-reduce:transition-none"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        )}
      </header>

      <main className="flex-1 py-12 sm:py-20">
        <dialog
          ref={dialogRef}
          id="countdown-dialog"
          aria-labelledby="session-heading"
          aria-describedby="session-description"
          onCancel={(event) => {
            event.preventDefault()
            if (countdowns.length > 0) setIsFormOpen(false)
          }}
          className="fixed inset-0 m-auto max-h-[calc(100dvh-3rem)] w-[calc(100%-3rem)] max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-2xl shadow-black/40 backdrop:bg-black/60 backdrop:backdrop-blur-md sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <h1 id="session-heading" className="text-2xl font-semibold tracking-tight">Set your next interval session.</h1>
            {countdowns.length > 0 && (
              <button type="button" aria-label="Close countdown form" onClick={() => setIsFormOpen(false)} className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5"><path d="m6 6 12 12M6 18 18 6" /></svg>
              </button>
            )}
          </div>
          <p id="session-description" className="mt-2 text-sm leading-6 text-zinc-400">Build your running or HIIT session. Set an effort interval, choose your reps, and add recovery time between efforts.</p>
          <form id="countdown-form" onSubmit={createCountdown} className="mt-6 grid gap-5 sm:grid-cols-3">
            <label className="text-sm font-medium sm:col-span-3">
              Label
              <input className={inputClass} name="label" type="text" placeholder="e.g. Sprint intervals or HIIT circuit" required maxLength={100} pattern=".*\S.*" />
            </label>
            <label className="text-sm font-medium">
              Move (seconds)
              <input className={inputClass} name="move" type="text" inputMode="numeric" placeholder="30" required pattern="[0-9]+" title="Enter a positive whole number of seconds." aria-describedby="move-hint" onInput={(event) => {
                const value = event.currentTarget.value
                event.currentTarget.setCustomValidity(value && (!/^[0-9]+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) ? 'Enter a positive whole number of seconds.' : '')
              }} />
              <span id="move-hint" className="mt-2 block text-xs font-normal text-zinc-400">Effort duration · whole seconds</span>
            </label>
            <label className="text-sm font-medium">
              Reps
              <input className={inputClass} name="reps" type="number" placeholder="8" required min={1} step={1} max={Number.MAX_SAFE_INTEGER} />
            </label>
            <label className="text-sm font-medium">
              Break (seconds)
              <input className={inputClass} name="breakSeconds" type="number" placeholder="60" required min={0} step={1} max={Number.MAX_SAFE_INTEGER} />
              <span className="mt-2 block text-xs font-normal text-zinc-400">Recovery between efforts</span>
            </label>
            <button type="submit" className="cursor-pointer rounded-lg bg-fuchsia-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-fuchsia-800 motion-reduce:transition-none sm:col-span-3">Create interval session</button>
          </form>
        </dialog>

        {storageError && (
          <p role="alert" className="mt-6 text-sm text-zinc-300">Your browser could not save your countdowns. They will only be available until you leave this page.</p>
        )}

        <section aria-labelledby="countdowns-heading" className="mt-12">
          <h2 id="countdowns-heading" className="text-lg font-medium">Your countdowns</h2>
          <p role="status" className="mt-2 text-sm text-zinc-400">
            {countdowns.length === 0 ? 'Create a countdown to see it here.' : `${countdowns.length} ${countdowns.length === 1 ? 'countdown' : 'countdowns'} created.`}
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            {countdowns.map((countdown) => <Countdown key={countdown.id} {...countdown} onPlay={() => { enableCountdownAudio(); setActiveCountdown(countdown) }} />)}
          </div>
        </section>
      </main>

      {activeCountdown && <CountdownModal countdown={activeCountdown} onClose={() => setActiveCountdown(null)} />}

      <footer className="border-t border-zinc-800 py-6 text-xs text-zinc-500">Move · MIT licensed</footer>
    </div>
  )
}

export default App
