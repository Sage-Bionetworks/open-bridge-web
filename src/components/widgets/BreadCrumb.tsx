import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import Link from '@material-ui/core/Link'
import BackIcon from '@material-ui/icons/KeyboardBackspace'
import { StringifyOptions } from 'querystring'
import Breadcrumbs from '@material-ui/core/Breadcrumbs/Breadcrumbs'
import { Typography } from '@material-ui/core'
import { link } from 'fs'

const useStyles = makeStyles({
  root: {},
})

export interface BreadCrumbProps {
  //use the following version instead if you need access to router props
  //export interface BreadCrumbProps  extends  RouteComponentProps {
  //Enter your props here
  links: { url: string; text: string }[]
  currentItem?: string
}

const BreadCrumb: React.FunctionComponent<BreadCrumbProps> = ({
  links,
  currentItem = '',
}: BreadCrumbProps) => {
  const classes = useStyles()
  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving

  return (

      <Breadcrumbs aria-label="breadcrumb">
        {links.map((link, index) => <Link color="inherit" href={link.url} key={link.url} style={{display: 'flex'}}>
            {index === 0 &&   <BackIcon />}
            {link.text}
          </Link>
        )}

        <Typography color="textPrimary">{currentItem}</Typography>
      </Breadcrumbs>
    
  )
}

export default BreadCrumb
