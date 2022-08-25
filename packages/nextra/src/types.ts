import { NextConfig } from 'next'
import { Heading as MDASTHeading } from 'mdast'
import { ProcessorOptions } from '@mdx-js/mdx'
import { Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import { GrayMatterFile } from 'gray-matter'
import { PageMapCache } from './plugin'
import { MARKDOWN_EXTENSIONS, META_FILENAME } from './constants'

type MetaFilename = typeof META_FILENAME
type MarkdownExtension = typeof MARKDOWN_EXTENSIONS[number]

export interface LoaderOptions extends NextraConfig {
  pageImport?: boolean
  locales: string[]
  defaultLocale: string
  pageMapCache: PageMapCache
  newNextLinkBehavior?: boolean
}

export interface Folder<FileType = PageMapItem> {
  name: string
  route: string
  children: FileType[]
}

export type MetaJsonFile = {
  name: MetaFilename
  locale?: string
  meta: {
    [fileName: string]: Meta
  }
}

export type FrontMatter = GrayMatterFile<string>['data']
export type Meta = string | Record<string, any>

export type MdxFile = {
  name: string
  route: string
  locale?: string
  frontMatter?: FrontMatter
}

export type MetaJsonPath = `${string}/${MetaFilename}`
export type MdxPath = `${string}.${MarkdownExtension}`

export type FileMap = {
  [jsonPath: MetaJsonPath]: MetaJsonFile
  [mdxPath: MdxPath]: MdxFile
}

export type PageMapItem = Folder | MdxFile | MetaJsonFile

// PageMapItem without MetaJsonFile and with its meta from _meta.json
export type Page = (MdxFile | Folder<Page>) & {
  meta: Exclude<Meta, string>
}

export type Heading = MDASTHeading & {
  value: string
}

export type PageOpts = {
  filePath: string
  route: string
  frontMatter: FrontMatter
  pageMap: PageMapItem[]
  title: string
  headings: Heading[]
  hasJsxInH1?: boolean
  timestamp?: number
  unstable_flexsearch?: Flexsearch
  newNextLinkBehavior?: boolean
}

type Theme = string
type Flexsearch = boolean | { codeblocks: boolean }

export type NextraConfig = {
  theme: Theme
  themeConfig?: string
  unstable_defaultShowCopyCode?: boolean
  unstable_flexsearch?: Flexsearch
  unstable_staticImage?: boolean
  mdxOptions?: Pick<ProcessorOptions, 'rehypePlugins' | 'remarkPlugins'> & {
    rehypePrettyCodeOptions?: Partial<RehypePrettyCodeOptions>
  }
}

export type Nextra = (
  ...args: [NextraConfig] | [theme: Theme, themeConfig: string]
) => (nextConfig: NextConfig) => NextConfig

const nextra: Nextra = () => () => ({})

export default nextra
