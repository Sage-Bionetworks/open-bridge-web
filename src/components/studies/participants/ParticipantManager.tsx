import { Box, Button, Grid, Switch, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import { useStudyBuilderInfo } from '../../../helpers/hooks'
import ParticipantService from '../../../services/participants.service'
import StudyService from '../../../services/study.service'
import { EnrollmentType, ParticipantAccountSummary } from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import HideWhen from '../../widgets/HideWhen'
import StudyTopNav from '../StudyTopNav'
import AddParticipants from './AddParticipants'
import EnrollmentSelector from './EnrollmentSelector'
import ParticipantTableGrid from './ParticipantTableGrid'
import LinkIcon from '../../../assets/link_icon.svg'
import FlagIcon from '../../../assets/flag_icon.svg'
import SearchIcon from '../../../assets/search_icon.svg'
import {
  ButtonWithSelectSelect,
  ButtonWithSelectButton,
} from '../../widgets/StyledComponents'
import { data } from 'msw/lib/types/context'

const useStyles = makeStyles(theme => ({
  root: {},
  switchRoot: {
    //padding: '8px'
  },
  studyText: {
    fontFamily: 'Lato',
    fontWeight: 'lighter',
  },
  topButtons: {
    margin: theme.spacing(0.5, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  topButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonImage: {
    marginRight: '5px',
  },
}))

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

const participantRecordTemplate: ParticipantAccountSummary = {
  status: 'unverified',
  isSelected: false,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  id: '',
  externalIds: {},
}
type keys = keyof ParticipantAccountSummary

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

type ParticipantData = {
  items: ParticipantAccountSummary[]
  total: number
}

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = () => {
  let { id } = useParams<{ id: string }>()
  const [isEdit, setIsEdit] = React.useState(false)

  const handleError = useErrorHandler()
  const classes = useStyles()
  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving
  const { token } = useUserSessionDataState()
  const {
    data: studyData,
    status: studyStatus,
    error: studyError,
    setData: setStudyData,
  } = useStudyBuilderInfo(id)

  const {
    data,
    status,
    error,
    run,
    setData: setParticipantData,
  } = useAsync<ParticipantData>({
    status: 'PENDING',
    data: null,
  })
  console.log('des data', data)
  const participantData = data ? data.items : []
  const totalParticipants = data ? data.total : 0
  const [exportData, setExportData] = React.useState<any[] | null>(null)

  const updateEnrollment = async (type: EnrollmentType) => {
    let study = studyData!.study
    study.options = { ...study.options, enrollmentType: type }

    const updatedStudy = await StudyService.updateStudy(study, token!)
    setStudyData({ ...studyData, study })
  }

  React.useEffect(() => {
    if (!participantData) {
      return
    }
    const result = participantData.map(record => {
      return {
        healthCode: record.id,
        clinicVisit: '2/14/2020',
        status: record.status,
        referenceId: record.studyExternalId,
        notes: '--',
      }
    })
    setExportData(result)
  }, [participantData])

  React.useEffect(() => {
    if (!id) {
      return
    }
    ///your async call
    return run(ParticipantService.getParticipants('mtb-user-testing', token!))
  }, [id, run])

  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    return (
      <>
        <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>{' '}
        <Box px={3} py={2} className={classes.studyText}>
          Study ID: {id}
        </Box>
        {!studyData?.study.options?.enrollmentType && (
          <EnrollmentSelector
            callbackFn={(type: EnrollmentType) => updateEnrollment(type)}
          ></EnrollmentSelector>
        )}
        {studyData?.study.options?.enrollmentType && (
          <>
            {studyData.study.options.enrollmentType}
            <Box px={3} py={2}>
              <Grid
                component="label"
                container
                alignItems="center"
                spacing={0}
                className={classes.topRow}
              >
                <div className={classes.horizontalGroup}>
                  <Grid item>View</Grid>
                  <Grid item>
                    <Switch
                      checked={isEdit}
                      classes={{ root: classes.switchRoot }}
                      onChange={e => setIsEdit(e.target.checked)}
                      name="viewEdit"
                    />
                  </Grid>
                  <Grid item>Edit</Grid>
                </div>
                <div className={classes.horizontalGroup}>
                  <ButtonWithSelectSelect
                    key="session_select"
                    value="selectedSessionId"
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    disableUnderline={true}
                  >
                    <MenuItem value={'placeholder'} key={'hello'}>
                      {'placeholder'}
                    </MenuItem>
                  </ButtonWithSelectSelect>
                  <ButtonWithSelectButton
                    key="duplicate_session"
                    variant="contained"
                    style={{ marginBottom: '0px' }}
                  >
                    Download
                  </ButtonWithSelectButton>
                </div>
              </Grid>
              <Box className={classes.topButtonContainer}>
                {!isEdit && (
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Button className={classes.topButtons}>
                      <img src={LinkIcon} className={classes.buttonImage}></img>
                      App Download Link
                    </Button>
                    <Button className={classes.topButtons}>
                      <img src={FlagIcon} className={classes.buttonImage}></img>
                      Flag Participant
                    </Button>
                  </div>
                )}
                <Button className={classes.topButtons}>
                  <img src={SearchIcon} className={classes.buttonImage}></img>
                  Find Participant
                </Button>
              </Box>
            </Box>
            <CollapsibleLayout
              expandedWidth={300}
              isFullWidth={true}
              isHideContentOnClose={true}
            >
              <AddParticipants
                studyId={id!}
                token={token!}
                enrollmentType={'ID'}
              ></AddParticipants>
              <Box py={0} pr={3} pl={2}>
                <ParticipantTableGrid
                  rows={participantData || []}
                  studyId={'mtb-user-testing'}
                  totalParticipants={totalParticipants}
                ></ParticipantTableGrid>
              </Box>

              <Box textAlign="center" pl={2}>
                ADD A PARTICIPANT
              </Box>
            </CollapsibleLayout>
          </>
        )}
      </>
    )
  }
  return <>bye</>
}
export default ParticipantManager
