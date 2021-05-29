import { Box, Button, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ReactComponent as Alert_Icon } from '../../../assets/alert_icon.svg'
import { latoFont, ThemeType } from '../../../style/theme'
import { Study } from '../../../types/types'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import { normalNavIcons, SECTIONS, StudySection } from '../sections'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
  sectionHeader: {
    fontFamily: latoFont,
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: '18px',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    paddingLeft: '30px',
  },
  navIcon: {
    position: 'absolute',
    top: '-15px',
    left: '-19px',
  },
  errorDescription: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '14px',
    fontFamily: latoFont,
    marginTop: theme.spacing(2),

    '& .MuiButton-root': {
      fontSize: '14px',
    },
  },
  alertIcon: {
    width: '20px',
    marginLeft: theme.spacing(-4.5),
    marginRight: theme.spacing(2),
  },
  reviewIgnoreButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: theme.spacing(2),
    width: '146px',
  },
  mustReviewButton: {
    flexShrink: 0,
    backgroundColor: '#EE6070',
    color: 'black',
    marginLeft: theme.spacing(2),
    borderRadius: '0',
    width: '146px',
    height: '38px',

    '&:hover': {
      backgroundColor: '#EE6070',
      fontWeight: 'bold',
    },
  },
}))

type StudyAlert = {
  errorText: string
  isDismissable: boolean
}
type StudyAlertSection = {
  section: StudySection
  errors: StudyAlert[]
}
export interface LaunchAlertsProps {
  study: Study
}

const StudyAlertComponent: React.FunctionComponent<StudyAlertSection> = ({
  section,
  errors,
}: StudyAlertSection) => {
  const classes = useStyles()

  const sectionIndex = SECTIONS.findIndex(s => s.path === section)

  return (
    <Box borderTop="1px solid black" py={4} textAlign="left">
      <div className={classes.sectionHeader}>
        <img
          src={normalNavIcons[sectionIndex]}
          className={classes.navIcon}
          alt={SECTIONS[sectionIndex].name}
        />
        <span>{SECTIONS[sectionIndex].name}</span>
      </div>
      {errors.map(error => (
        <>
          <div className={classes.errorDescription}>
            {!error.isDismissable && (
              <Alert_Icon className={classes.alertIcon} />
            )}
            <>
              {error.errorText}
              {error.isDismissable && (
                <Box className={classes.reviewIgnoreButtons}>
                  <Button href={SECTIONS[sectionIndex].path}>Review</Button>
                  <Button href={SECTIONS[sectionIndex].path}>Ignore</Button>
                </Box>
              )}
              {!error.isDismissable && (
                <Button
                  variant="contained"
                  className={classes.mustReviewButton}
                  href={SECTIONS[sectionIndex].path}
                >
                  Review Required
                </Button>
              )}
            </>
          </div>
        </>
      ))}
    </Box>
  )
}

const LaunchAlerts: React.FunctionComponent<LaunchAlertsProps> = ({
  study,
}: LaunchAlertsProps) => {
  const classes = useStyles()
  const alerts: StudyAlertSection[] = [
    {
      section: 'scheduler',
      errors: [
        {
          errorText: 'Custom notification text is missing',
          isDismissable: true,
        },
        {
          errorText:
            'Session Window definition is missing on one/more of the Sessions',
          isDismissable: false,
        },
      ],
    },
    {
      section: 'enrollment-type-selector',
      errors: [
        {
          errorText: 'Please define how you want to enroll participants',
          isDismissable: true,
        },
      ],
    },
  ]

  return (
    <Container maxWidth="sm">
      <MTBHeadingH1>{study.name}</MTBHeadingH1>
      <MTBHeadingH2>Please review the following alerts: </MTBHeadingH2>
      <h3>LaunchAlerts </h3>

      {alerts.map(alert => (
        <StudyAlertComponent {...alert}></StudyAlertComponent>
      ))}
    </Container>
  )
}

export default LaunchAlerts
