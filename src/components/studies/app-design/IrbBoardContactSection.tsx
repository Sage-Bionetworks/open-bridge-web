import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import Utility from '../../../helpers/utility'
import {Contact} from '../../../types/types'
import AlertWithTextWrapper from '../../widgets/AlertWithTextWrapper'
import SaveButton from '../../widgets/SaveButton'
import {ContactType} from './AppDesign'
import FormGroupWrapper from './widgets/FormGroupWrapper'
import Subsection from './widgets/Subsection'
import TextInputWrapper from './widgets/TextInputWrapper'

const useStyles = makeStyles(theme => ({
  irbInputFormControl: {
    width: '100%',
    marginBottom: theme.spacing(1.5),
  },
  irbInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}))

type IrbBoardContactSectionProps = {
  SimpleTextInputStyles: React.CSSProperties
  irbNameSameAsInstitution: boolean
  getContactPersonObject: (type: ContactType) => Contact
  setIrbNameSameAsInstitution: Function
  phoneNumberErrorState: {
    isGeneralContactPhoneNumberValid: boolean
    isIrbPhoneNumberValid: boolean
  }
  setPhoneNumberErrorState: Function
  irbPhoneNumber: string
  setIrbPhoneNumber: Function
  emailErrorState: {
    isGeneralContactEmailValid: boolean
    isIrbEmailValid: boolean
  }
  setEmailErrorState: Function
  saveLoader: boolean
  saveInfo: Function
  onUpdate: (irbInfo: Contact, protocolId: string) => void
  irbInfo: Contact
  protocolId: string
  getContactName: Function
  irbNameHasError: boolean
  irbProtocolIdHasError: boolean
}

const IrbBoardContactSection: React.FunctionComponent<IrbBoardContactSectionProps> =
  ({
    SimpleTextInputStyles,
    irbNameSameAsInstitution,
    getContactPersonObject,
    setIrbNameSameAsInstitution,
    phoneNumberErrorState,
    setPhoneNumberErrorState,
    irbPhoneNumber,
    setIrbPhoneNumber,
    emailErrorState,
    setEmailErrorState,
    saveLoader,
    saveInfo,
    onUpdate,
    protocolId,
    irbInfo,
    getContactName,
    irbNameHasError,
    irbProtocolIdHasError,
  }) => {
    const classes = useStyles()
    return (
      <Subsection heading="IRB or Ethics Board Contact">
        <Box
          width="80%"
          mt={1.5}
          fontSize="15px"
          lineHeight="18px"
          fontFamily="Lato"
          mb={2}>
          For questions about your rights as a research participant in this
          study, please contact :
        </Box>
        <FormGroupWrapper>
          <Box pl={0.25} mt={1}>
            What is your IRB of record?*
          </Box>
          <Box width="100%" boxSizing="border-box" mt={1} pl={6} pr={1}>
            <RadioGroup
              aria-label="gender"
              value={
                irbNameSameAsInstitution
                  ? 'affiliation_same'
                  : 'affiliation_other'
              }
              onChange={e => {
                if (e.target.value === 'affiliation_same') {
                  const studyLeadObject = getContactPersonObject(
                    'principal_investigator'
                  )
                  const newEthicsBoardObject = getContactPersonObject('irb')
                  newEthicsBoardObject.name = studyLeadObject.affiliation || ''
                  onUpdate(newEthicsBoardObject, protocolId)
                }
                setIrbNameSameAsInstitution(
                  e.target.value === 'affiliation_same'
                )
              }}
              style={{marginBottom: '8px'}}>
              <FormControlLabel
                value="affiliation_same"
                control={<Radio color="secondary" />}
                label="Same Institutional Affiliation"
                id="affiliation-same-radio-button"
              />
              <FormControlLabel
                value="affiliation_other"
                control={<Radio color="secondary" />}
                label="Other"
                id="affiliation-other-radio-button"
              />
            </RadioGroup>
            <FormControl className={classes.irbInputFormControl}>
              <TextInputWrapper
                SimpleTextInputStyles={
                  {
                    fontSize: '15px',
                    width: '100%',
                    height: '44px',
                    boxSizing: 'border-box',
                  } as React.CSSProperties
                }
                id="ethics-board-input"
                placeholder="Name IRB of record"
                value={getContactName(irbInfo.name)}
                onChange={(
                  e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  const newEthicsBoardBoard = getContactPersonObject('irb')
                  newEthicsBoardBoard.name = e.target.value
                  onUpdate(newEthicsBoardBoard, protocolId)
                }}
                titleText=""
                readOnly={irbNameSameAsInstitution}
                hasError={irbNameHasError}
              />
            </FormControl>
          </Box>
          <FormControl
            className={clsx(
              !phoneNumberErrorState.isIrbPhoneNumberValid && 'error'
            )}>
            <TextInputWrapper
              SimpleTextInputStyles={SimpleTextInputStyles}
              id="ethics-phone-number-input"
              placeholder="xxx-xxx-xxxx"
              value={irbPhoneNumber}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                setIrbPhoneNumber(e.target.value)
              }}
              onBlur={() => {
                const isInvalidPhoneNumber =
                  Utility.isInvalidPhone(irbPhoneNumber) &&
                  irbPhoneNumber !== ''
                setPhoneNumberErrorState(
                  (prevState: typeof phoneNumberErrorState) => {
                    return {
                      ...prevState,
                      isIrbPhoneNumberValid: !isInvalidPhoneNumber,
                    }
                  }
                )
                const newEthicsBoardObject = getContactPersonObject('irb')
                newEthicsBoardObject.phone = Utility.makePhone(irbPhoneNumber)
                onUpdate(newEthicsBoardObject, protocolId)
              }}
              titleText="Phone Number*"
            />
            {!phoneNumberErrorState.isIrbPhoneNumberValid && (
              <AlertWithTextWrapper text="Format should be XXX-XXX-XXXX"></AlertWithTextWrapper>
            )}
          </FormControl>
          <FormControl
            className={clsx(!emailErrorState.isIrbEmailValid && 'error')}>
            <TextInputWrapper
              SimpleTextInputStyles={SimpleTextInputStyles}
              id="ethics-email-input"
              placeholder="Institutional Email"
              value={irbInfo.email || ''}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                const newEthicsBoardObject = getContactPersonObject('irb')
                newEthicsBoardObject.email = e.target.value
                onUpdate(newEthicsBoardObject, protocolId)
              }}
              onBlur={() => {
                const validEmail =
                  Utility.isValidEmail(irbInfo.email || '') || !irbInfo.email
                setEmailErrorState((prevState: typeof emailErrorState) => {
                  return {
                    ...prevState,
                    isIrbEmailValid: validEmail,
                  }
                })
              }}
              titleText="Email*"
            />
            {!emailErrorState.isIrbEmailValid && (
              <AlertWithTextWrapper text="Email should be in a valid format such as: example@placeholder.com"></AlertWithTextWrapper>
            )}
          </FormControl>
          <FormControl>
            <TextInputWrapper
              SimpleTextInputStyles={SimpleTextInputStyles}
              id="IRB-approval-input"
              placeholder="XXXXXXXXXX"
              value={protocolId}
              onChange={(
                e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
              ) => {
                onUpdate(irbInfo, e.target.value)
              }}
              titleText="IRB Protocol ID*"
              hasError={irbProtocolIdHasError}
            />
          </FormControl>
        </FormGroupWrapper>
        <Box textAlign="left">
          {saveLoader ? (
            <div className="text-center">
              <CircularProgress color="primary" size={25} />
            </div>
          ) : (
            <SaveButton
              onClick={() => saveInfo()}
              id="save-button-study-builder-2"
            />
          )}
        </Box>
      </Subsection>
    )
  }

export default IrbBoardContactSection
