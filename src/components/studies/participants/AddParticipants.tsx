// pick a date util library

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
  LinearProgress,
  Paper,
  Tab,
  Tabs
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { CSVReader } from 'react-papaparse'
import { latoFont, poppinsFont } from '../../../style/theme'
import {
  EnrollmentType,
  ParticipantAccountSummary,
  Study
} from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import {
  SimpleTextInput,
  SimpleTextLabel
} from '../../widgets/StyledComponents'
import TabPanel from '../../widgets/TabPanel'

const useStyles = makeStyles(theme => ({
  root: {},
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  dateAdornment: {
    position: 'absolute',
    right: '0px',
    top: '20px',
    zIndex: 10,
    ' & button': {
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.light,
      },
    },
  },
  datePicker: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      paddingRight: 0,
      boxShadow: 'none',
      display: 'block',
      position: 'relative',
      border: '1px solid #ced4da',

      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderStyle: 'none',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        borderStyle: 'none',
      },

      '&.Mui-focused': {
        borderColor: theme.palette.primary.light,
      },
    },
    '& input': {
      borderRadius: 0,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      borderStyle: 'none',
      fontSize: '14px',
      width: 'auto',
      padding: '10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: [latoFont, 'Roboto'].join(','),
    },
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

  progressBar: {
    backgroundColor: '#3a3a3a',
    height: '2px',
  },
}

type AddParticipantsProps = {
  token: string
  study: Study
  enrollmentType: 'PHONE' | 'ID'
  onAdded: Function
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

// -----------------  Import participants control
const ImportParticipantTab: FunctionComponent<{
  enrollmentType: EnrollmentType
  children: React.ReactNode
}> = ({ children, enrollmentType }) => {
  const template =
    enrollmentType === 'PHONE' ? (
      <a
        href="/participantsPhoneTemplate.csv"
        download="enrollmentTemplatePhone"
      >
        <strong>ParticipantPhones_Template.csv</strong>
      </a>
    ) : (
      <a href="/participantsPhoneTemplate.csv" download="enrollmentTemplateId">
        <strong>ParticipantIds_Template.csv</strong>
      </a>
    )

  const recList =
    enrollmentType === 'PHONE' ? (
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
    ) : (
      <ul>
        <li>
          <strong>ParticipantID* </strong>
        </li>
        <li>
          <strong>Clinic Visit </strong>(can be updated later)
        </li>
        <li>
          <strong>Notes</strong> (for your reference)
        </li>
      </ul>
    )

  return (
    <Box>
      <p>
        To add <strong>new participants</strong> to your study, we will need the
        following information by columns:
      </p>
      {recList}
      Please make sure that your .csv matches this template:
      <br />
      {template}
      <Box mx="auto" my={2} textAlign="center">
        {children}
      </Box>
    </Box>
  )
}

// -----------------  Add participant control
const AddParticipantIdTab: FunctionComponent<{ onAdd: Function }> = ({
  onAdd,
}) => {
  const classes = useStyles()
  const [isDateControlFocused, setIsDateControlFocused] = React.useState(false)
  const [participantId, setParticipantId] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [clinicVisitDate, setClinicVisitDate] = React.useState<Date | null>(
    null,
  )

  const handleDateChange = (date: Date | null) => {
    setClinicVisitDate(date)
  }

  return (
    <>
      <FormGroup className={classes.addForm}>
        <FormControl>
          <SimpleTextLabel htmlFor="participant-id">
            Participant ID*
          </SimpleTextLabel>
          <SimpleTextInput
            placeholder="xxx-xxx-xxxx"
            id="participant-id"
            fullWidth={true}
            value={participantId}
            onChange={e => setParticipantId(e.target.value)}
          />
        </FormControl>
        <DatePicker
          label="Clinic Visit 1"
          id="clinic-visit"
          value={clinicVisitDate}
          onChange={e => handleDateChange(e)}
        ></DatePicker>

        <FormControl>
          <SimpleTextLabel htmlFor="notes">Notes</SimpleTextLabel>
          <SimpleTextInput
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="comments"
            id="notes"
            multiline={true}
            rows={5}
          />
        </FormControl>
      </FormGroup>

      <Box textAlign="center" my={2}>
        <Button
          color="primary"
          variant="contained"
          disabled={!participantId}
          onClick={() => onAdd({ participantId, notes, clinicVisitDate })}
        >
          +Add to study
        </Button>
      </Box>
    </>
  )
}

const AddParticipants: FunctionComponent<AddParticipantsProps> = ({
  enrollmentType,
  onAdded,
  study,
  token,
}) => {
  console.log(enrollmentType)
  const [tab, setTab] = React.useState(0)

  const classes = useStyles()

  const [isOpenUpload, setIsOpenUpload] = React.useState(false)
  const [isCsvUploaded, setIsCsvUploaded] = React.useState(false)

  const uploadFromCsv = () => {}
  const handleOnDrop = (data: any) => {
    console.log('---------------------------')
    //console.log(data)
    const objects = parseCSVToJSON(data)

    setIsCsvUploaded(true)
    console.log(objects)
    console.log('---------------------------')
  }

  const handleOnError = (err: any, file: any, inputElem: any, reason: any) => {
    console.log(err)
  }

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: any) => {
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

      <Paper square style={{ whiteSpace: 'break-spaces' }}>
        <Tabs
          value={tab}
          onChange={handleTabChange}
          aria-label="simple tabs example"
        >
          <Tab label="Upload .csv " />
          <Tab label="Enter details" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <ImportParticipantTab enrollmentType={enrollmentType}>
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
          </ImportParticipantTab>{' '}
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <AddParticipantIdTab
            onAdd={(item: any) => {
              console.log('add', item)
            }}
          ></AddParticipantIdTab>
        </TabPanel>
      </Paper>
    </>
  )
}
export default AddParticipants
