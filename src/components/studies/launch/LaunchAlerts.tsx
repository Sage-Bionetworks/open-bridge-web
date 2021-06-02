import { Box, Button, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import React from 'react'
import { ReactComponent as Alert_Icon } from '../../../assets/alert_icon.svg'
import { ReactComponent as Preview_Icon } from '../../../assets/launch/preview_icon.svg'
import { StudyInfoData } from '../../../helpers/StudyInfoContext'
import { DEFAULT_NOTIFICATION } from '../../../services/study.service'
import { latoFont, ThemeType } from '../../../style/theme'
import { ScheduleNotification } from '../../../types/scheduling'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import { normalNavIcons, SECTIONS, StudySection } from '../sections'

const useStyles = makeStyles((theme: ThemeType) => ({
  /*root: {
    padding: theme.spacing(3),
  },*/
  section: {
    borderTop: '1px solid black',
    padding: theme.spacing(4, 3, 4, 1),
    textAlign: 'left',
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
  previewBox: {
    border: '1px solid black',
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(4, 6),
    display: 'flex',
    alignContent: 'center',
    '& a': {
      fontWeight: 'bold',
    },
    '& svg': {
      marginRight: theme.spacing(2),
    },
  },
}))

const ALERTS: StudyAlertSection[] = [
  {
    section: 'enrollment-type-selector',
    errors: [
      {
        errorText: 'Please select enrollment type',
        validationFn: (s: StudyInfoData) => !!s.study.clientData.enrollmentType,
        isDismissable: false,
      },
    ],
  },
  {
    section: 'session-creator',
    errors: [
      {
        errorText: 'Please create a schedule and select assessments',
        validationFn: (s: StudyInfoData) => {
          return !!s.schedule
        },
        isDismissable: false,
      },
    ],
  },

  {
    section: 'scheduler',
    errors: [
      {
        errorText: 'Do you want to keep the default notification text',
        validationFn: (s: StudyInfoData) => {
          const schedule = s.schedule
          if (!schedule) {
            return false
          }
          const allNotifications = schedule.sessions.reduce((prev, curr) => {
            return [...prev, ...(curr.notifications || [])]
          }, [] as ScheduleNotification[])
          const defaultNotifications = allNotifications.find(
            n =>
              _.get(n.messages, '0.message') ===
                DEFAULT_NOTIFICATION.messages[0]!.message ||
              _.get(n.messages, '0.subject') ===
                DEFAULT_NOTIFICATION.messages[0]!.subject,
          )
          return !!defaultNotifications
        },
        isDismissable: true,
      },
    ],
  },
  {
    section: 'customize',
    errors: [
      {
        errorText: 'Please enter Sudy Summary copy',
        validationFn: (s: StudyInfoData) => {
          return !!s.study.details
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Lead PI',
        validationFn: (s: StudyInfoData) => {
          const pi = s.study.contacts?.find(
            c => c.role === 'principal_investigator',
          )
          return !!pi
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Institutional Affiliation',
        validationFn: (s: StudyInfoData) => {
          return !!s.study.institutionId
        },
        isDismissable: false,
      },

      {
        errorText: 'Please enter Funder',
        validationFn: (s: StudyInfoData) => {
          const funder = s.study.contacts?.find(el => el.role === 'sponsor')
          return !!funder
        },
        isDismissable: true,
      },
      {
        errorText: 'Please enter Contact Lead',
        validationFn: (s: StudyInfoData) => {
          const studySupport = s.study.contacts?.find(
            el => el.role === 'study_support',
          )
          return !!studySupport
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Contact’s position',
        validationFn: (s: StudyInfoData) => {
          const studySupport = s.study.contacts?.find(
            el => el.role === 'study_support',
          )
          return !!studySupport?.position
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Phone # of Contact Lead',
        validationFn: (s: StudyInfoData) => {
          const studySupport = s.study.contacts?.find(
            el => el.role === 'study_support',
          )
          return !!studySupport?.phone
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Email of Contact Lead',
        validationFn: (s: StudyInfoData) => {
          const studySupport = s.study.contacts?.find(
            el => el.role === 'study_support',
          )
          return !!studySupport?.email
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter IRB of Record Name',
        validationFn: (s: StudyInfoData) => {
          const irbInfo = s.study.contacts?.find(el => el.role === 'irb')
          return !!irbInfo?.name
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Phone # of IRB Contact',
        validationFn: (s: StudyInfoData) => {
          const irbInfo = s.study.contacts?.find(el => el.role === 'irb')
          return !!irbInfo?.phone
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter Email of IRB',
        validationFn: (s: StudyInfoData) => {
          const irbInfo = s.study.contacts?.find(el => el.role === 'irb')
          return !!irbInfo?.email
        },
        isDismissable: false,
      },
      {
        errorText: 'Please enter IRB Protocol ID',
        validationFn: (s: StudyInfoData) => {
          return !!s.study.irbProtocolId
        },
        isDismissable: false,
      },
    ],
  },
]

type StudyAlert = {
  errorText: string
  isDismissable: boolean
  validationFn: (s: StudyInfoData) => boolean
  section?: StudySection
}
type StudyAlertSection = {
  section: StudySection
  errors: StudyAlert[]
}
export interface LaunchAlertsProps {
  studyInfo: StudyInfoData
  onEnableNext: Function
}

const StudyAlertComponent: React.FunctionComponent<
  StudyAlertSection & { onIgnore: Function }
> = ({
  section,
  errors,
  onIgnore,
}: StudyAlertSection & { onIgnore: Function }) => {
  const classes = useStyles()

  const sectionIndex = SECTIONS.findIndex(s => s.path === section)

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <img
          src={normalNavIcons[sectionIndex]}
          className={classes.navIcon}
          alt={SECTIONS[sectionIndex].name}
        />
        <span>{SECTIONS[sectionIndex].name}</span>
      </div>
      {errors.map((error, errorIndex) => (
        <div className={classes.errorDescription}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!error.isDismissable && (
              <Alert_Icon className={classes.alertIcon} />
            )}

            {error.errorText}
          </div>
          {error.isDismissable && (
            <Box className={classes.reviewIgnoreButtons}>
              <Button href={SECTIONS[sectionIndex].path}>Review</Button>
              <Button
                onClick={() =>
                  onIgnore(SECTIONS[sectionIndex].path, errorIndex)
                }
              >
                Ignore
              </Button>
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
        </div>
      ))}
    </div>
  )
}

const LaunchAlerts: React.FunctionComponent<LaunchAlertsProps> = ({
  studyInfo,
  onEnableNext
}: LaunchAlertsProps) => {
  const classes = useStyles()

  const [alerts, setAlerts] = React.useState<StudyAlertSection[]>([])

  React.useEffect(() => {
    const alrts: StudyAlertSection[] = []
    if (!studyInfo) {
      return
    }
    ALERTS.forEach(alert => {
      const section = alert.section
      const er: StudyAlert[] = []
      alert.errors.forEach(e => {
        if (!e.validationFn(studyInfo)) {
          er.push(e)
        }
      })
      if (er.length > 0) {
        alrts.push({ section: section, errors: er })
      }
    })
onEnableNext(false)
    setAlerts(alrts)
  }, [studyInfo])

  const ignore = (sectionPath: string, index: number) => {
    const sectionAlertsIndex = alerts.findIndex(a => a.section === sectionPath)
    const sectionAlerts = [...alerts[sectionAlertsIndex].errors]
    sectionAlerts.splice(index, 1)
    //if no alerts - remove section
    const newAlerts = [...alerts]
    if (sectionAlerts.length === 0) {
      newAlerts.splice(sectionAlertsIndex!, 1)
    } else {
      //otherwise replace it
      const replacementSection: StudyAlertSection = {
        section: alerts[sectionAlertsIndex].section,
        errors: sectionAlerts,
      }

      newAlerts.splice(sectionAlertsIndex!, 1, replacementSection)
    }
    setAlerts(alerts => newAlerts)
    
onEnableNext(true)
  }

  return (
    <Container maxWidth="sm">
      <MTBHeadingH1>{studyInfo.study.name}</MTBHeadingH1>
      <MTBHeadingH2>Please review the following alerts: </MTBHeadingH2>
      <h3>LaunchAlerts </h3>

      {alerts.map(alert => (
        <StudyAlertComponent
          {...alert}
          onIgnore={(sectionPath: string, index: number) => {
            ignore(sectionPath, index)
          }}
        ></StudyAlertComponent>
      ))}

      <div className={classes.previewBox}>
        <Preview_Icon />
        <span>
          Please remember to&nbsp;
          <a href="preview">Preview Your Study</a> before launching.
        </span>
      </div>
    </Container>
  )
}

export default LaunchAlerts
