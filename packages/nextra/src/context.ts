import { META_FILENAME } from './constants'
import { normalizeMeta } from './utils'
import { MetaJsonFile, PageMapItem, Page } from './types'

function getContext(name: string): {
  pageMap: PageMapItem[]
  route: string
} {
  const context = globalThis.__nextra_internal__
  if (!context) {
    throw new Error(
      `Nextra context not found. Please make sure you are using "${name}" of "nextra/context" on a Nextra page.`
    )
  }
  return context
}

function filter(
  pageMap: PageMapItem[],
  activeLevel?: string
): {
  items: Page[]
  activeLevelPages: Page[]
} {
  let activeLevelPages: Page[] = []
  const items: Page[] = []
  const meta =
    pageMap.find((item): item is MetaJsonFile => item.name === META_FILENAME)
      ?.meta || {}

  for (const item of pageMap) {
    if (item.name === META_FILENAME) continue
    const page = {
      ...item,
      meta: normalizeMeta(meta[item.name])
    } as Page

    if ('children' in page && page.children) {
      const filtered = filter(page.children, activeLevel)
      page.children = filtered.items
      if (filtered.activeLevelPages.length) {
        activeLevelPages = filtered.activeLevelPages
      } else if (page.route === activeLevel) {
        if (!activeLevelPages.length) {
          activeLevelPages = page.children
        }
      }
    }
    items.push(page)
  }

  const metaKeys = Object.keys(meta)
  items.sort((a, b) => {
    const indexA = metaKeys.indexOf(a.name)
    const indexB = metaKeys.indexOf(b.name)
    if (indexA === -1 && indexB === -1) return a.name < b.name ? -1 : 1
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return { items, activeLevelPages }
}

export function getAllPages(): Page[] {
  const { pageMap } = getContext('getAllPages')
  return filter(pageMap).items
}

export function getCurrentLevelPages(): Page[] {
  const { pageMap, route } = getContext('getCurrentLevelPages')
  return filter(pageMap, route).activeLevelPages
}

export function getPagesUnderRoute(route: string): Page[] {
  const { pageMap } = getContext('getPagesUnderRoute')
  return filter(pageMap, route).activeLevelPages
}
