export const checkTurnstile = ({ page }: { page: Page }): Promise<boolean> => {
  return new Promise(async (resolve, _reject) => {
    const waitInterval = global.setTimeout(() => {
      clearInterval(waitInterval)
      resolve(false)
    }, 5000)

    try {
      const elements = await page.$$('[name="cf-turnstile-response"]')

      if (elements.length === 0) {
        const coordinates = await page.evaluate(() => {
          const _coordinates = [] as { x: number, y: number, height: number }[]

          document.querySelectorAll('div').forEach((item) => {
            try {
              const itemCoordinates = item.getBoundingClientRect()
              const itemCss = window.getComputedStyle(item)
              if (
                itemCss.margin == '0px'
                && itemCss.padding == '0px'
                && itemCoordinates.width > 290
                && itemCoordinates.width <= 310
                && !item.querySelector('*')
              ) {
                _coordinates.push({
                  x: itemCoordinates.x,
                  y: item.getBoundingClientRect().y,
                  // width: item.getBoundingClientRect().width,
                  height: item.getBoundingClientRect().height
                })
              }
            } catch (err) { }
          })

          if (coordinates.length === 0) {
            document.querySelectorAll('div').forEach(item => {
              try {
                const itemCoordinates = item.getBoundingClientRect()
                if (itemCoordinates.width > 290 && itemCoordinates.width <= 310 && !item.querySelector('*')) {
                  _coordinates.push({
                    x: itemCoordinates.x,
                    y: item.getBoundingClientRect().y,
                    // width: item.getBoundingClientRect().width,
                    height: item.getBoundingClientRect().height
                  })
                }
              } catch (err) { }
            })
          }

          return _coordinates
        })

        for (const item of coordinates) {
          try {
            const x = item.x + 30
            const y = item.y + item.height / 2
            await page.mouse.click(x, y)
          } catch (err) { }
        }

        return resolve(true)
      }

      for (const element of elements) {
        try {
          const parentElement = await element.evaluateHandle((el) => el.parentElement)
          const box = await parentElement.boundingBox()
          const x = box.x + 30
          const y = box.y + box.height / 2
          await page.mouse.click(x, y)
        } catch (err) { }
      }
      clearInterval(waitInterval)
      resolve(true)
    } catch (err) {
      clearInterval(waitInterval)
      resolve(false)
    }
  })
}