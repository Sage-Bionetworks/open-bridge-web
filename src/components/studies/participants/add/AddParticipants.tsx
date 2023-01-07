// pick a date util library

import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import Utility from '@helpers/utility'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import {Box, Button, Dialog, DialogActions, DialogContent, LinearProgress, styled, Tab, Tabs} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import EventService from '@services/event.service'
import {ExtendedScheduleEventObject} from '@services/schedule.service'
import {theme} from '@style/theme'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {CSVReader} from 'react-papaparse'
import {ParticipantEvent, Study} from '../../../../types/types'

import CsvUtility from '../csv/csvUtility'
import AddGeneratedParticipant from './AddGeneratedParticipant'
import AddSingleParticipant from './AddSingleParticipant'
import ImportParticipantsInstructions from './ImportParticipantsInstuctions'

const StyledTabs = styled(Tabs, {label: 'StyledTabs '})(({theme}) => ({
  margin: theme.spacing(0),
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(0, 5),

  [`& .MuiTabs-indicator`]: {
    backgroundColor: '#9499C7',
    height: theme.spacing(0.5),
  },
}))

const StyledTabPanel = styled(Box, {label: 'StyledTabPanel '})(({theme}) => ({
  backgroundColor: '#F1F3F5',
  padding: theme.spacing(5, 4, 5, 4),
  fontSize: '14px',
}))

const StyledTab = styled(Tab, {label: 'StyledTab '})(({theme}) => ({
  borderBottomWidth: theme.spacing(0.5),
  backgroundColor: 'transparent',
  padding: 0,
  fontSize: '16px',
  borderBottomColor: theme.palette.background.default,
  borderBottomStyle: 'solid',
  height: '30px',
  '& span.MuiTab-wrapper': {
    flexDirection: 'row',
    '& > *:first-child': {
      marginBottom: 0,
      marginRight: '4px',
    },
  },
  [theme.breakpoints.down('xl')]: {
    minWidth: `100px`,
  },
}))
const useStyles = makeStyles(theme => ({
  titleBar: {
    height: theme.spacing(4),
    lineHeight: theme.spacing(4),
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 500,
    borderBottom: `4px solid #9499C7`,
  },
  dialogTitle: {
    display: 'flex',

    alignItems: 'center',
    fontWeight: 500,
    fontSize: '18px',
  },
  iconButton: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(3),
    padding: 0,
  },
  dropAreaUploading: {
    border: 'none',
    borderRadius: 0,
    height: '200px',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '&$dropAreaUploadingWithBorder': {
      border: '2px dashed #000',
    },
  },
  dropAreaUploadingWithBorder: {},
}))

const uploadAreaStyle = {
  dropArea: {
    borderColor: '#000',
    borderRadius: 0,
    height: '200px',
  },
  dropAreaActive: {
    borderColor: '#ddd',
  },
  dropFile: {
    width: '100%',
    height: 120,
    background: 'none',
  },

  progressBar: {
    backgroundColor: '#3a3a3a',
    height: '2px',
  },
}

type AddParticipantsProps = {
  token: string
  study: Study
  onAdded: () => void
  scheduleEvents: ExtendedScheduleEventObject[]
  isTestAccount: boolean
}

const AddParticipants: FunctionComponent<AddParticipantsProps> = ({
  onAdded,
  study,
  token,
  scheduleEvents,
  isTestAccount,
}) => {
  const [tab, setTab] = React.useState(0)

  const classes = useStyles()
  const generateIds = study.clientData.generateIds
  const isEnrolledById = Utility.isSignInById(study.signInTypes)

  const [isOpenUpload, setIsOpenUpload] = React.useState(false)
  const [isCsvUploaded, setIsCsvUploaded] = React.useState(false)
  const [isCsvProcessed, setIsCsvProcessed] = React.useState(false)
  const [importError, setImportError] = React.useState<string[]>([])
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (!isOpenUpload) {
      setIsCsvUploaded(false)
      setImportError([])
      setProgress(0)
      setIsCsvProcessed(false)
    }
  }, [isOpenUpload])

  const handleOnDrop = async (rows: any) => {
    setImportError([])
    if (!rows[0]?.data) {
      setImportError([...importError, 'Please check the format of your file. No data'])
      return
    }

    const customParticipantEvents: ParticipantEvent[] = scheduleEvents.map(event => ({
      eventId: EventService.formatEventIdForDisplay(event.eventId),
    }))

    const validityCheck = CsvUtility.isImportFileValid(
      isEnrolledById,
      scheduleEvents.map(e => e.eventId),
      rows[0].data
    )
    if (!validityCheck.isValid) {
      setImportError([
        ...importError,
        `Please check the format of your file. Required fields are: ${validityCheck.requiredFields}. Received fields: ${validityCheck.receivedFields}`,
      ])
      return
    }
    const progressTick = 100 / rows.length
    setIsCsvUploaded(true)
    setProgress(0)
    for (const row of rows) {
      const data = row.data

      try {
        await CsvUtility.uploadCsvRow(data, customParticipantEvents, isEnrolledById, study.identifier, token)
        setProgress(prev => prev + progressTick)
      } catch (error) {
        console.log('Error', JSON.stringify(error))
        const key = Object.values(row.data)[0]
        setImportError(prev => [...prev, `${key}: ${(error as Error).message || error}`])
      }
    }
    setIsCsvProcessed(true)
  }

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
  }

  const isAutoGenerated = () => generateIds || isTestAccount

  return (
    <>
      <Dialog open={isOpenUpload} maxWidth="sm" fullWidth aria-labelledby="form-dialog-title">
        <DialogTitleWithClose
          onCancel={() => setIsOpenUpload(false)}
          icon={<CloudUploadIcon />}
          title={'Upload file'}
        />
        <DialogContent>
          <>
            <div className={clsx(classes.dropAreaUploading, isCsvUploaded && classes.dropAreaUploadingWithBorder)}>
              {!isCsvUploaded && (
                <CSVReader
                  onDrop={handleOnDrop}
                  onError={handleOnError}
                  style={uploadAreaStyle}
                  config={{
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                  }}>
                  <span>Drop CSV file here or click to upload.</span>
                </CSVReader>
              )}
              {isCsvUploaded && (
                <div style={{height: '100%', padding: '70px 60px'}}>
                  {!isCsvProcessed && (
                    <>
                      {' '}
                      Uploading
                      <LinearProgress variant="determinate" value={progress} />
                    </>
                  )}
                  {isCsvProcessed && <span>{importError.length > 0 ? 'Completed with errors below' : 'Success'}</span>}
                </div>
              )}
            </div>
            {importError.length > 0 && (
              <Box my={1} color={theme.palette.error.main}>
                <ul>
                  {importError.map((error, index) => (
                    <li key={'import-error' + index}>{error}</li>
                  ))}
                </ul>
              </Box>
            )}
          </>
        </DialogContent>
        <DialogActions>
          <Button disabled={isCsvUploaded} onClick={() => setIsOpenUpload(false)} color="secondary" variant="outlined">
            Cancel
          </Button>
          {isCsvProcessed && (
            <Button
              onClick={() => {
                onAdded()
                setIsOpenUpload(false)
              }}
              color="primary"
              variant="contained">
              &nbsp;Done
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <Box sx={{whiteSpace: 'break-spaces', padding: theme.spacing(5, 0, 0, 0)}}>
        {!isAutoGenerated() && (
          <>
            <StyledTabs
              value={tab}
              variant="fullWidth"
              onChange={handleTabChange}
              sx={{height: theme.spacing(5)}}
              aria-label="add participant tabs">
              <StyledTab label="Upload .csv " />
              <StyledTab label="Enter Details" />
            </StyledTabs>

            <StyledTabPanel sx={{display: tab === 0 ? 'block' : 'none'}}>
              <ImportParticipantsInstructions
                isEnrolledById={isEnrolledById}
                scheduleEventIds={scheduleEvents.map(e => e.eventId)}>
                <Button
                  onClick={() => {
                    setIsCsvUploaded(false)
                    setIsOpenUpload(true)
                  }}
                  color="primary"
                  variant="contained">
                  Upload .csv File
                </Button>
              </ImportParticipantsInstructions>
            </StyledTabPanel>

            <StyledTabPanel sx={{display: tab === 1 ? 'block' : 'none'}}>
              <AddSingleParticipant
                scheduleEvents={scheduleEvents}
                isEnrolledById={isEnrolledById}
                token={token}
                studyIdentifier={study.identifier}
                onAdded={() => onAdded()}></AddSingleParticipant>
            </StyledTabPanel>
          </>
        )}
        {isAutoGenerated() && (
          <>
            <Box
              className={classes.titleBar}
              style={{
                borderColor: isTestAccount ? '#AEDCC9' : theme.palette.secondary.contrastText,
              }}>
              Generate IDs
            </Box>
            <Box p={2}>
              <AddGeneratedParticipant
                token={token}
                studyIdentifier={study.identifier}
                isTestAccount={isTestAccount}
                onAdded={() => onAdded()}></AddGeneratedParticipant>
            </Box>
          </>
        )}
      </Box>
    </>
  )
}
export default AddParticipants
