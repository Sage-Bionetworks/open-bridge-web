import {
    Box,

    DialogActions,
    DialogContent,
    FormControl,
    FormGroup,
    FormHelperText,
    makeStyles
} from '@material-ui/core'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { isInvalidPhone } from '../../../helpers/utility'
import { latoFont } from '../../../style/theme'
import { EditableParticipantData, EnrollmentType } from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import { MTBHeadingH3 } from '../../widgets/Headings'
import {
    DialogButtonPrimary,
    DialogButtonSecondary,
    SimpleTextInput,
    SimpleTextLabel
} from '../../widgets/StyledComponents'


const useStyles = makeStyles(theme => ({
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  withdrawalNotice: {
    fontSize: '16px',
    fontFamily: latoFont,

    '& p': {
      marginBottom: '16px',
      marginTop: '0',
    },
  },
}))

type AddParticipantFormProps = {
  participant: EditableParticipantData
  enrollmentType: EnrollmentType

  onChange: (p: EditableParticipantData) => void
}

export type EditParticipantFormProps = {
  enrollmentType: EnrollmentType
  participant: EditableParticipantData
  onOK: Function
  onCancel: Function
  children?: React.ReactNode
}

export const EditParticipantForm: FunctionComponent<EditParticipantFormProps> = ({
  participant,
  enrollmentType,
  onOK,
  onCancel,
  children,
}) => {
  const classes = useStyles()
  const [note, setNotes] = React.useState(participant.note)
  const [clinicVisitDate, setClinicVisitDate] = React.useState<
    Date | undefined
  >(participant.clinicVisitDate)

  const handleDateChange = (date: Date | null) => {
    setClinicVisitDate(date ? date : undefined)
  }

  return (
    <>
      <DialogContent>
        <Box mt={0} mb={3}>
          <MTBHeadingH3>
            {enrollmentType === 'ID' && (
              <span>Reference ID: {participant.externalId}</span>
            )}
            {enrollmentType === 'PHONE' && (
              <span>Phone number: {participant.phoneNumber}</span>
            )}
          </MTBHeadingH3>
        </Box>

        <FormGroup className={classes.addForm}>
          <DatePicker
            label="Clinic Visit 1"
            id="clinic-visit"
            value={clinicVisitDate || null}
            onChange={e => handleDateChange(e)}
          ></DatePicker>

          <FormControl>
            <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
            <SimpleTextInput
              value={note}
              placeholder="comments"
              onChange={e => setNotes(e.target.value)}
              id="note"
              multiline={true}
              rows={5}
            />
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'space-between' }}>
        {children && children}
        <div>
          <DialogButtonSecondary onClick={() => onCancel()} color="primary">
            Cancel
          </DialogButtonSecondary>
          <DialogButtonPrimary
         
            onClick={() => onOK(note, clinicVisitDate)}
            color="primary"
            autoFocus
          >
            Save Changes
          </DialogButtonPrimary>
        </div>
      </DialogActions>
    </>
  )
}

export const WithdrawParticipantForm: FunctionComponent<{
  enrollmentType: EnrollmentType
  participant: EditableParticipantData
  onOK: Function
  onCancel: Function
}> = ({ enrollmentType, participant, onOK, onCancel }) => {
  const classes = useStyles()
  const [note, setNote] = React.useState('')
  return (
    <>
      <DialogContent>
        <Box className={classes.withdrawalNotice}>
          <p>
            Withdrawing means you will no longer collect data on this
            participant and will not be able to contact them through the app.
          </p>
          <p>
            Are you sure you would like to withdraw the following participant:
          </p>
          <p>
            {enrollmentType === 'PHONE'
              ? participant.phoneNumber
              : participant.externalId}{' '}
          </p>
          <p>
            <strong>This action cannot be undone.</strong>
          </p>
        </Box>
        <FormGroup>
          <FormControl>
            <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
            <SimpleTextInput
              fullWidth
              rowsMax={5}
              inputProps={{ maxLength: 256 }}
              placeholder="note"
              onChange={e => setNote(e.target.value)}
              id="note"
              multiline={true}
              rows={5}
            />
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <DialogButtonSecondary onClick={() => onCancel()} color="primary">
          Cancel
        </DialogButtonSecondary >
        <DialogButtonPrimary onClick={() => onOK(note)} color="primary" autoFocus>
          Yes, withdraw participant
        </DialogButtonPrimary>
      </DialogActions>
    </>
  )
}

export const AddParticipantForm: FunctionComponent<AddParticipantFormProps> = ({
  participant,
  enrollmentType,
  onChange,
}) => {
  const classes = useStyles()
  const [validationErrors, setValidationErrors] = React.useState({
    phone: false,
    externalId: false,
  })

  const handleDateChange = (date: Date | null) => {
    onChange({ ...participant, clinicVisitDate: date || undefined })
  }

  const extId = (
    <FormControl>
      <SimpleTextLabel htmlFor="participant-id">
        {`Participant ID${enrollmentType === 'ID' ? '*' : ''}`}
      </SimpleTextLabel>
      <SimpleTextInput
        placeholder="xxx-xxx-xxxx"
        id="participant-id"
        fullWidth={true}
        value={participant.externalId}
        onChange={e => onChange({ ...participant, externalId: e.target.value })}
      />
    </FormControl>
  )

  return (
    <>
      <FormGroup className={classes.addForm}>
        {enrollmentType === 'ID' && extId}
        {enrollmentType === 'PHONE' && (
          <>
            <FormControl className={clsx(validationErrors.phone && 'error')}>
              <SimpleTextLabel htmlFor="phone">Phone Number*</SimpleTextLabel>
              <SimpleTextInput
                placeholder="xxx-xxx-xxxx"
                id="phone"
                fullWidth={true}
                value={participant.phoneNumber || ''}
                onBlur={() =>
                  setValidationErrors(prev => ({
                    ...prev,
                    phone: isInvalidPhone(participant.phoneNumber || ''),
                  }))
                }
                onChange={e =>
                  onChange({ ...participant, phoneNumber: e.target.value })
                }
              />
              {validationErrors.phone && (
                <FormHelperText id="phone-text">
                  phone should be in the format: xxx-xxx-xxxx
                </FormHelperText>
              )}
            </FormControl>
            {extId}
          </>
        )}
        <DatePicker
          label="Clinic Visit 1"
          id="clinic-visit"
          value={participant.clinicVisitDate || null}
          onChange={e => handleDateChange(e)}
        ></DatePicker>

        <FormControl>
          <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
          <SimpleTextInput
            value={participant.note}
            onChange={e => onChange({ ...participant, note: e.target.value })}
            placeholder="comments"
            id="note"
            multiline={true}
            rows={5}
          />
        </FormControl>
      </FormGroup>
    </>
  )
}
