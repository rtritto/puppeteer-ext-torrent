import { launch, Launcher } from 'chrome-launcher'
import puppeteer, { type Browser } from 'puppeteer-core-patch'
// import { addExtra } from 'puppeteer-extra'
// import createPuppeteerStealth from 'puppeteer-extra-plugin-stealth'

// import { pageController } from './module/pageController'

process.env.REBROWSER_PATCHES_RUNTIME_FIX_MODE = 'alwaysIsolated'
// process.env.REBROWSER_PATCHES_DEBUG = 1

/**
 * Disabled features:
 *   - Linux
 *   - pageController
 */
export const connect = async ({
  args = [],
  headless = false,
  customConfig = {},
  proxy = {},
  // turnstile = false,
  connectOption = {},
  enableExtensions = false,
  // disableXvfb = false,
  // plugins = []
}: Options = {}) => {
  // let xvfbsession = null
  // if (headless == 'auto') {
  //   headless = false
  // }

  // if (process.platform === 'linux' && disableXvfb === false) {
  //   try {
  //     const { default: Xvfb } = await import('xvfb')
  //     xvfbsession = new Xvfb({
  //       silent: true,
  //       xvfb_args: ['-screen', '0', '1920x1080x24', '-ac']
  //     })
  //     xvfbsession.startSync()
  //   } catch (err) {
  //     console.log('You are running on a Linux platform but do not have xvfb installed. The browser can be captured. Please install it with the following command\n\nsudo apt-get install xvfb\n\n' + err.message)
  //   }
  // }

  const flags = Launcher.defaultFlags()

  if (enableExtensions === true) {
    // Remove "disable-extensions" flag
    const indexDisableExtension = flags.indexOf('--disable-extensions')
    flags.splice(indexDisableExtension, 1)
  }

  // Add AutomationControlled to "disable-features" flag
  const indexDisableFeatures = flags.findIndex((flag) => flag.startsWith('--disable-features'))
  flags[indexDisableFeatures] = `${flags[indexDisableFeatures]},AutomationControlled`

  const chrome = await launch({
    chromeFlags: [
      ...flags,
      ...args,
      ...((headless !== false) ? [`--headless=${headless}`] : []),
      ...((proxy.host && proxy.port) ? [`--proxy-server=${proxy.host}:${proxy.port}`] : []),
      '--no-sandbox'
    ],
    ...customConfig
  })

  // const puppeteer = addExtra(_puppeteer)

  // Add Stealth
  // const puppeteerStealth = createPuppeteerStealth()
  // // https://github.com/berstend/puppeteer-extra/issues/817
  // puppeteerStealth.enabledEvasions.delete('user-agent-override')
  // puppeteer.use(puppeteerStealth)

  // if (plugins.length > 0) {
  //   for (const item of plugins) {
  //     puppeteer.use(item)
  //   }
  // }

  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
    ...connectOption
  }) as Browser

  let [page] = await browser.pages() as Page[]

  // const pageControllerConfig = { browser, page, proxy, turnstile, xvfbsession, pid: chrome.pid, plugins }

  // page = await pageController(pageControllerConfig)

  // browser.on('targetcreated', async target => {
  //   if (target.type() === 'page') {
  //     let newPage = await target.page() as Page
  //     pageControllerConfig.page = newPage
  //     newPage = await pageController(pageControllerConfig)
  //   }
  // })

  return {
    browser,
    page
  }
}