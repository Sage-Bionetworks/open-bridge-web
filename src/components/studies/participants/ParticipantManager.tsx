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
    margin: theme.spacing(0.5, 2),
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
  participantIDSearchBar: {
    backgroundColor: 'white',
    outline: 'none',
    height: '38px',
    width: '220px',
    borderTopRightRadius: '0px',
    borderBottomRightRadius: '0px',
    padding: '6px',
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
  blackXIcon: {
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
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(50)
  const [participantData, setParticipantData] = React.useState<
    ParticipantAccountSummary[] | null
  >(null)
  const [totalParticipants, setTotalParticipants] = React.useState(0)
  const [isSearchingUsingId, setIsSearchingUsingID] = React.useState(false)

  const inputComponent = React.useRef<HTMLInputElement>(null)

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

  const { data, status, error, run, setData } = useAsync<ParticipantData>({
    status: 'PENDING',
    data: null,
  })

  React.useEffect(() => {
    const dataRetrieved = data ? data.items : null
    const total = data ? data.total : 0
    setParticipantData(dataRetrieved)
    setTotalParticipants(total)
  }, [data])

  const [exportData, setExportData] = React.useState<any[] | null>(null)
  const [
    isSearchingForParticipant,
    setIsSearchingForParticipant,
  ] = React.useState(false)

  const updateEnrollment = async (type: EnrollmentType) => {
    let study = studyData!.study
    study.options = { ...study.options, enrollmentType: type }

    const updatedsStudy = await StudyService.updateStudy(study, token!)
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
    handleResetSearch(false)
  }, [id, run, currentPage, pageSize])

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
    setParticipantData(realResult)
    setTotalParticipants(totalParticipantsFound)
    setIsSearchingUsingID(true)
  }

  const handleResetSearch = async (fromXIconPressed: boolean) => {
    const offset = (currentPage - 1) * pageSize
    run(
      ParticipantService.getParticipants(
        'mtb-user-testing',
        token!,
        pageSize,
        offset,
      ),
    )
    if (fromXIconPressed) setIsSearchingUsingID(false)
  }

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
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Button className={classes.topButtons}>
                      <img src={LinkIcon} className={classes.buttonImage}></img>
                      App Download Link
                    </Button>
                  </div>
                )}
                {isSearchingForParticipant ? (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      placeholder="Participant IDs"
                      className={classes.participantIDSearchBar}
                      ref={inputComponent}
                      style={{
                        paddingRight: isSearchingUsingId ? '28px' : '4px',
                      }}
                    ></input>
                    {isSearchingUsingId && (
                      <Button className={classes.blackXIcon}>
                        <img
                          src={BlackXIcon}
                          style={{
                            width: '10px',
                            height: '10px',
                          }}
                          onClick={() => handleResetSearch(true)}
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
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageSize={pageSize}
                  setPageSize={setPageSize}
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
