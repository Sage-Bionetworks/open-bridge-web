import { Typography, makeStyles } from '@material-ui/core'
import Breadcrumbs from '@material-ui/core/Breadcrumbs/Breadcrumbs'
import Link from '@material-ui/core/Link'
import BackIcon from '@material-ui/icons/KeyboardBackspace'
import React from 'react'
import clsx from 'clsx'

export interface BreadCrumbProps {
  links: { url: string; text: string }[]
  currentItem?: string
}

const useStyles = makeStyles(theme => ({
  text: {
    fontFamily: 'poppins',
    fontSize: '12px',
    lineHeight: '20px',
  },
  addMargin: {
    marginLeft: '10px',
  },
  backIcon: {
    width: '18px',
  },
  link: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

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
          className={classes.link}
        >
          {index === 0 && <BackIcon className={classes.backIcon} />}
          <div className={clsx(classes.text, classes.addMargin)}>
            {link.text}
          </div>
        </Link>
      ))}

      <Typography className={classes.text} color="textPrimary">
        {currentItem}
      </Typography>
    </Breadcrumbs>
  )
}

export default BreadCrumb
