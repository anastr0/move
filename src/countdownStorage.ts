import type { CountdownConfig } from './Countdown'

const storageKey = 'move.countdowns'

function isCountdown(value: unknown): value is CountdownConfig {
  if (typeof value !== 'object' || value === null) return false
  const countdown = value as Partial<CountdownConfig>
  return typeof countdown.id === 'string' && countdown.id.length > 0 &&
    typeof countdown.label === 'string' && countdown.label.trim().length > 0 &&
    countdown.label.length <= 100 &&
    Number.isSafeInteger(countdown.moveSeconds) && countdown.moveSeconds! > 0 &&
    Number.isSafeInteger(countdown.reps) && countdown.reps! > 0 &&
    Number.isSafeInteger(countdown.breakSeconds) && countdown.breakSeconds! >= 0
}

export function loadCountdowns(): CountdownConfig[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]')
    return Array.isArray(stored) ? stored.filter(isCountdown) : []
  } catch {
    return []
  }
}

export function saveCountdowns(countdowns: CountdownConfig[]): boolean {
  try {
    localStorage.setItem(storageKey, JSON.stringify(countdowns))
    return true
  } catch {
    return false
  }
}
