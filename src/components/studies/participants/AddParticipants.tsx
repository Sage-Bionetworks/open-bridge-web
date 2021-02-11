import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  LinearProgress,
  Paper,
  Radio,
  RadioGroup,
  Tab,
  Tabs
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { CSVReader } from 'react-papaparse'
import { poppinsFont } from '../../../style/theme'
import { ParticipantAccountSummary } from '../../../types/types'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import TabPanel from '../../widgets/TabPanel'

const useStyles = makeStyles(theme => ({
  root: {},

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

  progressBar: {
    backgroundColor: '#3a3a3a',
    height: '2px',
  },
}

type AddParticipantsProps = {
  token: string
  studyId: string
  enrollmentType: 'PHONE' | 'ID'
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

const AddParticipants: FunctionComponent<AddParticipantsProps> = ({
  enrollmentType,
}) => {
  console.log('rerender')
  const [tab, setTab] = React.useState(0)

  const classes = useStyles()
  const [isOpenIdQuestion, setIsOpenIdQuestion] = React.useState(
    enrollmentType === 'ID',
  )
  const [isOpenUpload, setIsOpenUpload] = React.useState(false)
  const [isCsvUploaded, setIsCsvUploaded] = React.useState(false)
  const [shouldGenerateIds, setShouldGenerateIds] = React.useState(false)

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

  return (
    <>
      <Dialog
        open={isOpenUpload}
        maxWidth="sm"
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitleWithClose onCancel={() => setIsOpenUpload(false)}>
          <>
            <CloudUploadIcon style={{ width: '25px' }}></CloudUploadIcon>
            <span style={{ paddingLeft: '8px' }}>Upload file</span>
          </>
        </DialogTitleWithClose>

        <DialogContent>
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

      <Dialog
        open={isOpenIdQuestion}
        maxWidth="sm"
        fullWidth
        aria-labelledby="form-dialog-title"
      >
        <DialogTitleWithClose
          onCancel={() => setIsOpenIdQuestion(false)}
        ></DialogTitleWithClose>
        <DialogContent>
          <div>
            How would you like to generate the Participant IDs?
            <RadioGroup
              aria-label="gender"
              name="gender1"
              value={shouldGenerateIds}
              onChange={e => setShouldGenerateIds(e.target.value === 'true')}
            >
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Define my own IDs"
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Generate new participant IDs for me"
              />
            </RadioGroup>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsOpenIdQuestion(false)}
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
            &nbsp;Continue
          </Button>
        </DialogActions>
      </Dialog>

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
              To add new participants to your study, we will need the following
              information by columns:
            </p>
            <ul>
              <li>
                <strong>Phone Number* </strong>
              </li>
              <li>
                <strong>Clinic Visit </strong>(can be updated later)
              </li>
              <li>
                <strong>Reference ID</strong> (Alternate ID for your reference)
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
    </>
  )
}
export default AddParticipants
