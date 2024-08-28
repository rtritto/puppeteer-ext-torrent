type Proxy = {
  host?: string
  port?: number
  username?: string
  password?: string
}

type Page = import('puppeteer-core-patch').Page & {
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
  connectOption?: import('puppeteer-core-patch').ConnectOptions
  disableXvfb?: boolean
  // fpconfig?: Record<string, any>
  // executablePath?: string
  // extensionPath?: boolean
  enableExtensions?: boolean
  enableStealth?: boolean
  plugins?: PuppeteerExtraPlugin[]
}

type PageControllerOptions = {
  browser: import('puppeteer-core-patch').Browser
  page: Page
  proxy: Proxy
  // turnstile: boolean
  // xvfbsession?: {
  //   stopSync(): void
  // }
  pid: number
  plugins: PuppeteerExtraPlugin[]
}