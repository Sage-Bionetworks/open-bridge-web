import BackIcon from '@mui/icons-material/ArrowBack'
import {Breadcrumbs, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import {NavLink} from 'react-router-dom'

export interface BreadCrumbProps {
  links: {url: string; text: string}[]
  currentItem?: string
}

const useStyles = makeStyles(theme => ({
  text: {
    fontFamily: 'poppins',
    fontSize: '12px',
    lineHeight: '20px',
  },
  addMargin: {
    marginLeft: theme.spacing(1.25),
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
    <Breadcrumbs aria-label="breadcrumb" separator={currentItem ? '/' : ''}>
      {links.map((link, index) => (
        <NavLink to={link.url} key={link.url} className={classes.link}>
          {index === 0 && <BackIcon className={classes.backIcon} />}
          <div className={clsx(classes.text, classes.addMargin)}>
            {link.text}
          </div>
        </NavLink>
      ))}

      <Typography className={classes.text} color="textPrimary">
        {currentItem}
      </Typography>
    </Breadcrumbs>
  )
}

export default BreadCrumb
