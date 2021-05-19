import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import { FormControl, Box, FormHelperText } from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { AppDesignUpdateTypes } from './AppDesign'
import clsx from 'clsx'
import { isInvalidPhone, isValidEmail } from '../../../helpers/utility'
import { makePhone } from '../../../helpers/utility'
import FormGroupWrapper from './FormGroupWrapper'
import TextInputWrapper from './TextInputWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  errorText: {
    marginTop: theme.spacing(-0.5),
  },
}))

type GeneralContactAndSupportSectionProps = {
  appDesignProperties: StudyAppDesign
  setAppDesignProperties: Function
  updateAppDesignInfo: Function
  SimpleTextInputStyles: React.CSSProperties
  getContact: Function
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
}

const GeneralContactAndSupportSection: React.FunctionComponent<GeneralContactAndSupportSectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  updateAppDesignInfo,
  SimpleTextInputStyles,
  getContact,
  phoneNumberErrorState,
  generalContactPhoneNumber,
  setGeneralContactPhoneNumber,
  emailErrorState,
  setEmailErrorState,
  setPhoneNumberErrorState,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="General Contact and Support">
      <Box
        width="80%"
        mt={1.5}
        fontSize="15px"
        lineHeight="18px"
        fontFamily="Lato"
      >
        For general questions about the study or to <strong>withdraw</strong>{' '}
        from the study, who should the participant contact?{' '}
      </Box>
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="contact-lead-input"
            placeholder="First and Last name"
            value={appDesignProperties.contactLeadInfo?.name || ''}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              const newContactLead = getContact('CONTACT')
              newContactLead.name = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                contactLeadInfo: newContactLead,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }
            multiline={true}
            rows={1}
            rowsMax={1}
            titleText="Contact Lead*"
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="role-in-study-input"
            placeholder="Title of Position"
            value={appDesignProperties.contactLeadInfo?.position || ''}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              const newContactLead = getContact('CONTACT')
              newContactLead.position = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                contactLeadInfo: newContactLead,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }
            multiline
            rows={1}
            rowsMax={1}
            titleText="Role in the Study*"
          />
        </FormControl>
        <FormControl
          className={clsx(
            !phoneNumberErrorState.isGeneralContactPhoneNumberValid && 'error',
          )}
        >
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="phone-number-contact-input"
            placeholder="xxx-xxx-xxxx"
            value={generalContactPhoneNumber}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              setGeneralContactPhoneNumber(e.target.value)
            }}
            onBlur={() => {
              const isInvalidPhoneNumber =
                isInvalidPhone(generalContactPhoneNumber) &&
                generalContactPhoneNumber !== ''
              setPhoneNumberErrorState(
                (prevState: typeof phoneNumberErrorState) => {
                  return {
                    ...prevState,
                    isGeneralContactPhoneNumberValid: !isInvalidPhoneNumber,
                  }
                },
              )
              const newContactLead = getContact('CONTACT')
              newContactLead.phone = makePhone(generalContactPhoneNumber)
              setAppDesignProperties({
                ...appDesignProperties,
                contactLeadInfo: newContactLead,
              })
            }}
            multiline
            rows={1}
            rowsMax={1}
            titleText="Phone Number*"
          />
          {!phoneNumberErrorState.isGeneralContactPhoneNumberValid && (
            <FormHelperText
              id="general-contact-phone-text"
              className={classes.errorText}
            >
              phone should be in the format: xxx-xxx-xxxx
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          className={clsx(
            !emailErrorState.isGeneralContactEmailValid && 'error',
          )}
        >
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="contact-email-input"
            placeholder="Institutional Email"
            value={appDesignProperties.contactLeadInfo?.email || ''}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              const newContactLead = getContact('CONTACT')
              newContactLead.email = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                contactLeadInfo: newContactLead,
              })
            }}
            onBlur={() => {
              const validEmail =
                isValidEmail(
                  appDesignProperties.contactLeadInfo?.email || '',
                ) || !appDesignProperties.contactLeadInfo?.email
              setEmailErrorState((prevState: typeof emailErrorState) => {
                return {
                  ...prevState,
                  isGeneralContactEmailValid: validEmail,
                }
              })
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }}
            multiline
            rows={1}
            rowsMax={1}
            titleText="Email*"
          />
          {!emailErrorState.isGeneralContactEmailValid && (
            <FormHelperText
              id="general-contact-email-text"
              className={classes.errorText}
            >
              email should be in a valid format such as: example@placeholder.com
            </FormHelperText>
          )}
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default GeneralContactAndSupportSection
