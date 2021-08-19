import {Box, Button, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import _ from 'lodash'
import React from 'react'
import {ReactComponent as Alert_Icon} from '../../../assets/alert_icon.svg'
import {ReactComponent as Preview_Icon} from '../../../assets/launch/preview_icon.svg'
import {StudyInfoData} from '../../../helpers/StudyInfoContext'
import {DEFAULT_NOTIFICATION} from '../../../services/schedule.service'
import {latoFont, ThemeType} from '../../../style/theme'
import constants from '../../../types/constants'
import {ScheduleNotification} from '../../../types/scheduling'
import {Contact} from '../../../types/types'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import {isSameAsDefaultSchedule} from '../scheduler/utility'
import {
  getStudyBuilderSections,
  normalNavIcons,
  StudySection,
} from '../sections'

const DEFAULT_CONTACT_NAME = constants.constants.DEFAULT_PLACEHOLDER

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
    flexShrink: 0,
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

function getStudySupportPerson(s: StudyInfoData): Contact | undefined {
  return s.study.contacts?.find(el => el.role === 'study_support')
}

function getLeadPI(s: StudyInfoData): Contact | undefined {
  return s.study.contacts?.find(c => c.role === 'principal_investigator')
}

function getIrbContact(s: StudyInfoData): Contact | undefined {
  return s.study.contacts?.find(el => el.role === 'irb')
}

const ALERTS: StudyAlertSection[] = [
  {
    section: 'session-creator',
    errors: [
      {
        errorText: 'Please create a schedule and select assessments',
        validationFn: (s: StudyInfoData) => !!s.schedule,
        isDismissable: false,
      },
      {
        errorText: 'All study sessions need to have at least one assessment',
        validationFn: (s: StudyInfoData) => {
          const noAsseessments = s.schedule?.sessions.find(
            s => !s.assessments || s.assessments.length === 0
          )
          return !noAsseessments
        },
        isDismissable: false,
      },
    ],
  },

  {
    section: 'scheduler',
    errors: [
      {
        errorText: 'Do you want to keep the default notification text?',
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
                DEFAULT_NOTIFICATION.messages[0]!.subject
          )
          return !!defaultNotifications
        },
        isDismissable: true,
      },
      {
        errorText:
          'Please make sure to edit schedule through the "Schedule Sessions" tab',
        validationFn: (s: StudyInfoData) => {
          const schedule = s.schedule
          if (!schedule) return false
          return !isSameAsDefaultSchedule(schedule)
        },
        isDismissable: true,
      },
    ],
  },
  {
    section: 'enrollment-type-selector',
    errors: [
      {
        errorText: 'Please select enrollment type',
        validationFn: (s: StudyInfoData) => !_.isEmpty(s.study.signInTypes),
        isDismissable: false,
      },
    ],
  },
  {
    section: 'customize',
    errors: [
      {
        errorText: 'Please enter Study Summary copy',
        validationFn: (s: StudyInfoData) => !!s.study.details,
        isDismissable: false,
        anchor: 'summary',
      },
      {
        errorText: 'Please enter Lead PI',
        validationFn: (s: StudyInfoData) => {
          const leadPI = getLeadPI(s)
          return !!leadPI && leadPI.name !== DEFAULT_CONTACT_NAME
        },
        isDismissable: false,
        anchor: 'leadPI',
      },
      {
        errorText: 'Please enter Institutional Affiliation',
        validationFn: (s: StudyInfoData) => !!getLeadPI(s)?.affiliation,
        isDismissable: false,
        anchor: 'leadPI',
      },

      {
        errorText: 'Please enter Funder',
        validationFn: (s: StudyInfoData) => {
          const funder = s.study.contacts?.find(el => el.role === 'sponsor')
          return !!funder && funder.name !== DEFAULT_CONTACT_NAME
        },
        isDismissable: true,
        anchor: 'leadPI',
      },
      {
        errorText: 'Please enter Contact Lead',
        validationFn: (s: StudyInfoData) => {
          const contactSupport = getStudySupportPerson(s)
          return (
            !!contactSupport && contactSupport.name !== DEFAULT_CONTACT_NAME
          )
        },
        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter Contact’s position',
        validationFn: (s: StudyInfoData) =>
          !!getStudySupportPerson(s)?.position,

        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter Phone # of Contact Lead',
        validationFn: (s: StudyInfoData) => !!getStudySupportPerson(s)?.phone,
        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter Email of Contact Lead',
        validationFn: (s: StudyInfoData) => !!getStudySupportPerson(s)?.email,
        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter IRB of Record Name',
        validationFn: (s: StudyInfoData) => {
          const irbContact = getIrbContact(s)
          return !!irbContact && irbContact.name !== DEFAULT_CONTACT_NAME
        },
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter Phone # of IRB Contact',
        validationFn: (s: StudyInfoData) => !!getIrbContact(s)?.phone,
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter Email of IRB',
        validationFn: (s: StudyInfoData) => !!getIrbContact(s)?.email,
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter IRB Protocol ID',
        validationFn: (s: StudyInfoData) => {
          return !!s.study.irbProtocolId
        },
        isDismissable: false,
        anchor: 'contactIrb',
      },
    ],
  },
]

type StudyAlert = {
  errorText: string
  isDismissable: boolean
  validationFn: (s: StudyInfoData) => boolean
  section?: StudySection
  anchor?: string
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
  StudyAlertSection & {onIgnore: Function}
> = ({section, errors, onIgnore}: StudyAlertSection & {onIgnore: Function}) => {
  const classes = useStyles()
  const sections = getStudyBuilderSections()
  const sectionIndex = sections.findIndex(s => s.path === section)
  const indexedSection = sections[sectionIndex]

  return (
    <div className={classes.section}>
      <div className={classes.sectionHeader}>
        <img
          src={normalNavIcons[sectionIndex]}
          className={classes.navIcon}
          alt={indexedSection.name}
        />
        <span>{indexedSection.name}</span>
      </div>
      {errors.map((error, errorIndex) => (
        <div className={classes.errorDescription}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {!error.isDismissable && (
              <Alert_Icon className={classes.alertIcon} />
            )}

            {error.errorText}
          </div>
          {error.isDismissable && (
            <Box className={classes.reviewIgnoreButtons}>
              <Button
                href={`${indexedSection.path}?from=launch${
                  error.anchor ? '&anchor=' + error.anchor : ''
                }`}>
                Review
              </Button>
              <Button onClick={() => onIgnore(indexedSection.path, errorIndex)}>
                Ignore
              </Button>
            </Box>
          )}
          {!error.isDismissable && (
            <Button
              variant="contained"
              className={classes.mustReviewButton}
              href={`${sections[sectionIndex].path}?from=launch${
                error.anchor ? '&anchor=' + error.anchor : ''
              }`}>
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
  onEnableNext,
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
        alrts.push({section: section, errors: er})
      }
    })
    onEnableNext(false)
    setAlerts(alrts)
    /*const requiredAlert = alrts.find(alert =>
      alert.errors.find(error => !error.isDismissable),
    )*/
    onEnableNext(alrts.length === 0)
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
      <Box textAlign="left">
        <MTBHeadingH1 style={{marginBottom: '24px'}}>
          {studyInfo.study.name}
        </MTBHeadingH1>
        {alerts?.length > 0 && (
          <MTBHeadingH2 style={{marginBottom: '40px'}}>
            Please review the following alerts:{' '}
          </MTBHeadingH2>
        )}
      </Box>
      {alerts.map(alert => (
        <StudyAlertComponent
          {...alert}
          onIgnore={(sectionPath: string, index: number) => {
            ignore(sectionPath, index)
          }}></StudyAlertComponent>
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
