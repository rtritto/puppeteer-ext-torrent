type Proxy = {
  host?: string
  port?: number
  username?: string
  password?: string
}

type Page = import('rebrowser-puppeteer-core').Page & {
  realCursor: import('ghost-cursor').GhostCursor
  realClick: import('ghost-cursor').GhostCursor['click']
}

type Options = {
  args?: string[]
  headless?: 'auto' | boolean
  customConfig?: import('chrome-launcher').Options
  proxy?: Proxy
  // skipTarget?: string[]
  // fingerprint?: boolean
  turnstile?: boolean
  connectOption?: import('rebrowser-puppeteer-core').ConnectOptions
  disableXvfb?: boolean
  // fpconfig?: Record<string, any>
  // executablePath?: string
  // extensionPath?: boolean
  enableExtensions?: boolean
  enableStealth?: boolean
  ignoreAllFlags?: boolean
  plugins?: PuppeteerExtraPlugin[]
}

type PageControllerOptions = {
  browser: import('rebrowser-puppeteer-core').Browser
  page: Page
  proxy: Proxy
  // turnstile: boolean
  // xvfbsession?: {
  //   stopSync(): void
  // }
  pid: number
  plugins: PuppeteerExtraPlugin[]
  killProcess: boolean
  chrome: import('chrome-launcher').LaunchedChrome
}