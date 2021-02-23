import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Switch,
  MenuItem,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataDispatch,
  useStudyInfoDataState,
} from '../../../helpers/StudyInfoContext'
import ParticipantService from '../../../services/participants.service'
import StudyService from '../../../services/study.service'
import {
  EnrollmentType,
  ParticipantAccountSummary,
  StringDictionary,
} from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import HideWhen from '../../widgets/HideWhen'
import AddParticipants from './AddParticipants'
import ParticipantTableGrid from './ParticipantTableGrid'
import LinkIcon from '../../../assets/link_icon.svg'
import SearchIcon from '../../../assets/search_icon.svg'
import {
  ButtonWithSelectSelect,
  ButtonWithSelectButton,
} from '../../widgets/StyledComponents'
import WhiteSearchIcon from '../../../assets/white_search_icon.svg'
import BlackXIcon from '../../../assets/black_x_icon.svg'

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
    marginRight: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '36px',
  },
  topRow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(5),
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
    marginLeft: theme.spacing(5),
  },
  buttonImage: {
    marginRight: theme.spacing(0.5),
  },
  participantIDSearchBar: {
    backgroundColor: 'white',
    outline: 'none',
    height: '38px',
    width: '220px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    padding: theme.spacing(0.7),
    borderTop: '1px solid black',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '0px',
    fontSize: '13px',
  },
  searchIconContainer: {
    width: '42px',
    height: '38px',
    backgroundColor: 'black',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: 'black',
      boxShadow: '1px 1px 1px rgb(0, 0, 0, 0.75)',
    },
    borderRadius: '0px',
    minWidth: '0px',
  },
  blackXIconButton: {
    marginLeft: '195px',
    position: 'absolute',
    minWidth: '0px',
    width: '18px',
    height: '18px',
    minHeight: '8px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '15px',
    '&:hover': {
      backgroundColor: 'rgb(0, 0, 0, 0.2)',
    },
    display: 'flex',
  },
  blackXIcon: {
    width: '10px',
    height: '10px',
  },
  inputRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    marginBottom: theme.spacing(0),
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

type ParticipantData = {
  items: ParticipantAccountSummary[]
  total: number
}

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = () => {
  // The current page in the particpant grid the user is viewing
  const [currentPage, setCurrentPage] = React.useState(1)
  // The current page size of the particpant grid
  const [pageSize, setPageSize] = React.useState(50)
  // True if the user is currently trying to search for a particular particpant
  const [isSearchingUsingId, setIsSearchingUsingID] = React.useState(false)
  // Reference to the input component for searching for a participant using ID.
  const inputComponent = React.useRef<HTMLInputElement>(null)

  const [
    isSearchingForParticipant,
    setIsSearchingForParticipant,
  ] = React.useState(false)

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
    data,
    status,
    error,
    run,
    setData: setParticipantData,
  } = useAsync<ParticipantData>({
    status: 'PENDING',
    data: null,
  })

  const participantData = data ? data.items : null
  const totalParticipants = data ? data.total : 0

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    return run(getParticipants(study?.identifier, token!))
  }, [study?.identifier, run, token])

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
        clinicVisit: '2/14/2020',
        status: record.status,
        referenceId: record.studyExternalId,
        notes: '--',
      }
    })
    setExportData(result)
  }, [participantData])

  // need to configure this
  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    const fn = async () => {
      const result = await run(getParticipants(study.identifier, token!))
      setParticipantData({ items: result.items, total: result.total })
    }
    fn()
  }, [study?.identifier, refreshParticipantsToggle, currentPage, pageSize])

  async function getParticipants(
    studyId: string,
    token: string,
  ): Promise<ParticipantData> {
    const offset = (currentPage - 1) * pageSize
    const participants = await ParticipantService.getParticipants(
      studyId,
      token!,
      pageSize,
      offset,
    )
    const retrievedParticipants = participants ? participants.items : []
    const numberOfParticipants = participants ? participants.total : 0
    const clinicVisitMap: StringDictionary<string> = await ParticipantService.getClinicVisitsForParticipants(
      studyId,
      token,
      retrievedParticipants.map(p => p.id),
    )
    const result = retrievedParticipants!.map(participant => {
      const id = participant.id as string
      const visit = clinicVisitMap[id]
      const y = { ...participant, clinicVisit: visit }
      return y
    })

    return { items: result, total: numberOfParticipants }
  }

  const handleSearchParticipantRequest = async () => {
    const searchedValue = inputComponent.current?.value
      ? inputComponent.current?.value
      : ''
    const result = await ParticipantService.getParticipantWithId(
      'mtb-user-testing',
      token!,
      searchedValue,
    )
    const realResult = result ? [result] : null
    const totalParticipantsFound = result ? 1 : 0
    setParticipantData({ items: realResult, total: totalParticipantsFound })
    setIsSearchingUsingID(true)
  }

  const handleResetSearch = async () => {
    inputComponent.current!.value = ''
    setIsSearchingUsingID(false)
    const result = await run(getParticipants(study!.identifier, token!))
    setParticipantData({ items: result.items, total: result.total })
  }

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
                  className={classes.downloadButton}
                >
                  Download
                </ButtonWithSelectButton>
              </div>
            </Grid>
            <Box className={classes.topButtonContainer}>
              {!isEdit && (
                <div className={classes.inputRow}>
                  <Button className={classes.topButtons}>
                    <img src={LinkIcon} className={classes.buttonImage}></img>
                    App Download Link
                  </Button>
                </div>
              )}
              {isSearchingForParticipant ? (
                <div className={classes.inputRow}>
                  <input
                    placeholder="Participant IDs"
                    className={classes.participantIDSearchBar}
                    ref={inputComponent}
                    style={{
                      paddingRight: isSearchingUsingId ? '28px' : '4px',
                    }}
                  ></input>
                  {isSearchingUsingId && (
                    <Button
                      className={classes.blackXIconButton}
                      onClick={handleResetSearch}
                    >
                      <img
                        src={BlackXIcon}
                        className={classes.blackXIcon}
                      ></img>
                    </Button>
                  )}
                  <Button
                    className={classes.searchIconContainer}
                    onClick={handleSearchParticipantRequest}
                  >
                    <img src={WhiteSearchIcon}></img>
                  </Button>
                </div>
              ) : (
                <Button
                  className={classes.topButtons}
                  onClick={() => {
                    setIsSearchingForParticipant(true)
                  }}
                >
                  <img src={SearchIcon} className={classes.buttonImage}></img>
                  Find Participant
                </Button>
              )}
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
                onAdded={() => {
                  setRefreshParticipantsToggle(prev => !prev)
                }}
                isGenerateIds={isGenerateIds}
                enrollmentType={
                  /*study.options.enrollmentType*/ temporaryEnrollmentType as EnrollmentType
                }
              ></AddParticipants>
            </>
            <Box py={0} pr={3} pl={2}>
              {status === 'PENDING' && <CircularProgress></CircularProgress>}
              {status === 'RESOLVED' && (
                <ParticipantTableGrid
                  rows={participantData || []}
                  studyId={'mtb-user-testing'}
                  totalParticipants={totalParticipants}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
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
