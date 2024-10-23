// https://github.com/zfcsoftware/puppeteer-captcha-solver/blob/main/lib/cfSolver.js

import { setTimeout } from 'node:timers/promises'
import type { Page } from 'rebrowser-puppeteer-core'


const checkCaptcha = async (page: Page) => {
  const checkFC = await page.evaluate(() => {
    let global_status = false

    try {
      for (const el of document.querySelectorAll('iframe')) {
        if (el.src.includes('/cdn-cgi/challenge-platform/h/b/turnstile')) {
          global_status = true
          continue
        }
      }
    } catch {
      // Ignore
    }
    return global_status
  }).catch(() => {
    return false
  })
  return checkFC
}

const CPsolve = async (page: Page) => {
  try {
    const frames = page.frames().filter(frame => frame.url().includes('/cdn-cgi/challenge-platform/h/b/turnstile'))

    if (frames.length > 0) {
      for (const item of frames) {
        try {
          await item.click('body')

          const active_frame = item.childFrames()[0]

          if (active_frame) {
            await active_frame.hover('[type="checkbox"]').catch(() => { })
            await active_frame.click('[type="checkbox"]').catch(() => { })
          }

          await setTimeout(500)
        } catch (error) {
          console.log(error)
        }
      }
    }
  } catch {
    // Ignore
  }
}

const pageState = async (page: Page) => {
  try {
    const isPageClosed = () => !page || page.isClosed()
    return isPageClosed() !== true
  } catch {
    return false
  }
}

const cron = async (page: Page) => {
  let status = await pageState(page)
  while (status === true) {
    const cp_status = await checkCaptcha(page)
    if (cp_status === true) {
      await CPsolve(page)
    }
    await setTimeout(500)
    status = await pageState(page)
  }
  return true
}

export default cron