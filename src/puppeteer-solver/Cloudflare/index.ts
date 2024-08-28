import { setTimeout } from 'node:timers/promises'

import { checkTurnstile } from '../../puppeteer-real-browser/module/turnstile'

const turnstileSolver = async (page: Page) => {
  console.debug('Try to resolve Cloudflare...')
  while (true) {
    const resCheck = await checkTurnstile({ page }).catch(() => { })
    if (resCheck === true) {
      console.debug('Cloudflare resolved!')
      return
    }
    await setTimeout(1000)
  }
}

export default turnstileSolver