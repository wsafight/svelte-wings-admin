// https://cdnjs.com
// https://unpkg.com

import loadjs from 'loadjs'

export interface JsLib {
  name: string,
  urls: string[],
  wrapper(): () => Object | null
  ready?: () => void
}

type CachedJsLibs = Record<string, JsLib>


const badUrlPrefixCache: string[] = []



const cachedJsLibs: CachedJsLibs = [].reduce((mappings: Record<string, any>, jslib: JsLib) => {
  mappings[jslib.name] = jslib
  return mappings
}, {} as CachedJsLibs)

const onJsLoadFinish = function (urls: string[], success: boolean) {
  if (success && !badUrlPrefixCache.length) {
    return
  }
  urls.forEach(x => {
    const prefix: string = x.substring(0, x.indexOf('/', 3) + 1)
    if (success) {
      const foundIndex = badUrlPrefixCache.findIndex(x => x === prefix)
      if (foundIndex > -1) {
        badUrlPrefixCache.splice(foundIndex, 1)
      }
    } else if (!badUrlPrefixCache.includes(prefix)){
      badUrlPrefixCache.push(prefix)
    }
  })
}

const resolveJsUrl = function (jslib: JsLib) {
  const okUrls: string[] = badUrlPrefixCache.length
    ? jslib.urls.filter(url => !badUrlPrefixCache.some(badUrlPrefix => url.startsWith(badUrlPrefix)))
    : jslib.urls
  if (okUrls.length) {
    return okUrls[0]
  } else {
    return jslib.urls[0]
  }
}

interface LoadAssetItem {
  url?: string;
  jslib?: JsLib;
  result?: any
}

export function loadAssetsJs(assets: string | string[]) {
  let inputIsArray = true
  if (typeof (assets) === 'string') {
    assets = [assets]
    inputIsArray = false
  }
  const notFound = assets.find(x => !cachedJsLibs[x])
  if (notFound) {
    throw new Error('Cannot found asset [' + notFound + ']')
  }
  const items: Array<LoadAssetItem> = assets.map(x => {
    const jslib: JsLib = cachedJsLibs[x]
    const item: LoadAssetItem = { result: jslib.wrapper() }
    if (!item.result) {
      item.url = resolveJsUrl(jslib)
      item.jslib = jslib
    }
    return item
  })

  // 需要加载的项
  const loadingItems = items.filter(x => !x.result)

  // 都已经加载的场合
  if (!loadingItems.length) {
    return Promise.resolve(inputIsArray ? items.map(x => x.result) : items[0].result)
  }

  return new Promise((resolve, reject) => {
    const urlsToLoad: string[] = loadingItems.map(x => x.url) as string[]
    loadjs(urlsToLoad, {
      success: function () {
        loadingItems.forEach(item => {
          if (item.jslib!.ready) {
            item.jslib!.ready.apply(item.jslib)
          }
        })
        const result = inputIsArray ? items.map(x => x.jslib!.wrapper()) : items[0].jslib!.wrapper()
        resolve(result)
        onJsLoadFinish(urlsToLoad, true)
      },
      error: function (urls) {
        onJsLoadFinish(urls, false)
        reject(new Error('loadjs Error'))
      }
    })
  })
}
