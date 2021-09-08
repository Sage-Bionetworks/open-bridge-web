// pick a date util library

import {ReactComponent as PencilIcon} from '@assets/edit_pencil.svg'
import {ReactComponent as UploadIcon} from '@assets/upload.svg'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import Utility from '@helpers/utility'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  LinearProgress,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import EventService from '@services/event.service'
import {poppinsFont, theme} from '@style/theme'
import {SchedulingEvent} from '@typedefs/scheduling'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {CSVReader} from 'react-papaparse'
import {ParticipantEvent, Study} from '../../../../types/types'
import {BlueButton} from '../../../widgets/StyledComponents'
import TabPanel from '../../../widgets/TabPanel'
import CsvUtility from '../csv/csvUtility'
import AddGeneratedParticipant from './AddGeneratedParticipant'
import AddSingleParticipant from './AddSingleParticipant'
import ImportParticipantsInstructions from './ImportParticipantsInstuctions'
const useStyles = makeStyles(theme => ({
  root: {},
  tab: {
    borderBottomWidth: theme.spacing(0.5),
    borderBottomColor: theme.palette.background.default,
    borderBottomStyle: 'solid',
    minHeight: '50px',
    '& span.MuiTab-wrapper': {
      flexDirection: 'row',
      '& > *:first-child': {
        marginBottom: 0,
        marginRight: '6px',
      },
    },
    [theme.breakpoints.down('lg')]: {
      minWidth: `110px`,
    },
  },
  tabIndicator: {
    backgroundColor: theme.palette.secondary.contrastText,
    height: theme.spacing(0.5),
  },
  titleBar: {
    height: theme.spacing(6),
    lineHeight: `${theme.spacing(6)}px`,
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 500,
    borderBottom: `4px solid ${theme.palette.secondary.contrastText}`,
  },
  dialogTitle: {
    display: 'flex',
    fontFamily: poppinsFont,
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
  onAdded: Function
  customStudyEvents: SchedulingEvent[]
  isTestAccount: boolean
}

const AddParticipants: FunctionComponent<AddParticipantsProps> = ({
  onAdded,
  study,
  token,
  customStudyEvents,
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
      setImportError([...importError, 'Please check the format of your file'])
      return
    }

    const customParticipantEvents: ParticipantEvent[] = customStudyEvents.map(
      e => ({
        eventId: EventService.formatCustomEventIdForDisplay(e.eventId),
      })
    )

    const isValid = CsvUtility.isImportFileValid(
      isEnrolledById,
      customStudyEvents,
      rows[0].data
    )
    if (!isValid) {
      setImportError([...importError, 'Please check the format of your file'])
      return
    }
    const progressTick = 100 / rows.length
    setIsCsvUploaded(true)
    setProgress(0)
    for (const row of rows) {
      console.log(progress)
      const data = row.data
      try {
        await CsvUtility.uploadCsvRow(
          data,
          customParticipantEvents,
          isEnrolledById,
          study.identifier,
          token
        )
        setProgress(prev => prev + progressTick)
      } catch (error) {
        console.log('error', importError.length)
        console.log(importError)

        const key = data[0]
        setImportError(prev => [...prev, `${key}: ${error.message || error}`])
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
      <Dialog
        open={isOpenUpload}
        maxWidth="sm"
        fullWidth
        aria-labelledby="form-dialog-title">
        <DialogTitleWithClose onCancel={() => setIsOpenUpload(false)}>
          <>
            <CloudUploadIcon style={{width: '25px'}}></CloudUploadIcon>
            <span style={{paddingLeft: '8px'}}>Upload file</span>
          </>
        </DialogTitleWithClose>

        <DialogContent>
          <>
            <div
              className={clsx(
                classes.dropAreaUploading,
                isCsvUploaded && classes.dropAreaUploadingWithBorder
              )}>
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
                  {isCsvProcessed && (
                    <span>
                      {importError.length > 0
                        ? 'Completed with errors below'
                        : 'Success'}
                    </span>
                  )}
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
          <Button
            disabled={isCsvUploaded}
            onClick={() => setIsOpenUpload(false)}
            color="secondary"
            variant="outlined">
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

      <Paper square style={{whiteSpace: 'break-spaces'}}>
        {!isAutoGenerated() && (
          <>
            <Tabs
              value={tab}
              variant="fullWidth"
              onChange={handleTabChange}
              aria-label="add participant tabs"
              classes={{
                indicator: classes.tabIndicator,
              }}>
              <Tab
                label="Upload .csv "
                icon={<UploadIcon />}
                className={classes.tab}
              />
              <Tab
                label="Enter details"
                icon={<PencilIcon />}
                className={classes.tab}
              />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <ImportParticipantsInstructions
                isEnrolledById={isEnrolledById}
                studyEvents={customStudyEvents}>
                <BlueButton
                  onClick={() => {
                    setIsCsvUploaded(false)
                    setIsOpenUpload(true)
                  }}
                  color="primary"
                  variant="contained">
                  <UploadIcon style={{marginRight: '3px', marginTop: '3px'}} />{' '}
                  Upload CSV File
                </BlueButton>
              </ImportParticipantsInstructions>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              <AddSingleParticipant
                customStudyEvents={customStudyEvents}
                isEnrolledById={isEnrolledById}
                token={token}
                studyIdentifier={study.identifier}
                onAdded={() => onAdded()}></AddSingleParticipant>
            </TabPanel>
          </>
        )}
        {isAutoGenerated() && (
          <>
            <Box
              className={classes.titleBar}
              style={{
                borderColor: isTestAccount
                  ? '#AEDCC9'
                  : theme.palette.secondary.contrastText,
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
      </Paper>
    </>
  )
}
export default AddParticipants
