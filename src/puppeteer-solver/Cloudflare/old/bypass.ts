// https://github.com/zfcsoftware/youtube_lessons_resources/blob/main/puppeteer_cloudflare_bypass/index.js

import { setTimeout } from 'node:timers/promises'
import type { Page } from 'rebrowser-puppeteer-core'

export const checkStat = async (page: Page) => {
  const st = global.setTimeout(() => {
    return {
      code: 1
    }
  }, 3000)
  try {
    const checkStat = await page.evaluate(() => {
      const htmlRaw = document.querySelector('html')
      if (htmlRaw) {
        const html = String(htmlRaw.innerHTML).toLowerCase()
        if (html.indexOf('challenges.cloudflare.com/turnstile') > -1) {
          return 1
        }
      } else {
        return 2
      }
      return 0
    })
    if (checkStat !== 0) {
      try {
        // https://github.com/berstend/puppeteer-extra/issues/817#issuecomment-1757744835
        // await setTimeout(5000)
        await setTimeout(3000)

        // Click on the blank content of the page
        await page.click('body')
        await setTimeout(500)

        // Simulate pressing the Tab key several times until the focus reaches the checkbox
        await page.keyboard.press('Tab')
        // await page.keyboard.press('Tab')
        await setTimeout(500)

        // Simulates pressing the Space key to select a checkbox
        await page.keyboard.press('Space')

        // Wait a while and adjust as needed
        // await setTimeout(15000)
        // await setTimeout(10000)

        // let frame = page.frames()[0]
        // frame = frame.childFrames()[0]
        // if (frame) {
        //   await frame.hover('[type="checkbox"]').catch(err => { })
        //   await frame.click('[type="checkbox"]').catch(err => { })
        // }
      } catch (err) {
        // console.log('err: ', err)
      }
    }
    clearInterval(st)
    return {
      code: checkStat
    }
  } catch (err) {
    clearInterval(st)
    return {
      code: 1
    }
  }
}


// const send = ({ url = '', proxy = {} }) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       var { puppeteerRealBrowser } = await import('puppeteer-real-browser')
//       var data = {}
//       if (proxy && proxy.host && proxy.host.length > 0) {
//         data.proxy = proxy
//       }
//       puppeteerRealBrowser = await puppeteerRealBrowser(data)
//       var browser = puppeteerRealBrowser.browser
//       var page = puppeteerRealBrowser.page
//       try {
//         await page.goto(url, { waitUntil: 'domcontentloaded' })

//         var stat = await checkStat({
//           page: page
//         })

//         while (stat.code !== 0) {
//           await setTimeout(500)
//           stat = await checkStat({
//             page: page
//           })
//         }
//         resolve({
//           code: 200,
//           message: 'OK',
//           data: {
//             browser: browser,
//             page: page
//           }
//         })

//       } catch (err) {
//         await browser.close()
//         resolve({
//           code: 501,
//           message: err.message
//         })
//       }

//     } catch (error) {
//       resolve({
//         code: 500,
//         message: error.message
//       })
//     }

//   })
// }



// send({
//   url: '<url>',
//   // proxy: {
//   //     host: '<host>',
//   //     port: '<port>',
//   //     username: '<username>',
//   //     password: '<password>',
//   // }
// })
//   .then(resp => {
//     console.log(resp)
//   })