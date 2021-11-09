import {SessionSymbols} from '@components/widgets/SessionIcon'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  FormControlLabel,
  Theme,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import ScheduleService from '@services/schedule.service'
import {Study} from '@typedefs/types'
import React from 'react'
import {latoFont, poppinsFont} from '../../../style/theme'
import constants from '../../../types/constants'
import {DWsEnum, Schedule} from '../../../types/scheduling'
import {SimpleTextInput} from '../../widgets/StyledComponents'
import {useUpdateSchedule} from '../scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '../studyHooks'
import Duration from './Duration'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      fontFamily: poppinsFont,
      marginLeft: 0,
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'left',
      alignSelf: 'start',
      alignItems: 'flex-start',
    },
    container: {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(3.75),
      minWidth: '300px',
    },
    formControl: {
      fontSize: '18px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },

    divider: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    headerText: {
      fontSize: '18px',
      fontFamily: 'Poppins',
      lineHeight: '27px',
    },
    description: {
      fontFamily: 'Lato',
      fontStyle: 'italic',
      fontSize: '15px',
      fontWeight: 'lighter',
      lineHeight: '18px',
    },
    middleContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    weekInformation: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '12px',
      lineHeight: '20px',
      marginLeft: theme.spacing(2.25),

      marginTop: theme.spacing(19),
      textAlign: 'left',
      listStyle: 'none',
    },
    hint: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '11px',
      fontWeight: 'bold',
      display: 'block',
    },
    continueButton: {
      display: 'flex',
      height: '45px',
      marginTop: theme.spacing(8),
      alignSelf: 'flex-start',
    },
  })
)

export interface IntroInfoProps {
  studyName: string
  id: string
}

const IntroInfo: React.FunctionComponent<IntroInfoProps> = ({
  studyName: name,
  id: studyId,
}: IntroInfoProps) => {
  const classes = useStyles()
  const {token} = useUserSessionDataState()
  const [studyName, setStudyName] = React.useState<any>(
    name === constants.constants.NEW_STUDY_NAME ? '' : name
  )
  const [duration, setDuration] = React.useState<any>('')
  const {data: study, error: studyError} = useStudy(studyId)
  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateSchedule,
    data,
  } = useUpdateSchedule()

  const {
    isSuccess: studyUpdateSuccess,
    isError: studyUpdateError,
    mutateAsync: mutateStudy,
  } = useUpdateStudyDetail()

  const createScheduleAndNameStudy = async (
    studyId: string,
    studyName: string,
    duration: string,
    start: string
  ) => {
    const symbol = SessionSymbols.values().next().value
    const studySession = ScheduleService.createEmptyScheduleSession(
      start,
      SessionSymbols.keys().next().value
    )
    let schedule: Schedule = {
      guid: '',
      name: studyId,
      duration,
      sessions: [studySession],
    }
    const newSchedule = await ScheduleService.createSchedule(
      studyId,
      schedule,
      token!
    )

    //agendel 10/6 adding  default to signin with study Id signInTypes: SignInType[]
    const updatedStudy: Study = {
      ...study!,
      name: studyName,
      signInTypes: ['external_id_password'],
    }

    mutateSchedule({
      studyId: studyId,
      schedule: newSchedule,
      action: 'CREATE',
    }).then(s => console.log('schedule created'))

    mutateStudy({study: updatedStudy}).then(e => {
      console.log('study updated')
    })
  }

  return (
    <Container maxWidth="md" className={classes.container}>
      <div>
        <FormControlLabel
          style={{marginBottom: '35px', marginLeft: 0}}
          classes={{labelPlacementStart: classes.labelDuration}}
          label={
            <Box width="210px" marginRight="40px">
              <strong className={classes.headerText}>Study Name</strong>
              <br /> <br />
              <div className={classes.description}>
                This name will be displayed to your participants in the app.
              </div>{' '}
            </Box>
          }
          className={classes.formControl}
          labelPlacement="start"
          control={
            <SimpleTextInput
              fullWidth
              value={studyName}
              onChange={e => setStudyName(e.target.value)}
            />
          }
        />
        <Divider className={classes.divider}></Divider>
        <Box className={classes.middleContainer}>
          <FormControlLabel
            classes={{
              labelPlacementStart: classes.labelDuration,
            }}
            label={
              <Box width="210px" marginRight="40px">
                <strong className={classes.headerText}>
                  How long is your study?
                </strong>
                <br /> <br />
                <div className={classes.description}>
                  This is the duration that a participant is involved in the
                  study.
                </div>{' '}
              </Box>
            }
            className={classes.formControl}
            labelPlacement="start"
            control={
              <Box>
                <Duration
                  onChange={e => setDuration(e.target.value)}
                  durationString={duration || ''}
                  unitLabel="study duration unit"
                  numberLabel="study duration number"
                  maxDurationDays={1825}
                  unitData={DWsEnum}
                  isIntro={true}></Duration>
                <span className={classes.hint}>
                  <strong>
                    The study duration must be shorter than 5 years.
                  </strong>
                </span>
              </Box>
            }
          />
        </Box>
        <Button
          className={classes.continueButton}
          variant="contained"
          color="primary"
          key="saveButton"
          onClick={e =>
            createScheduleAndNameStudy(
              studyId,

              studyName,
              duration,
              'timeline_retrieved'
            )
          }
          disabled={!(duration && studyName)}>
          Continue
        </Button>
      </div>

      <ul className={classes.weekInformation}>
        <li>Example Conversions</li>
        <li>1 year = 52 weeks</li>
        <li>2 year = 104 weeks</li>
        <li>3 year = 156 weeks</li>
        <li>4 year = 208 weeks</li>
        <li>5 year = 260 weeks</li>
      </ul>
    </Container>
  )
}

export default IntroInfo
