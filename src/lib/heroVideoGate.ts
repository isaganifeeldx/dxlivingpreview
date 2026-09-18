type HeroVideoReadyListener = () => void;

let isHeroVideoReady = false;
let hasHeroVideoCandidate = false;
const listeners = new Set<HeroVideoReadyListener>();

export const resetHeroVideoGate = () => {
  isHeroVideoReady = false;
  hasHeroVideoCandidate = false;
};

export const registerHeroVideoCandidate = () => {
  hasHeroVideoCandidate = true;
};

export const signalHeroVideoReady = () => {
  if (isHeroVideoReady) return;
  isHeroVideoReady = true;
  listeners.forEach((listener) => listener());
};

export const subscribeHeroVideoReady = (listener: HeroVideoReadyListener) => {
  if (isHeroVideoReady) {
    listener();
  } else {
    listeners.add(listener);
  }

  return () => {
    listeners.delete(listener);
  };
};

export const getHeroVideoReadyState = () => ({
  isHeroVideoReady,
  hasHeroVideoCandidate,
});
