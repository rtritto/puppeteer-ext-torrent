import { createCursor } from 'ghost-cursor'
import kill from 'tree-kill'

import { checkTurnstile } from './turnstile'

const getRandomInt = (min: number, max: number) => {
  const _min = Math.ceil(min)
  const _max = Math.floor(max)
  return Math.floor(Math.random() * (_max - _min + 1)) + _min
}

export async function pageController({
  browser,
  page,
  proxy,
  turnstile,
  xvfbsession,
  pid,
  plugins
}: PageControllerOptions) {
  if (plugins.length > 0) {
    for (const plugin of plugins) {
      plugin.onPageCreated(page)
    }
  }

  let solveStatus = turnstile

  page.on('close', () => {
    solveStatus = false
  })


  browser.on('disconnected', async () => {
    solveStatus = false
    if (xvfbsession) try { xvfbsession.stopSync() } catch (err) { }
    if (pid) try { kill(pid, 'SIGKILL') } catch (err) { }
  })

  async function turnstileSolver() {
    while (solveStatus) {
      await checkTurnstile({ page }).catch(() => { })
      await new Promise(r => setTimeout(r, 1000))
    }
    return
  }

  turnstileSolver()

  if (proxy.username && proxy.password) {
    await page.authenticate({ username: proxy.username, password: proxy.password })
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
  await cursor.moveTo({ x: getRandomInt(0, 800), y: getRandomInt(0, 600) })
  page.realCursor = cursor
  page.realClick = cursor.click

  return page
}