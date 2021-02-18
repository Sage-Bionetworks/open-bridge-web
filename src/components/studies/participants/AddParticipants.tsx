// pick a date util library

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
  FormHelperText,
  LinearProgress,
  Paper,
  Tab,
  Tabs
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Alert from '@material-ui/lab/Alert'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { CSVReader } from 'react-papaparse'
import {
  generateNonambiguousCode,
  isInvalidPhone,
  makePhone
} from '../../../helpers/utility'
import ParticipantService from '../../../services/participants.service'
import { poppinsFont } from '../../../style/theme'
import {
  EnrollmentType,
  ParticipantAccountSummary,
  Phone,
  Study
} from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import DialogTitleWithClose from '../../widgets/DialogTitleWithClose'
import {
  SimpleTextInput,
  SimpleTextLabel
} from '../../widgets/StyledComponents'
import TabPanel from '../../widgets/TabPanel'

interface AddParticipantType {
  clinicVisitDate?: Date
  notes?: string
  referenceId: string
  phone?: Phone
}

const useStyles = makeStyles(theme => ({
  root: {},
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
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

async function addParticipantById(
  studyIdentifier: string,
  token: string,
  referenceId: string,
) {
  const add = await ParticipantService.addParticipant(studyIdentifier, token, {
    externalId: referenceId,
    dataGroups: ['test_user'],
  })
}

async function addParticipantByPhone(
  studyIdentifier: string,
  token: string,
  phone: Phone,
  referenceId?: string,
) {
  if (!referenceId) {
    const studyPrefix = studyIdentifier.substr(0, 3)
    referenceId = `${generateNonambiguousCode(6)}-${studyPrefix}`
  }

  const add = await ParticipantService.addParticipant(studyIdentifier, token, {
    externalId: referenceId,
    dataGroups: ['test_user'],
    phone: phone,
  })
}

// -----------------  Import participants tab control
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

// -----------------  Add participant  tab control
const AddParticipantIdTab: FunctionComponent<{
  onAdd: Function
  enrollmentType: EnrollmentType
  clear: boolean
}> = ({ onAdd, enrollmentType, clear }) => {
  const classes = useStyles()
  const [referenceId, setReferenceId] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [clinicVisitDate, setClinicVisitDate] = React.useState<Date | null>(
    null,
  )
  const [errors, setErrors] = React.useState({
    phone: false,
    referenceId: false,
  })


  React.useEffect(()=> {
    setReferenceId('')
    setNotes('')
    setPhone('')
    setClinicVisitDate(null)

  }, [clear])
  const handleDateChange = (date: Date | null) => {
    setClinicVisitDate(date)
  }

  const isAddDisabled = (): boolean => {
    return (
      (enrollmentType === 'PHONE' && !phone) ||
      (enrollmentType === 'ID' && !referenceId)
    )
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
            value={referenceId}
            onChange={e => setReferenceId(e.target.value)}
          />
        </FormControl>

        <FormControl className={clsx(errors.phone && 'error')}>
          <SimpleTextLabel htmlFor="phone">Phone*</SimpleTextLabel>
          <SimpleTextInput
            placeholder="xxx-xxx-xxxx"
            id="phone"
            fullWidth={true}
            value={phone}
            onBlur={() =>
              setErrors(prev => ({ ...prev, phone: isInvalidPhone(phone) }))
            }
            onChange={e => setPhone(e.target.value)}
          />
          {errors.phone && (
            <FormHelperText id="phone-text">
              phone should be in the format: xxx-xxx-xxxx
            </FormHelperText>
          )}
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
          disabled={isAddDisabled()}
          onClick={() =>
            onAdd({
              referenceId,
              phone: makePhone(phone),
              notes,
              clinicVisitDate,
            })
          }
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
  const [isLoading, setIsLoading] = React.useState(false)
  const [clearParticipantToggle, setClearParticipantToggle]= React.useState(false)
  const [error, setError] = React.useState('')

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

  const addSingleParticipant = async (participant: AddParticipantType) => {
    setError('')
    setIsLoading(true)
    try {
      if (enrollmentType === 'PHONE') {
        await addParticipantByPhone(
          study.identifier,
          token,
          participant.phone!,
          participant.referenceId,
        )
      } else {
        await addParticipantById(
          study.identifier,
          token,
          participant.referenceId,
        )
      }

      onAdded()
      setClearParticipantToggle(prev=> !prev)
    } catch (e: any) {
      setError(e?.message.toString() || e.toString())
    } finally {
      setIsLoading(false)
    }
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
        <Box mx="auto" textAlign="center" mt={1}>
          {isLoading && <CircularProgress size="2em" />}
          {error && <Alert color="error">{error}</Alert>}
        </Box>
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
            enrollmentType={enrollmentType}
            clear={clearParticipantToggle}
            onAdd={(participant: AddParticipantType) => {
              addSingleParticipant(participant)
            }}
          ></AddParticipantIdTab>
        </TabPanel>
      </Paper>
    </>
  )
}
export default AddParticipants
