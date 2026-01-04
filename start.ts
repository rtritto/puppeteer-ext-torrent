import { parse } from 'node-html-parser'
import { request } from 'undici'
import { setTimeout } from 'node:timers/promises'

import { connect } from './src/puppeteer-real-browser/index'
import { turnstileSolver } from './src/puppeteer-solver/index'
// import { downloadExtensions, extractZipExtensions } from '@/puppeteerUtils/extensions.ts'

const getUrlExt = (filter: string, page: number) => `https://ext.to/search/${filter}/${page}/?order=age&sort=desc`
// const getUrlExt = (filter: string, page: number) => `https://ext.to/search/${filter}/${page}/?order=seed&sort=desc&c=movies`
const URL_EXT_RESET = 'https://ext.to/ajax/torrentUpdatePeers.php'
const MAX_CONCURRENT_REQUESTS = 5

// await downloadExtensions()
// await extractZipExtensions()

const { browser, page } = await connect()

const filter = ''

let len = 1

const urls = []

for (let i = 0; i < len; i++) {
  const pageNumber = i + 1
  const urlExt = getUrlExt(filter, pageNumber)
  // Workaround to ERR_CONNECTION_REFUSED
  await setTimeout(5000)
  await page.goto(urlExt, { waitUntil: 'domcontentloaded' })
  if (pageNumber === 1) {
    console.log(`urlExt: ${urlExt}`)
    await turnstileSolver(page)
  }
  await page.waitForSelector('tbody')
  const html = await page.content()
  const root = parse(html)

  //#region set len
  if (pageNumber === 1) {
    const paginationBlock = root.querySelector('.pagination-block')!
    const pageLink = paginationBlock.querySelectorAll('a.page-link')!
    len = Number.parseInt(pageLink.at(-2)!.rawText as string)
  }
  console.log(`current pageNumber: ${pageNumber}/${len}`)
  //#endregion

  const tbody = root.querySelector('tbody')!
  const tds = tbody.querySelectorAll('td.text-left')!
  // const hrefs = tds.map((e) => e.querySelector('a')!.getAttribute('href'))  // get only first <a>

  // eslint-disable-next-line unicorn/prefer-dom-node-dataset
  const dataIds = tds.map((e) => e!
    .querySelector('div.btn-blocks.float-right')!
    .querySelector('a.dwn-btn.torrent-dwn')!
    .getAttribute('data-id')!
  )

  urls.push(...dataIds)
}

await browser.close()

for (let i = 0, len = urls.length; i < len; i += MAX_CONCURRENT_REQUESTS) {
  const chunk = urls.slice(i, i + MAX_CONCURRENT_REQUESTS)
  await Promise.all(chunk.map((dataId) => request(URL_EXT_RESET, {
    method: 'POST',
    body: `id=${dataId}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'x-requested-with': 'XMLHttpRequest'
    }
  }).then(async (r) => console.log(await r.body.json()))))
}

console.log('END!')
