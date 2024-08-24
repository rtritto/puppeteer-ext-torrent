import { launch, Launcher } from 'chrome-launcher'
import puppeteer from 'puppeteer-core'

// import { pageController } from './module/pageController.mjs'

process.env.REBROWSER_PATCHES_RUNTIME_FIX_MODE = 'alwaysIsolated'
// process.env.REBROWSER_PATCHES_DEBUG = 1

type Options = {
  args?: string[]
  headless?: 'auto' | boolean
  customConfig?: import('chrome-launcher').Options
  proxy?: {
    host?: string
    port?: number
    // username?: string
    // password?: string
  }
  // skipTarget?: string[]
  // fingerprint?: boolean
  // turnstile?: boolean
  connectOption?: import('puppeteer-core').ConnectOptions
  // disableXvfb?: boolean
  // fpconfig?: Record<string, any>
  // executablePath?: string
  // extensionPath?: boolean
}

/**
 * Disabled features:
 *   - Linux
 *   - pageController
 */
export const connect = async (options: Options = {}) => {
  const {
    args = [],
    headless = false,
    customConfig = {},
    proxy = {},
    // turnstile = false,
    connectOption = {}
    // disableXvfb = false
  } = options
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

  const browser = await puppeteer.connect({
    browserURL: `http://127.0.0.1:${chrome.port}`,
    ...connectOption
  })

  let [page] = await browser.pages()

  // let pageControllerConfig = { browser, page, proxy, turnstile, xvfbsession, pid: chrome.pid }

  // page = await pageController(pageControllerConfig)

  // browser.on('targetcreated', async target => {
  //   if (target.type() === 'page') {
  //     let newPage = await target.page()
  //     pageControllerConfig.page = newPage
  //     newPage = await pageController(pageControllerConfig)
  //   }
  // })

  return {
    browser,
    page
  }
}