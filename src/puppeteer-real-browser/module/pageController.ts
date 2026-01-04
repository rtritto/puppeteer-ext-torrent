// https://github.com/ZFC-Digital/puppeteer-real-browser/blob/main/lib/esm/module/pageController.mjs

import { createCursor } from 'ghost-cursor'
// import { setTimeout } from 'node:timers/promises'
import kill from 'tree-kill'

// import { checkTurnstile } from './turnstile'

export async function pageController({
  browser,
  page,
  proxy,
  // turnstile,
  // xvfbsession,
  pid,
  plugins,
  killProcess = false,
  chrome
}: PageControllerOptions) {
  // let solveStatus = turnstile

  // page.on('close', () => {
  //   solveStatus = false
  // })


  browser.on('disconnected', async () => {
    // solveStatus = false
    if (killProcess === true) {
      // if (xvfbsession) try { xvfbsession.stopSync() } catch (err) { }
      if (chrome) try { chrome.kill() } catch (error) { console.log(error) }
      if (pid) try { kill(pid, 'SIGKILL', () => { }) } catch { }
    }
  })

  // async function turnstileSolver() {
  //   while (solveStatus) {
  //     await checkTurnstile({ page }).catch(() => { })
  //     await setTimeout(1000)
  //   }
  //   return
  // }

  // turnstileSolver()

  if (proxy.username && proxy.password) {
    await page.authenticate({ username: proxy.username, password: proxy.password })
  }

  if (plugins.length > 0) {
    for (const plugin of plugins) {
      plugin.onPageCreated(page)
    }
  }

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(MouseEvent.prototype, 'screenX', {
      get: function () {
        return this.clientX + window.screenX
      }
    })

    Object.defineProperty(MouseEvent.prototype, 'screenY', {
      get: function () {
        return this.clientY + window.screenY
      }
    })
  })

  const cursor = createCursor(page)
  page.realCursor = cursor
  page.realClick = cursor.click

  return page
}
