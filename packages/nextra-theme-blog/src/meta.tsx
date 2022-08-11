import React, { ReactElement } from 'react'
import Link from 'next/link'
import ThemeSwitch from './theme-switch'
import { split } from './utils/get-tags'
import { useBlogContext } from './blog-context'
import { getParent } from './utils/parent'

export default function Meta(): ReactElement {
  const { opts, config } = useBlogContext()
  const { author, date, tag } = opts.meta
  const { back } = getParent({ opts, config })
  const tags = tag ? split(tag) : []

  const tagsEl = tags.map(t => (
    <Link key={t} href="/tags/[tag]" as={`/tags/${t}`}>
      <a
        className="
          select-none
          rounded-md
          bg-gray-200
          px-1
          text-sm
          !text-gray-400
          !no-underline
          hover:!text-gray-800
          active:bg-gray-400
          dark:bg-gray-400
          dark:!text-gray-100
          dark:hover:!text-gray-800
        "
      >
        {t}
      </a>
    </Link>
  ))

  const readingTime = opts.readingTime?.text

  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="grow text-gray-400">
        <div className="flex flex-wrap items-center gap-1">
          {author}
          {author && date && ','}
          {date && (
            <time dateTime={new Date(date).toISOString()}>
              {new Date(date).toDateString()}
            </time>
          )}
          {(author || date) && tags.length > 0 && '  •  '}
          {readingTime || tagsEl}
        </div>
        {readingTime && (
          <div className="flex flex-wrap items-center gap-1 mt-1">{tagsEl}</div>
        )}
      </div>
      {back && (
        <Link href={back} passHref>
          <a>Back</a>
        </Link>
      )}
      {config.darkMode && <ThemeSwitch />}
    </div>
  )
}
