import { setTimeout } from 'node:timers/promises'
import type { Page } from 'rebrowser-puppeteer-core'

export const getFrame = async (page: Page, regex: RegExp) => {
  while (true) {
    const frame = page.frames().find((f) => regex.test(f.url()))
    if (frame) {
      return frame
    }
    await setTimeout(1000)
  }
}