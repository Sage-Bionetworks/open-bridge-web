import {UserSessionData} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {NavLink} from 'react-router-dom'

type MenuLinksProps = {
  routes: {name: string; path: string; isRhs?: boolean}[]
  className: string
  disabledClassName?: string
  activeClassName: string
  isRightHandSide?: boolean
  sessionData?: UserSessionData
}

export const MenuLinks: FunctionComponent<MenuLinksProps> = ({
  routes,
  className,
  activeClassName,
}) => {
  let links = routes.map(route => (
    <NavLink
      to={route.path}
      key={route.name}
      className={className}
      activeClassName={activeClassName}>
      {route.name}
    </NavLink>
  ))

  return <>{links}</>
}

export const MenuLinksRhs: FunctionComponent<MenuLinksProps> = ({
  routes,
  sessionData,
  className,
  disabledClassName,
  activeClassName,
  children,
  isRightHandSide,
}) => {
  function getClassName(routeName: String, isRightHandSide: boolean) {
    if (!isRightHandSide) return className
    if (routeName === 'CREATE ACCOUNT') {
      return clsx(
        className
        //  classes.drawerAuthOptions,
        // classes.createAccountLink
      )
    }
    if (routeName === 'Edit Profile' || routeName === 'Settings') {
      return clsx(className, disabledClassName)
    }
    return className
  }

  let links: React.ReactNode[] = routes.map(route => {
    if (route.name === 'Edit Profile' || route.name === 'Settings') {
      return (
        <div
          key={`rhs_${route.name}`}
          className={getClassName(route.name, isRightHandSide || false)}>
          {route.name}
        </div>
      )
    } else {
      return (
        <NavLink
          to={route.path}
          key={`rhs_${route.name}`}
          className={getClassName(route.name, isRightHandSide || false)}
          activeClassName={activeClassName}>
          {route.name}
        </NavLink>
      )
    }
  })
  if (Array.isArray(children)) {
    if (sessionData?.token) {
      links.push(children[0])
    } else {
      links.push(children[1])
    }
  }

  return <>{links}</>
}
