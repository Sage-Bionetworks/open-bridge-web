import {Box, Button, Container} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import _ from 'lodash'
import React from 'react'
import {NavLink} from 'react-router-dom'
import {ReactComponent as Alert_Icon} from '../../../assets/alert_icon.svg'
import {ReactComponent as Preview_Icon} from '../../../assets/launch/preview_icon.svg'
import {DEFAULT_NOTIFICATION} from '../../../services/schedule.service'
import {latoFont, ThemeType} from '../../../style/theme'
import constants from '../../../types/constants'
import {Schedule, ScheduleNotification} from '../../../types/scheduling'
import {Contact, Study} from '../../../types/types'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import {isAppBackgroundColorValid} from '../app-design/AppDesign'
import {isSameAsDefaultSchedule} from '../scheduler/utility'
import {
  getStudyBuilderSections,
  normalNavIcons,
  StudySection,
} from '../sections'

type DataToValidate = {
  study: Study
  schedule: Schedule
}

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

function getStudySupportPerson(study: Study): Contact | undefined {
  return study.contacts?.find(el => el.role === 'study_support')
}

function getLeadPI(study: Study): Contact | undefined {
  return study.contacts?.find(c => c.role === 'principal_investigator')
}

function getIrbContact(study: Study): Contact | undefined {
  return study.contacts?.find(el => el.role === 'irb')
}

const ALERTS: StudyAlertSection[] = [
  {
    section: 'session-creator',
    errors: [
      {
        errorText: 'Please create a schedule and select assessments',
        validationFn: (args: DataToValidate) => !!args.schedule,
        isDismissable: false,
      },
      {
        errorText: 'All study sessions need to have at least one assessment',
        validationFn: (args: DataToValidate) => {
          const noAsseessments = args.schedule.sessions.find(
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
        validationFn: (args: DataToValidate) => {
          if (!args.schedule) {
            return false
          }
          const allNotifications = args.schedule.sessions.reduce(
            (prev, curr) => {
              return [...prev, ...(curr.notifications || [])]
            },
            [] as ScheduleNotification[]
          )
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
        validationFn: (args: DataToValidate) => {
          if (!args.schedule) return false
          return !isSameAsDefaultSchedule(args.schedule)
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
        validationFn: (args: DataToValidate) =>
          !_.isEmpty(args.study.signInTypes),
        isDismissable: false,
      },
    ],
  },
  {
    section: 'customize',
    errors: [
      {
        errorText: 'Please enter Study Summary copy',
        validationFn: (args: DataToValidate) => !!args.study.details,
        isDismissable: false,
        anchor: 'summary',
      },
      {
        errorText: 'Please enter Lead PI',
        validationFn: (args: DataToValidate) => {
          const leadPI = getLeadPI(args.study)
          return !!leadPI && leadPI.name !== DEFAULT_CONTACT_NAME
        },
        isDismissable: false,
        anchor: 'leadPI',
      },
      {
        errorText: 'Please enter Institutional Affiliation',
        validationFn: (args: DataToValidate) =>
          !!getLeadPI(args.study)?.affiliation,
        isDismissable: false,
        anchor: 'leadPI',
      },

      {
        errorText: 'Please enter Funder',
        validationFn: (args: DataToValidate) => {
          const funder = args.study.contacts?.find(el => el.role === 'sponsor')
          return !!funder && funder.name !== DEFAULT_CONTACT_NAME
        },
        isDismissable: true,
        anchor: 'leadPI',
      },
      {
        errorText: 'Please enter Contact Lead',
        validationFn: (args: DataToValidate) => {
          const contactSupport = getStudySupportPerson(args.study)
          return (
            !!contactSupport && contactSupport.name !== DEFAULT_CONTACT_NAME
          )
        },
        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter Contact’s position',
        validationFn: (args: DataToValidate) =>
          !!getStudySupportPerson(args.study)?.position,

        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter Phone # of Contact Lead',
        validationFn: (args: DataToValidate) =>
          !!getStudySupportPerson(args.study)?.phone,
        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter Email of Contact Lead',
        validationFn: (args: DataToValidate) =>
          !!getStudySupportPerson(args.study)?.email,
        isDismissable: false,
        anchor: 'contactLead',
      },
      {
        errorText: 'Please enter IRB of Record Name',
        validationFn: (args: DataToValidate) => {
          const irbContact = getIrbContact(args.study)
          return !!irbContact && irbContact.name !== DEFAULT_CONTACT_NAME
        },
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter Phone # of IRB Contact',
        validationFn: (args: DataToValidate) =>
          !!getIrbContact(args.study)?.phone,
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter Email of IRB',
        validationFn: (args: DataToValidate) =>
          !!getIrbContact(args.study)?.email,
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter IRB Protocol ID',
        validationFn: (args: DataToValidate) => {
          return !!args.study.irbProtocolId
        },
        isDismissable: false,
        anchor: 'contactIrb',
      },
      {
        errorText: 'Please enter a valid study color',
        validationFn: (args: DataToValidate) =>
          isAppBackgroundColorValid(args.study.colorScheme?.background),
        isDismissable: false,
        anchor: 'hex-color-picker',
      },
    ],
  },
]

type StudyAlert = {
  errorText: string
  isDismissable: boolean
  validationFn: (args: DataToValidate) => boolean
  section?: StudySection
  anchor?: string
}
type StudyAlertSection = {
  section: StudySection
  errors: StudyAlert[]
}
export interface LaunchAlertsProps {
  study: Study
  schedule: Schedule
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
        <div
          className={classes.errorDescription}
          key={error.errorText + errorIndex}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            {!error.isDismissable && (
              <Alert_Icon className={classes.alertIcon} />
            )}

            {error.errorText}
          </div>
          {error.isDismissable && (
            <Box className={classes.reviewIgnoreButtons}>
              <NavLink
                style={{textDecoration: 'none'}}
                to={`${indexedSection.path}?from=launch${
                  error.anchor ? '&anchor=' + error.anchor : ''
                }`}>
                <Button>Review</Button>
              </NavLink>

              <Button onClick={() => onIgnore(indexedSection.path, errorIndex)}>
                Ignore
              </Button>
            </Box>
          )}
          {!error.isDismissable && (
            <NavLink
              style={{textDecoration: 'none'}}
              to={`${sections[sectionIndex].path}?from=launch${
                error.anchor ? '&anchor=' + error.anchor : ''
              }`}>
              <Button variant="contained" className={classes.mustReviewButton}>
                Review Required
              </Button>
            </NavLink>
          )}
        </div>
      ))}
    </div>
  )
}

const LaunchAlerts: React.FunctionComponent<LaunchAlertsProps> = ({
  study,
  schedule,
  onEnableNext,
}: LaunchAlertsProps) => {
  const classes = useStyles()

  const [alerts, setAlerts] = React.useState<StudyAlertSection[]>([])

  React.useEffect(() => {
    const alrts: StudyAlertSection[] = []
    if (!study || !schedule) {
      return
    }
    ALERTS.forEach(alert => {
      const section = alert.section
      const er: StudyAlert[] = []
      alert.errors.forEach(e => {
        if (!e.validationFn({study, schedule})) {
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
  }, [study, schedule])

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
        <MTBHeadingH1 style={{marginBottom: '24px'}}>{study.name}</MTBHeadingH1>
        {alerts?.length > 0 && (
          <MTBHeadingH2 style={{marginBottom: '40px'}}>
            Please review the following alerts:{' '}
          </MTBHeadingH2>
        )}
      </Box>
      {alerts.map((alert, index) => (
        <StudyAlertComponent
          key={index}
          {...alert}
          onIgnore={(sectionPath: string, index: number) => {
            ignore(sectionPath, index)
          }}></StudyAlertComponent>
      ))}

      <div className={classes.previewBox}>
        <Preview_Icon />
        <span>
          Please remember to&nbsp;
          <NavLink to={`/studies/builder/${study.identifier}/preview`}>
            Preview Your Study
          </NavLink>{' '}
          before launching.
        </span>
      </div>
    </Container>
  )
}

export default LaunchAlerts
