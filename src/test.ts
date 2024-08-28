import test from 'node:test'
import assert from 'node:assert'
import { setTimeout } from 'node:timers/promises'

import { connect } from './puppeteer-real-browser/index'

const realBrowserOption = {
  args: ['--start-maximized'],
  turnstile: true,
  headless: false,
  // disableXvfb: true,
  customConfig: {
  },
  connectOption: {
    defaultViewport: null
  }
}

test('DrissionPage Detector', async () => {
  const { page, browser } = await connect(realBrowserOption)
  await page.goto('https://drissionpage.pages.dev')
  await page.realClick('#detector')
  const result = await page.evaluate(() => {
    return document.querySelector('#isBot span').textContent.includes('not')
  })
  await browser.close()
  assert.strictEqual(result, true, 'DrissionPage Detector test failed!')
})

test('Brotector, a webdriver detector', async () => {
  const { page, browser } = await connect(realBrowserOption)
  await page.goto('https://kaliiiiiiiiii.github.io/brotector')
  await setTimeout(3000)
  const result = await page.evaluate(() => {
    return document.querySelector('#table-keys').getAttribute('bgcolor')
  })
  await browser.close()
  assert.strictEqual(result === 'darkgreen', true, 'Brotector, a webdriver detector test failed!')
})

test('Cloudflare WAF', async () => {
  const { page, browser } = await connect(realBrowserOption)
  await page.goto('https://nopecha.com/demo/cloudflare')
  let verify = null
  let startDate = Date.now()
  while (!verify && (Date.now() - startDate) < 30000) {
    verify = await page.evaluate(() => {
      return document.querySelector('.link_row') ? true : null
    }).catch(() => null)
    await setTimeout(1000)
  }
  await browser.close()
  assert.strictEqual(verify === true, true, 'Cloudflare WAF test failed!')
})

test('Cloudflare Turnstile', async () => {
  const { page, browser } = await connect(realBrowserOption)
  await page.goto('https://2captcha.com/demo/cloudflare-turnstile')
  await page.waitForSelector('[data-action="demo_action"]')
  let token = null
  let startDate = Date.now()
  while (!token && (Date.now() - startDate) < 30000) {
    token = await page.evaluate(() => {
      try {
        const item = document.querySelector('[name="cf - turnstile - response"]').value
        return item && item.length > 20 ? item : null
      } catch (e) {
        return null
      }
    })
    await setTimeout(1000)
  }
  await browser.close()
  // if (token !== null) console.log('Cloudflare Turnstile Token: ' + token)
  assert.strictEqual(token !== null, true, 'Cloudflare turnstile test failed!')
})

test('Recaptcha V3 Score (hard)', async () => {
  const { page, browser } = await connect(realBrowserOption)
  await page.goto('https://antcpt.com/score_detector')
  await page.realClick('button')
  await setTimeout(5000)
  const score = await page.evaluate(() => {
    return document.querySelector('big').textContent.replace(/[^\d.]/g, '')
  })
  await browser.close()
  // if (Number(score) >= 0.7) console.log('Recaptcha V3 Score: ' + score)
  assert.strictEqual(Number(score) >= 0.7, true, 'Recaptcha V3 Score (hard) should be >=0.7. Score Result: ' + score)
})

test('Fingerprint JS Bot Detector', async () => {
  const { page, browser } = await connect(realBrowserOption)
  await page.goto('https://fingerprint.com/products/bot-detection')
  await setTimeout(5000)
  const detect = await page.evaluate(() => {
    return document.querySelector('.HeroSection-module--botSubTitle--2711e').textContent.includes('not')
  })
  await browser.close()
  assert.strictEqual(detect, true, 'Fingerprint JS Bot Detector test failed!')
})