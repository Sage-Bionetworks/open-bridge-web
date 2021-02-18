import { Box, Button, Grid, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataDispatch,
  useStudyInfoDataState
} from '../../../helpers/StudyInfoContext'
import ParticipantService from '../../../services/participants.service'
import StudyService from '../../../services/study.service'
import { EnrollmentType, ParticipantAccountSummary } from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import HideWhen from '../../widgets/HideWhen'
import AddByIdDialog from './AddByIdDialog'
import AddParticipants from './AddParticipants'
import EnrollmentSelector from './EnrollmentSelector'
import ParticipantTableGrid from './ParticipantTableGrid'

const useStyles = makeStyles(theme => ({
  root: {},
  switchRoot: {
    //padding: '8px'
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

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = () => {
  const handleError = useErrorHandler()
  const classes = useStyles()

  const [isEdit, setIsEdit] = React.useState(true)
  const [exportData, setExportData] = React.useState<any[] | null>(null)
  const [
    refreshParticipantsToggle,
    setRefreshParticipantsToggle,
  ] = React.useState(false)
  //used with generate id enrollbyId
  const [isGenerateIds, setIsGenerateIds] = React.useState(false)

  const { study }: StudyInfoData = useStudyInfoDataState()
  const studyDataUpdateFn = useStudyInfoDataDispatch()

  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving
  const { token } = useUserSessionDataState()
  /*const {
    data: studyData,
    status: studyStatus,
    error: studyError,
    setData: setStudyData,
  } = useStudyBuilderInfo(id)*/
  const {
    data: participantData,
    status,
    error,
    run,
    setData: setParticipantData,
  } = useAsync<ParticipantAccountSummary[]>({
    status: 'PENDING',
    data: null,
  })

  const updateEnrollment = async (type: EnrollmentType) => {
    study.options = { ...study.options, enrollmentType: type }

    const updatedStudy = await StudyService.updateStudy(study, token!)
    studyDataUpdateFn({ type: 'SET_STUDY', payload: { study: study } })
    // setStudyData({...studyData, study})
  }

  React.useEffect(() => {
    if (!participantData) {
      return
    }
    const result = participantData.map(record => {
      return {
        healthCode: record.id,
        clinicVisit: '',
        status: record.status,
        referenceId: record.studyExternalId,
        notes: '',
      }
    })
    setExportData(result)
  }, [participantData])

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    return run(ParticipantService.getParticipants(study.identifier, token!))
  }, [study?.identifier, run])

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    const fn = async () => {
      const participants = await ParticipantService.getParticipants(
        study.identifier,
        token!,
      )
      setParticipantData(participants)
    }
    fn()
  }, [study?.identifier, refreshParticipantsToggle])

  if (status === 'PENDING' || !study) {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    return (
      <>
        <Box px={3} py={2}>
          Study ID: {study.identifier}
        </Box>
        {!study.options?.enrollmentType && (
          <EnrollmentSelector
            callbackFn={(type: EnrollmentType) => updateEnrollment(type)}
          ></EnrollmentSelector>
        )}
        {study.options?.enrollmentType && (
          <>
            {study.options.enrollmentType}
            <Box px={3} py={2}>
              <Grid component="label" container alignItems="center" spacing={0}>
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
              </Grid>
              <Box>
                <HideWhen hideWhen={!isEdit}>
                  <div style={{ display: 'inline' }}>
                    <Button>Move to</Button>

                    <Button>Unlink phone number</Button>
                    <Button>
                      <DeleteIcon />
                    </Button>
                  </div>
                </HideWhen>
                <Button>Download</Button>
              </Box>
            </Box>
            <CollapsibleLayout
              expandedWidth={300}
              isFullWidth={true}
              isHideContentOnClose={true}
              isDrawerHidden={!isEdit}
            >
              <>
                {!isGenerateIds && (
                  <AddParticipants
                    study={study}
                    token={token!}
                    enrollmentType={study.options.enrollmentType}
                    onAdded={() => {
                      setRefreshParticipantsToggle(prev => !prev)
                    }}
                  ></AddParticipants>
                )}
                {study.options.enrollmentType === 'ID' && (
                  <AddByIdDialog
                    study={study}
                    token={token!}
                    onAdded={(isHideAdd: boolean) => {
                      setRefreshParticipantsToggle(prev => !prev)
                      setIsGenerateIds(true)
                    }}
                  ></AddByIdDialog>
                )}
              </>
              <Box py={0} pr={3} pl={2}>
                <ParticipantTableGrid
                  rows={participantData || []}
                  studyId={study.identifier}
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
