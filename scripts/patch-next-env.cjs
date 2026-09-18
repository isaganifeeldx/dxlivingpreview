/**
 * Preload before tsx/Payload. Fixes:
 *   Cannot destructure property 'loadEnvConfig' of 'import_env.default' as it is undefined
 * when Payload's loadEnv does `import x from '@next/env'` under tsx on Vercel.
 */
const Module = require('module')

const originalLoad = Module._load
Module._load = function patchedNextEnvLoad(request, parent, isMain) {
  const exported = originalLoad.apply(this, arguments)
  if (
    typeof request === 'string' &&
    request.includes('@next/env') &&
    exported &&
    typeof exported === 'object' &&
    !exported.default &&
    typeof exported.loadEnvConfig === 'function'
  ) {
    exported.default = exported
  }
  return exported
}

try {
  const nextEnv = require('@next/env')
  if (nextEnv && !nextEnv.default && typeof nextEnv.loadEnvConfig === 'function') {
    nextEnv.default = nextEnv
  }
} catch {
  // @next/env may resolve later; Module._load patch still covers it.
}
