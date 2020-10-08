import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import { makeStyles, Theme } from '@material-ui/core'
import { ThemeType } from '../../style/theme'
import { PaletteColor } from '@material-ui/core/styles/createPalette'

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
export type StudySection = 'scheduler' | 'sessions-creator'
type LeftNavProps = LeftNavOwnProps

const LeftNav: FunctionComponent<LeftNavProps> = ({
  id,
  currentSection = 'sessions-creator',
}) => {
  const classes = useStyles()
  const sections = [
    { name: '01. Study Description', path: 'description' },

    { name: '02. Team Settings', path: 'team-settings' },
    { name: '03. Sessions Creator', path: 'sessions-creator' },
    { name: '04. Scheduler', path: 'scheduler' },
    { name: '05. Timeline Viewer', path: 'timeline-viewer' },
    { name: '06. Passive Features', path: 'passive-features' },
    { name: '07. Branding Element ', path: 'branding' },
    { name: '08. Preview App', path: 'preview' },
    { name: '09. Payment ', path: 'payments' },
    { name: '10. IRB Approval', path: 'irb' },
    { name: '11. Alerts', path: 'alerts' },
    { name: '12. Launch Study', path: 'launch' },
  ]
  return (
    <>
      <div>LeftNav current section {currentSection}</div>
      <ul className={classes.root}>
        {sections.map(section => (
          <li>
            <Link
              //className={classes.llink}
              color="primary"
              noWrap
              href={`/studies/${id}/${section.path}`}
            >
              {section.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default LeftNav
