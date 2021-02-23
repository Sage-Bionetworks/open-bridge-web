import { Box, Button, CircularProgress, Grid, Switch } from '@material-ui/core'
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
import {
  EnrollmentType,
  ParticipantAccountSummary,
  StringDictionary
} from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import HideWhen from '../../widgets/HideWhen'
import AddParticipants from './AddParticipants'
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
  const [temporaryEnrollmentType, setTemporaryEnrollmentType] = React.useState(
    'PHONE',
  )

  const [exportData, setExportData] = React.useState<any[] | null>(null)
  const [
    refreshParticipantsToggle,
    setRefreshParticipantsToggle,
  ] = React.useState(false)
  //used with generate id enrollbyId
  const [isGenerateIds, setIsGenerateIds] = React.useState(false)

  const { study }: StudyInfoData = useStudyInfoDataState()
  const studyDataUpdateFn = useStudyInfoDataDispatch()

  const { token } = useUserSessionDataState()

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

  async function getParticipants(
    studyId: string,
    token: string,
  ): Promise<ParticipantAccountSummary[]> {
    const participants = await ParticipantService.getParticipants(
      studyId,
      token,
    )

    const clinicVisitMap: StringDictionary<string> = await ParticipantService.getClinicVisitsForParticipants(
      studyId,
      token,
      participants.map(p => p.id),
    )
    const result = participants.map(participant => {
      const id = participant.id as string
      const visit = clinicVisitMap[id]
      const y = { ...participant, clinicVisit: visit }
      return y
    })

    return result
  }

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    return run(getParticipants(study?.identifier, token!))
  }, [study?.identifier, run, token])

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    const fn = async () => {
      const participants = await getParticipants(study.identifier, token!)
      setParticipantData(participants)
    }
    fn()
  }, [study?.identifier, refreshParticipantsToggle])

  if (!study) {
    return (
      <Box mx="auto" my={5} textAlign="center">
        <CircularProgress />
      </Box>
    )
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else {
    return (
      <>
        <Box px={3} py={2}>
          Study ID: {study.identifier}
        </Box>

        <>
          {study.options?.enrollmentType}
          <Box px={3} py={2}>
            Enroll By: PHONE
            <Switch
              checked={temporaryEnrollmentType === 'ID'}
              classes={{ root: classes.switchRoot }}
              onChange={e =>
                e.target.checked
                  ? setTemporaryEnrollmentType('ID')
                  : setTemporaryEnrollmentType('PHONE')
              }
              name="enrolment"
            />
            ID
            {temporaryEnrollmentType === 'ID' && (
              <>
                {' '}
                &nbsp; &nbsp; &nbsp; Generate Ids:
                <Switch
                  checked={isGenerateIds}
                  classes={{ root: classes.switchRoot }}
                  onChange={e => setIsGenerateIds(e.target.checked)}
                  name="enrolment"
                />
              </>
            )}
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
              <AddParticipants
                study={study}
                token={token!}
                isGenerateIds={isGenerateIds}
                enrollmentType={
                  /*study.options.enrollmentType*/ temporaryEnrollmentType as EnrollmentType
                }
                onAdded={() => {
                  setRefreshParticipantsToggle(prev => !prev)
                }}
              ></AddParticipants>
            </>
            <Box py={0} pr={3} pl={2}>
              {status === 'PENDING' && <CircularProgress></CircularProgress>}
              {status === 'RESOLVED' && (
                <ParticipantTableGrid
                  rows={participantData || []}
                  studyId={study.identifier}
                ></ParticipantTableGrid>
              )}
            </Box>

            <Box textAlign="center" pl={2}>
              ADD A PARTICIPANT
            </Box>
          </CollapsibleLayout>
        </>
      </>
    )
  }
  return <>bye</>
}
export default ParticipantManager
