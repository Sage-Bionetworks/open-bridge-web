import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Switch,
  Tab,
  Tabs
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Delete'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { CSVReader } from 'react-papaparse'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import ParticipantService from '../../../services/participants.service'
import { poppinsFont } from '../../../style/theme'
import { ParticipantAccountSummary } from '../../../types/types'
import CollapsibleLayout from '../../widgets/CollapsibleLayout'
import HideWhen from '../../widgets/HideWhen'
import TabPanel from '../../widgets/TabPanel'
import StudyTopNav from '../StudyTopNav'
import ParticipantTable, { HeadCell } from './ParticipantTable'

const useStyles = makeStyles(theme => ({
  root: {},
  switchRoot: {
    //padding: '8px'
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
    // color: theme.palette.common.white,
  },
  dropAreaUploading: {
    border: 'none',
    // borderColor: '#000',
    borderRadius: 0,
    height: '200px',
    alignItems: 'center',
    textAlign: 'center',
    // borderStyle: 'dashed',
    // borderWidth: '2px',

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
  /*  fileSizeInfo: {
    color: '#fff',
    backgroundColor: '#000',
    borderRadius: 3,
    lineHeight: 1,
    marginBottom: '0.5em',
    padding: '0 0.4em',
  },
  fileNameInfo: {
    color: '#fff',
    backgroundColor: '#eee',
    borderRadius: 3,
    fontSize: 14,
    lineHeight: 1,
    padding: '0 0.4em',
  },
  removeButton: {
    color: 'blue',
  },*/
  progressBar: {
    backgroundColor: '#3a3a3a',
    height: '2px',
  },
}

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
  studyId?: string
}

interface Data {
  id: string
  [key: string]: string | number
}

const headCells: HeadCell<Data>[] = [
  {
    id: 'phone',
    numeric: false,
    disablePadding: true,
    label: 'Phone',
  },
  {
    id: 'id',
    numeric: true,
    disablePadding: false,
    label: 'Health Code',
  },

  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  {
    id: 'externalId',
    numeric: true,
    disablePadding: false,
    label: 'Reference Id',
  },

  /* {
    id: 'createdOn',
    numeric: true,
    disablePadding: false,
    label: 'createdOn',
  },*/
]

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

function parseCSVToJSON(rows: any[]): Partial<ParticipantAccountSummary>[] {
  const keys = Object.keys(participantRecordTemplate) as keys[]
  let i = 0
  const objects: Partial<ParticipantAccountSummary>[] = []
  for (const row of rows) {
    console.log('row')
    console.log(row.data)
    console.log(JSON.stringify(row.data))
    let index = 0
    let o: Partial<ParticipantAccountSummary> = {}
    // const newParticipant = {...participantRecordTemplate}
    for (const key of keys) {
      o[key] = row.data[index]
      //@ts-ignore
      console.log(o[key])
      index++
    }
    objects.push(o)
  }
  return objects
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = ({
  studyId,
}) => {
  let { id } = useParams<{ id: string }>()
  const [isEdit, setIsEdit] = React.useState(false)
  const [isOpen, setIsOpen] = React.useState(false)
  const [tab, setTab] = React.useState(0)
  const handleError = useErrorHandler()
  const classes = useStyles()
  //if you need search params use the following
  //const { param } = useParams<{ param: string}>()
  //<T> is the type of data you are retrieving
  const { token } = useUserSessionDataState()
  const [isOpenUpload, setIsOpenUpload] = React.useState(false)
  const [isCsvUploaded, setIsCsvUploaded] = React.useState(false)

  const { data, status, error, run, setData } = useAsync<
    ParticipantAccountSummary[]
  >({
    status: 'PENDING',
    data: null,
  })
  const [exportData, setExportData] = React.useState<any[] | null>(null)

  React.useEffect(() => {
    if (!data) {
      return
    }
    const result = data.map(record => {
      return {
        healthCode: record.id,
        clinicVisit: '',
        status: record.status,
        referenceId: record.studyExternalId,
        notes: '',
      }
    })
    setExportData(result)
  }, [data])

  React.useEffect(() => {
    /* if (! studyId) {
          return
      }*/
    ///your async call
    return run(ParticipantService.getParticipants('mtb-user-testing', token!))
  }, [studyId, run])

  const uploadFromCsv = () => {}
  const handleOnDrop = (data: any) => {
    console.log('---------------------------')
    //console.log(data)
    const objects = parseCSVToJSON(data)
    debugger
    setIsCsvUploaded(true)
    console.log(objects)
    console.log('---------------------------')
  }

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: any) => {
    setTab(newValue)
  }

  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    return (
      <>
        <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>{' '}
        <Dialog
          open={isOpenUpload}
          maxWidth="sm"
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle disableTypography className={classes.dialogTitle}>
            <CloudUploadIcon style={{ width: '25px' }}></CloudUploadIcon>
            <span style={{ paddingLeft: '8px' }}>Upload file</span>
            <IconButton
              aria-label="close"
              className={classes.iconButton}
              onClick={() => setIsOpenUpload(false)}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {' '}
            <div
              className={clsx(
                classes.dropAreaUploading,
                isCsvUploaded && classes.dropAreaUploadingWithBorder,
              )}
            >
              {!isCsvUploaded && (
                <CSVReader
                  onDrop={handleOnDrop}
                  onError={handleOnError}
                  style={uploadAreaStyle}
                >
                  <span>Drop CSV file here or click to upload.</span>
                </CSVReader>
              )}
              {isCsvUploaded && (
                <div style={{ height: '100%', padding: '70px 60px' }}>
                  {' '}
                  Uploading
                  <LinearProgress color="secondary" />
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setIsOpenUpload(false)}
              color="secondary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert('import')
              }}
              color="primary"
              variant="contained"
            >
              &nbsp;Save
            </Button>
          </DialogActions>
        </Dialog>
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
        >
          <Paper square style={{ whiteSpace: 'break-spaces' }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="simple tabs example"
            >
              <Tab label="Upload .csv " />
              <Tab label="Enter details" />
            </Tabs>

            <TabPanel value={tab} index={0}>
              <Box>
                <p>
                  To add new participants to your study, we will need the
                  following information by columns:
                </p>
                <ul>
                  <li>
                    <strong>Clinic Visit </strong>(can be updated later)
                  </li>
                  <li>
                    <strong>Reference ID</strong> (Alternate ID for your
                    reference)
                  </li>
                  <li>
                    <strong>Notes</strong> (for your reference)
                  </li>
                </ul>
                Please make sure that your .csv matches this template:
                <br />
                <a href="/participantsPhoneTemplate.csv" download="template">
                  <strong>ParticipantPhones_Template.csv</strong>
                </a>
                <Box mx="auto" my={2} textAlign="center">
                  <Button
                    onClick={() => {
                      setIsCsvUploaded(false)
                      setIsOpenUpload(true)
                    }}
                    color="primary"
                    variant="contained"
                  >
                    Upload CSV File
                  </Button>
                </Box>
              </Box>
            </TabPanel>
            <TabPanel value={tab} index={1}>
              Item Two
            </TabPanel>
          </Paper>

          <Box py={0} pr={3} pl={2}>
            <ParticipantTable
              rows={data || []}
              headCells={headCells}
            ></ParticipantTable>
          </Box>

          <div style={{ width: '100%' }}>ADD A PARTICIPANT</div>
        </CollapsibleLayout>
      </>
    )
  }
  return <>bye</>
}
export default ParticipantManager
