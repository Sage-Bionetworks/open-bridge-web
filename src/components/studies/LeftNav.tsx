import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles, Theme } from '@material-ui/core'
import { ThemeType } from '../../style/theme'
import {SECTIONS as sectionLinks, StudySection} from './sections'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    margin: 0,
    padding: 0,
    listStyle: 'none',

    '& li': {
      padding: '10px 0',
      fontSize: 18,
    }
  },


  llink: {
    color: theme.palette.action.active,
    padding: theme.spacing(1)
  }

}))

type LeftNavOwnProps = {
  currentSection?: StudySection
  id?: string
}

type LeftNavProps = LeftNavOwnProps

const LeftNav: FunctionComponent<LeftNavProps> = ({
  id,
  currentSection = 'sessions-creator',
}) => {
  const classes = useStyles()
  
  return (
    <>
      <div>LeftNav current section {currentSection}</div>
      <ul className={classes.root}>
        {sectionLinks.map(sectionLink => (
          <li key={sectionLink.path}>
            <Link
              //className={classes.llink}
              color="primary"
              noWrap
              href={`/studies/${id}/${sectionLink.path}`}
            >
              {sectionLink.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default LeftNav
