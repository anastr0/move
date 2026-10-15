let context: AudioContext | null = null
let activeTone: OscillatorNode | null = null

// Call from a user gesture so browsers allow subsequent countdown sounds.
export function enableCountdownAudio() {
  try {
    context ??= new AudioContext()
    if (context.state === 'suspended') void context.resume().catch(() => {})
  } catch {
    // Audio is optional; the visual timer still works without it.
  }
}

export function stopCountdownTone() {
  if (activeTone) {
    activeTone.stop()
    activeTone = null
  }
}

export function playCountdownTone() {
  if (!context || context.state !== 'running') return
  stopCountdownTone()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const now = context.currentTime
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(880, now)
  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(0.15, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  oscillator.connect(gain)
  gain.connect(context.destination)
  activeTone = oscillator
  oscillator.onended = () => {
    oscillator.disconnect()
    gain.disconnect()
    if (activeTone === oscillator) activeTone = null
  }
  oscillator.start(now)
  oscillator.stop(now + 0.16)
}
