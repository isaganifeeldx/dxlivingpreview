type ShellReadyListener = (ready: boolean) => void

let shellReady = false
const listeners = new Set<ShellReadyListener>()

export const setShellReady = (ready: boolean) => {
  if (shellReady === ready) return
  shellReady = ready
  listeners.forEach((listener) => listener(ready))
}

export const isShellReady = () => shellReady

export const subscribeShellReady = (listener: ShellReadyListener) => {
  listeners.add(listener)
  listener(shellReady)
  return () => {
    listeners.delete(listener)
  }
}
