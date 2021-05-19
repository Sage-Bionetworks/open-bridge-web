import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import { FormControl, FormGroup, Box, FormHelperText } from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { playfairDisplayFont, poppinsFont } from '../../../style/theme'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import { AppDesignUpdateTypes } from './AppDesign'
import clsx from 'clsx'
import { isInvalidPhone, isValidEmail } from '../../../helpers/utility'
import { makePhone } from '../../../helpers/utility'
import FormGroupWrapper from './FormGroupWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
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
        marginTop="12px"
        fontSize="15px"
        lineHeight="18px"
        fontFamily="Lato"
      >
        For general questions about the study or to <strong>withdraw</strong>{' '}
        from the study, who should the participant contact?{' '}
      </Box>
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <SimpleTextLabel htmlFor="contact-lead-input">
            Contact Lead*
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="contact-lead-input"
            placeholder="First and Last name"
            value={appDesignProperties.contactLeadInfo?.name || ''}
            onChange={e => {
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
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
        </FormControl>
        <FormControl>
          <SimpleTextLabel htmlFor="role-in-study-input">
            Role in the Study*
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="role-in-study-input"
            placeholder="Title of Position"
            value={appDesignProperties.contactLeadInfo?.position || ''}
            onChange={e => {
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
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
        </FormControl>
        <FormControl
          className={clsx(
            !phoneNumberErrorState.isGeneralContactPhoneNumberValid && 'error',
          )}
        >
          <SimpleTextLabel htmlFor="phone-number-contact-input">
            Phone Number*
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="phone-number-contact-input"
            placeholder="xxx-xxx-xxxx"
            value={generalContactPhoneNumber}
            onChange={e => {
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
            inputProps={{
              style: SimpleTextInputStyles,
            }}
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
          <SimpleTextLabel htmlFor="contact-email-input">
            Email*
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="contact-email-input"
            placeholder="Institutional Email"
            value={appDesignProperties.contactLeadInfo?.email || ''}
            onChange={e => {
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
            inputProps={{
              style: SimpleTextInputStyles,
            }}
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
