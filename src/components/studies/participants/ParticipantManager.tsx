import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Switch,
  Tab,
  Tabs
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps } from 'react-router-dom'
import { ReactComponent as ExpandIcon } from '../../../assets/add_participants.svg'
import { ReactComponent as CollapseIcon } from '../../../assets/collapse.svg'
import LinkIcon from '../../../assets/link_icon.svg'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import {
  StudyInfoData,
  useStudyInfoDataState
} from '../../../helpers/StudyInfoContext'
import ParticipantService from '../../../services/participants.service'
import { theme } from '../../../style/theme'
import {
  ParticipantAccountSummary,
  StringDictionary
} from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import {
  ButtonWithSelectButton,
  ButtonWithSelectSelect
} from '../../widgets/StyledComponents'
import TabPanel from '../../widgets/TabPanel'
import AddParticipants from './AddParticipants'
import ParticipantSearch from './ParticipantSearch'
import ParticipantTableGrid from './ParticipantTableGrid'

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

  const [tab, setTab] = React.useState(0)

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
  }

  const handleError = useErrorHandler()
  const classes = useStyles()

  const [isEdit, setIsEdit] = React.useState(true)

  const [exportData, setExportData] = React.useState<any[] | null>(null)
  const [
    refreshParticipantsToggle,
    setRefreshParticipantsToggle,
  ] = React.useState(false)

  const { study }: StudyInfoData = useStudyInfoDataState()

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

  //const participantData = data ? data.items : null
  //const totalParticipants = data ? data.total : 0

  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    return run(getParticipants(study?.identifier, token!))
  }, [study?.identifier, run, token])

  React.useEffect(() => {
    if (!data?.items) {
      return
    }
    const result = data.items.map(record => {
      return {
        healthCode: record.id,
        clinicVisit: '',
        status: record.status,
        referenceId: record.studyExternalId,
        notes: '--',
      }
    })
    setExportData(result)
  }, [data?.items])

  // need to configure this
  React.useEffect(() => {
    if (!study?.identifier) {
      return
    }
    const fn = async () => {
      const result = await run(getParticipants(study.identifier, token!))
      if (result) {
        setParticipantData({ items: result.items, total: result.total })
      }
    }
    fn()
  }, [
    study?.identifier,
    refreshParticipantsToggle,
    currentPage,
    pageSize,
    token,
  ])

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

  const handleSearchParticipantRequest = async (searchedValue: string) => {
    const result = await ParticipantService.getParticipantWithId(
      study.identifier,
      token!,
      searchedValue,
    )
    const realResult = result ? [result] : null
    const totalParticipantsFound = result ? 1 : 0
    setParticipantData({ items: realResult, total: totalParticipantsFound })
  }

  const handleResetSearch = async () => {
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
      <Box>
        <Box px={3} py={2}>
          Study ID: {study.identifier}
        </Box>

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
                  <img
                    src={LinkIcon}
                    className={classes.buttonImage}
                    alt="link-icon"
                  ></img>
                  App Download Link
                </Button>
              </div>
            )}
          </Box>
        </Box>
        <CollapsibleLayout
          expandedWidth={300}
          isFullWidth={true}
          isHideContentOnClose={true}
          isDrawerHidden={!isEdit}
          collapseButton={<CollapseIcon />}
          expandButton={
            <ExpandIcon style={{ marginLeft: '-3px', marginTop: '8px' }} />
          }
          toggleButtonStyle={{
            display: 'block',
            padding: '0',
            backgroundColor: theme.palette.primary.dark,
          }}
        >
          <>
            <AddParticipants
              study={study}
              token={token!}
              onAdded={() => {
                setRefreshParticipantsToggle(prev => !prev)
              }}
              isGenerateIds={study.clientData.generateIds}
              enrollmentType={study.clientData.enrollmentType || 'ID'}
            ></AddParticipants>
          </>
          <Box py={0} pr={3} pl={2}>
            <Tabs value={tab} variant="fullWidth" onChange={handleTabChange}>
              <Tab label="Item One" />
              <Tab label="Item Two" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <ParticipantSearch
                study={study}
                token={token!}
                onReset={() => handleResetSearch()}
                onSearch={(searchedValue: string) =>
                  handleSearchParticipantRequest(searchedValue)
                }
              />
              <ParticipantTableGrid
                rows={data?.items || []}
                status={status}
                studyId={study.identifier}
                totalParticipants={data?.total || 0}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                isPhoneEnrollmentType={
                  study.clientData.enrollmentType === 'PHONE'
                }
              ></ParticipantTableGrid>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              hello
            </TabPanel>
          </Box>

          <Box textAlign="center" pl={2}>
            ADD A PARTICIPANT
          </Box>
        </CollapsibleLayout>
      </Box>
    )
  }
  return <>bye</>
}
export default ParticipantManager
