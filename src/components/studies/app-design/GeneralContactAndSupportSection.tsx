import {FormControl, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import Utility from '../../../helpers/utility'
import {Contact} from '../../../types/types'
import AlertWithTextWrapper from '../../widgets/AlertWithTextWrapper'
import {ContactType} from './AppDesign'
import FormGroupWrapper from './widgets/FormGroupWrapper'
import Subsection from './widgets/Subsection'
import TextInputWrapper from './widgets/TextInputWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  bottomEmailErrorText: {
    marginBottom: theme.spacing(-6),
  },
}))

type GeneralContactAndSupportSectionProps = {
  SimpleTextInputStyles: React.CSSProperties
  getContactPersonObject: (type: ContactType) => Contact
  phoneNumberErrorState: {
    isGeneralContactPhoneNumberValid: boolean
    isIrbPhoneNumberValid: boolean
  }
  generalContactPhoneNumber: string
  setGeneralContactPhoneNumber: Function
  emailErrorState: {
    isGeneralContactEmailValid: boolean
    isIrbEmailValid: boolean
  }
  setEmailErrorState: Function
  setPhoneNumberErrorState: Function
  onUpdate: (contactLead: Contact) => void
  contactLead: Contact
  getContactName: Function
  contactLeadNameHasError: boolean
  contactLeadPositionHasError: boolean
}

const GeneralContactAndSupportSection: React.FunctionComponent<GeneralContactAndSupportSectionProps> = ({
  SimpleTextInputStyles,
  getContactPersonObject,
  phoneNumberErrorState,
  generalContactPhoneNumber,
  setGeneralContactPhoneNumber,
  emailErrorState,
  setEmailErrorState,
  setPhoneNumberErrorState,
  onUpdate,
  contactLead,
  getContactName,
  contactLeadNameHasError,
  contactLeadPositionHasError,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="General Contact and Support" variant="h5">
      <Typography variant="body1">
        For general questions about the study or to <strong>withdraw</strong> from the study, who should the participant
        contact?{' '}
      </Typography>
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="contact-lead-input"
            placeholder="First and Last name"
            value={getContactName(contactLead.name)}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const newContactLeadObject = getContactPersonObject('study_support')
              newContactLeadObject.name = e.target.value
              onUpdate(newContactLeadObject)
            }}
            titleText="Contact Lead*"
            hasError={contactLeadNameHasError}
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="role-in-study-input"
            placeholder="Title of Position"
            value={contactLead.position || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const newContactLeadObject = getContactPersonObject('study_support')
              newContactLeadObject.position = e.target.value
              onUpdate(newContactLeadObject)
            }}
            titleText="Role in the Study*"
            hasError={contactLeadPositionHasError}
          />
        </FormControl>
        <FormControl className={clsx(!phoneNumberErrorState.isGeneralContactPhoneNumberValid && 'error')}>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="phone-number-contact-input"
            placeholder="xxx-xxx-xxxx"
            value={generalContactPhoneNumber}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              setGeneralContactPhoneNumber(e.target.value)
            }}
            onBlur={() => {
              const isInvalidPhoneNumber =
                Utility.isInvalidPhone(generalContactPhoneNumber) && generalContactPhoneNumber !== ''
              setPhoneNumberErrorState((prevState: typeof phoneNumberErrorState) => {
                return {
                  ...prevState,
                  isGeneralContactPhoneNumberValid: !isInvalidPhoneNumber,
                }
              })
              const newContactLeadObject = getContactPersonObject('study_support')
              newContactLeadObject.phone = Utility.makePhone(generalContactPhoneNumber)
              onUpdate(newContactLeadObject)
            }}
            titleText="Phone Number"
          />
          {!phoneNumberErrorState.isGeneralContactPhoneNumberValid && (
            <AlertWithTextWrapper text="Format should be XXX-XXX-XXXX"></AlertWithTextWrapper>
          )}
        </FormControl>
        <FormControl className={clsx(!emailErrorState.isGeneralContactEmailValid && 'error')}>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="contact-email-input"
            placeholder="Institutional Email"
            value={contactLead?.email || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const newContactLeadObject = getContactPersonObject('study_support')
              newContactLeadObject.email = e.target.value
              onUpdate(newContactLeadObject)
            }}
            onBlur={() => {
              const validEmail = Utility.isValidEmail(contactLead?.email || '') || !contactLead?.email
              setEmailErrorState((prevState: typeof emailErrorState) => {
                return {
                  ...prevState,
                  isGeneralContactEmailValid: validEmail,
                }
              })
            }}
            titleText="Email*"
          />
          {!emailErrorState.isGeneralContactEmailValid && (
            <AlertWithTextWrapper
              text="Email should be in a valid format such as: example@placeholder.com"
              className={classes.bottomEmailErrorText}></AlertWithTextWrapper>
          )}
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default GeneralContactAndSupportSection
