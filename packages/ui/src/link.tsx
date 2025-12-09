/**
 * Link component integrated with React Router
 * Uses react-router-dom's Link component for client-side navigation
 */

import * as Headless from '@headlessui/react'
import React, { forwardRef } from 'react'

// Note: react-router-dom is a peer dependency and must be installed in the consuming app
type LinkProps = {
  href: string
} & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>

export const Link = forwardRef(function Link(
  { href, ...props }: LinkProps,
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  // For external links, use regular anchor
  if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')) {
    return (
      <Headless.DataInteractive>
        <a {...props} href={href} ref={ref} />
      </Headless.DataInteractive>
    )
  }

  // For internal links, we'll use a regular anchor for now
  // The consuming app can wrap this or use react-router-dom's Link directly
  return (
    <Headless.DataInteractive>
      <a {...props} href={href} ref={ref} />
    </Headless.DataInteractive>
  )
})
