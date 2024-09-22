import type { Page } from 'rebrowser-puppeteer-core'
// import pcr from 'puppeteer-captcha-solver'
// import { setTimeout } from 'node:timers/promises'

import { checkStat } from './bypass'
// import { getFrame } from './utils'
// import cfSolver from './captcha-solver'

const resolveCF = async (page: Page) => {
  // await cfSolver(page)
  // console.debug('Cloudflare resolved!')

  // while ((await page.title()).endsWith('EXT Torrents') === false) {
  //   console.debug('Try to resolve Cloudflare...')
  //   await checkStat(page)
  //   await page.content()
  //   await setTimeout(2000)
  // }
  // console.debug('Cloudflare resolved!')

  console.debug('Try to resolve Cloudflare...')
  while (true) {
    const resCheck = await checkStat(page)
    if (resCheck.code === 1) {
      // await page.content()  // ??? leave here and/or move after if
      console.debug('Cloudflare resolved!')
      return
    }

    // if ((await page.title()).endsWith('EXT Torrents') === true) {
    //   console.debug('Cloudflare resolved!')
    //   return
    // }
    // await setTimeout(2000)
  }

  // await pcr.autoSolve({
  //   page,
  //   config: {
  //     turnstile: true
  //   }
  // })
  // console.debug('Cloudflare resolved!')
}

export default resolveCF