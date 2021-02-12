import { Typography } from '@material-ui/core'
import Breadcrumbs from '@material-ui/core/Breadcrumbs/Breadcrumbs'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/core/styles'
import BackIcon from '@material-ui/icons/KeyboardBackspace'
import React from 'react'

const useStyles = makeStyles({
  root: {},
})

export interface BreadCrumbProps {
  links: { url: string; text: string }[]
  currentItem?: string
}

const BreadCrumb: React.FunctionComponent<BreadCrumbProps> = ({
  links,
  currentItem = '',
}: BreadCrumbProps) => {
  const classes = useStyles()
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, index) => (
        <Link
          color="inherit"
          href={link.url}
          key={link.url}
          style={{ display: 'flex' }}
        >
          {index === 0 && <BackIcon />}
          {link.text}
        </Link>
      ))}

      <Typography color="textPrimary">{currentItem}</Typography>
    </Breadcrumbs>
  )
}

export default BreadCrumb
