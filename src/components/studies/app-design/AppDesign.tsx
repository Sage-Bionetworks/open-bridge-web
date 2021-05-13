import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormGroup,
  Paper,
  Switch,
  Checkbox,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import PhoneBg from '../../../assets/appdesign/phone_bg.svg'
import { ReactComponent as PhoneBottomImg } from '../../../assets/appdesign/phone_buttons.svg'
import { makePhone } from '../../../helpers/utility'
import {
  latoFont,
  playfairDisplayFont,
  poppinsFont,
  ThemeType,
} from '../../../style/theme'
import {
  StudyBuilderComponentProps,
  Contact,
  WelcomeScreenData,
  StudyAppDesign,
  Study,
} from '../../../types/types'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import DefaultLogo from '../../../assets/logo_mtb.svg'
import clsx from 'clsx'
import { useUserSessionDataState } from '../../../helpers/AuthContext'
import SectionIndicator from './SectionIndicator'
import { isInvalidPhone, isValidEmail } from '../../../helpers/utility'
import StudyPagePhoneContent from './StudyPagePhoneContent'
import WelcomeScreenPhoneContent from './WelcomeScreenPhoneContent'
import Subsection from './Subsection'
import UploadStudyLogoSection from './UploadStudyLogoSection'
import ColorPickerSection from './ColorPickerSection'
import WelcomeScreenMessagingSection from './WelcomeScreenMessagingSection'
import StudySummarySection from './StudySummarySection'
import StudyLeadInformationSection from './StudyLeadInformationSection'
import GeneralContactAndSupportSection from './GeneralContactAndSupportSection'

const imgHeight = 70

const useStyles = makeStyles((theme: ThemeType) => ({
  root: { counterReset: 'orderedlist' },
  section: {
    padding: theme.spacing(9, 9, 10, 17),
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(9),
      paddingRight: theme.spacing(2),
    },
  },
  steps: {
    listStyleType: 'none',
    margin: theme.spacing(5, 0, 0, 0),
    padding: 0,

    '& li': {
      display: 'flex',
      marginBottom: theme.spacing(6),
      textAlign: 'left',
    },

    '& li::before': {
      counterIncrement: 'orderedlist',
      content: 'counter(orderedlist)',
      flexShrink: 0,

      textAlign: 'center',
      color: '#fff',
      backgroundColor: '#000',
      borderRadius: '50%',
      width: theme.spacing(5),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(-8),
      height: theme.spacing(5),
    },
  },

  intro: {
    fontFamily: latoFont,
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: theme.spacing(2),
  },
  formFields: {
    fontFamily: poppinsFont,
    fontSize: '14px',
    marginBottom: '24px',

    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: '16px',
    },
  },
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
  phoneArea: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(3),
    width: theme.spacing(41),
  },
  phone: {
    display: 'flex',
    flexDirection: 'column',
    backgroundImage: 'url(' + PhoneBg + ')',
    width: '100%',
    minHeight: '600px',
    marginTop: theme.spacing(4),
    backgroundRepeat: 'no-repeat',
    justifyContent: 'space-between',
    wordWrap: 'break-word',
  },

  phoneBottom: {
    height: '70px',
    overflow: 'hidden',
    marginBottom: theme.spacing(-3),
    width: '320px',
    marginLeft: '5px',
    border: '4px solid black',
    borderTop: '0px none transparent',
    borderRadius: '0 0px 24px 24px',
  },
  phoneTopBar: {
    width: '320px',
    marginLeft: '5px',
    height: `${imgHeight + 16}px`,
    borderRadius: '25px 25px 0 0',
    borderStyle: 'solid',
    borderWidth: '3px 3px 0px 3px',
    borderColor: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  preview: {
    backgroundColor: '#EBEBEB',
    padding: '0 .8rem',
    fontSize: '1.6rem',
    //margin: '0 -50px 30px -50px',

    '& > div': {
      padding: '15px 13px',
    },
    '& img': {
      width: '100%',
    },
  },
  fields: {
    display: 'flex',
    textAlign: 'left',

    flexGrow: 1,
    flexDirection: 'column',
    maxWidth: theme.spacing(51),
    //marginRight: theme.spacing(10),
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  smallScreenText: {
    fontSize: '15px',
    marginTop: theme.spacing(3.75),
    whiteSpace: 'pre-wrap',
  },
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    fontSize: '16px',
    lineHeight: '19px',
    fontFamily: 'Lato',
    alignItems: 'center',
    fontWeight: 'bold',
    marginTop: theme.spacing(1.25),
    marginBottom: theme.spacing(4),
  },
  hideSection: {
    display: 'none',
  },
  hideSectionVisibility: {
    visibility: 'hidden',
  },
  errorText: {
    marginTop: theme.spacing(-0.5),
  },
  sectionOneIndicatorPosition: {
    position: 'absolute',
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(-1.5),
  },
  sectionTwoIndicatorPosition: {
    position: 'absolute',
    marginTop: theme.spacing(6),
    marginLeft: theme.spacing(-1.5),
  },
  irbInputFormControl: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  irbInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },

  optionalDisclaimerTextOnPhone: {
    fontSize: '12px',
    fontStyle: 'italic',
    paddingLeft: theme.spacing(4),
    textAlign: 'left',
  },
}))

type UploadedFile = {
  success: boolean
  fileName: string
  message: string
}

export type PreviewFile = {
  file: File
  name: string
  size: number
  body?: string
}

export enum AppDesignUpdateTypes {
  UPDATE_STUDY_NAME = 'UPDATE_STUDY_NAME',
  UPDATE_STUDY_COLOR = 'UPDATE_STUDY_COLOR',
  UPDATE_STUDY_CONTACTS = 'UPDATE_STUDY_CONTACTS',
  UPDATE_STUDY_DESCRIPTION = 'UPDATE_STUDY_DESCRIPTION',
  UPDATE_STUDY_IRB_NUMBER = 'UPDATE_STUDY_IRB_NUMBER',
  UPDATE_STUDY_LOGO = 'UPDATE_STUDY_LOGO',
  UPDATE_WELCOME_SCREEN_INFO = 'UPDATE_WELCOME_SCREEN_INFO',
}

export type PossibleStudyUpdates =
  | AppDesignUpdateTypes.UPDATE_STUDY_NAME
  | AppDesignUpdateTypes.UPDATE_STUDY_COLOR
  | AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS
  | AppDesignUpdateTypes.UPDATE_STUDY_LOGO
  | AppDesignUpdateTypes.UPDATE_STUDY_IRB_NUMBER
  | AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO
  | AppDesignUpdateTypes.UPDATE_STUDY_DESCRIPTION

export interface AppDesignProps {
  id: string
  onSave: Function
  study: Study
  sideDrawerIsOpen: boolean
}

function getPreviewForImage(file: File): PreviewFile {
  const previewFileBody = URL.createObjectURL(file)
  return {
    file: file,
    body: previewFileBody,
    name: file.name,
    size: file.size,
  }
}

const PhoneTopBar: React.FunctionComponent<{
  color?: string
  previewFile?: PreviewFile
  isUsingDefaultMessage?: boolean
}> = ({ color = 'transparent', previewFile, isUsingDefaultMessage }) => {
  const classes = useStyles()
  return (
    <div
      className={classes.phoneTopBar}
      style={{ backgroundColor: isUsingDefaultMessage ? '#BCD5E4' : color }}
    >
      {!isUsingDefaultMessage ? (
        previewFile && (
          <img
            src={previewFile.body}
            style={{ height: `${imgHeight}px` }}
            alt="study-logo"
          />
        )
      ) : (
        <img
          src={DefaultLogo}
          style={{ height: `${imgHeight - 16}px` }}
          alt="study-logo"
        />
      )}
    </div>
  )
}

const AppDesign: React.FunctionComponent<
  AppDesignProps & StudyBuilderComponentProps
> = ({
  id,
  hasObjectChanged,
  saveLoader,
  children,
  onUpdate,
  onSave,
  study,
  sideDrawerIsOpen,
}: AppDesignProps & StudyBuilderComponentProps) => {
  const handleError = useErrorHandler()

  const { token, orgMembership } = useUserSessionDataState()

  const classes = useStyles()

  const [previewFile, setPreviewFile] = useState<PreviewFile>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [
    irbNameSameAsInstitution,
    setIrbNameSameAsInstitution,
  ] = useState<boolean>(true)

  const SimpleTextInputStyles = {
    fontSize: '15px',
    width: '100%',
    height: '44px',
    paddingTop: '13px',
    boxSizing: 'border-box',
  } as React.CSSProperties

  const [
    appDesignProperties,
    setAppDesignProperties,
  ] = useState<StudyAppDesign>({
    logo: '',
    backgroundColor: {
      foreground: '#6040FF',
    },
    welcomeScreenInfo: {
      welcomeScreenBody: '',
      welcomeScreenFromText: '',
      welcomeScreenSalutation: '',
      welcomeScreenHeader: '',
      isUsingDefaultMessage: false,
      useOptionalDisclaimer: false,
    } as WelcomeScreenData,
    studyTitle: '',
    studySummaryBody: '',
    irbProtocolId: '',
    leadPrincipleInvestigatorInfo: undefined,
    contactLeadInfo: undefined,
    ethicsBoardInfo: undefined,
    funder: undefined,
  })

  const [
    generalContactPhoneNumber,
    setGeneralContactPhoneNumber,
  ] = React.useState('')
  const [irbPhoneNumber, setIrbPhoneNumber] = React.useState('')

  const [phoneNumberErrorState, setPhoneNumberErrorState] = React.useState({
    isGeneralContactPhoneNumberValid: true,
    isIrbPhoneNumberValid: true,
  })

  const [emailErrorState, setEmailErrorState] = React.useState({
    isGeneralContactEmailValid: true,
    isIrbEmailValid: true,
  })

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist()
    if (!event.target.files) {
      return
    }
    const file = event.target.files[0]
    const previewForImage = getPreviewForImage(file)
    setPreviewFile(previewForImage)
  }

  const saveInfo = () => {
    const phoneNumberHasError =
      !phoneNumberErrorState.isGeneralContactPhoneNumberValid ||
      !phoneNumberErrorState.isIrbPhoneNumberValid
    const emailHasError =
      !emailErrorState.isGeneralContactEmailValid ||
      !emailErrorState.isIrbEmailValid
    // This is a placeholder until Lynn finalizes what the error state will look like
    if (phoneNumberHasError || emailHasError) {
      alert(
        'Please make sure that all fields are entered in the correct format.',
      )
      return
    }
    const updatedStudy = { ...study }
    const irbContact = updatedStudy.contacts?.find(el => el.role === 'irb')
    // If a contact's email or phone is an empty string, then delete the field
    // from the contact object.
    if (irbContact?.email === '') {
      delete irbContact.email
    }
    const irbPhoneNumber = irbContact?.phone?.number
    if (irbPhoneNumber === '' || irbPhoneNumber === '+1') {
      delete irbContact!.phone
    }
    const generalContact = updatedStudy.contacts?.find(
      el => el.role === 'study_support',
    )
    if (generalContact?.email === '') {
      delete generalContact.email
    }
    const generalContactPhone = generalContact?.phone?.number
    if (generalContactPhone === '' || generalContactPhone === '+1') {
      delete generalContact!.phone
    }
    onSave(updatedStudy)
  }

  const updateAppDesignInfo = (
    updateType: PossibleStudyUpdates,
    color?: string,
  ) => {
    const appDesignProps = { ...appDesignProperties }
    if (color) {
      appDesignProps.backgroundColor.foreground = color
    }
    const updatedStudy = { ...study }
    // update the study based on the update type specified
    switch (updateType) {
      case AppDesignUpdateTypes.UPDATE_STUDY_NAME:
        updatedStudy.name = appDesignProps.studyTitle
        break
      case AppDesignUpdateTypes.UPDATE_STUDY_COLOR:
        updatedStudy.colorScheme!.foreground =
          appDesignProps.backgroundColor.foreground
        break
      case AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS:
        const contacts: Contact[] = []
        if (appDesignProps.ethicsBoardInfo) {
          contacts.push(appDesignProps.ethicsBoardInfo)
        }
        if (appDesignProps.funder) {
          contacts.push(appDesignProps.funder)
        }
        if (appDesignProps.contactLeadInfo) {
          contacts.push(appDesignProps.contactLeadInfo)
        }
        if (appDesignProps.leadPrincipleInvestigatorInfo) {
          contacts.push(appDesignProps.leadPrincipleInvestigatorInfo)
        }
        updatedStudy.contacts = contacts
        break
      case AppDesignUpdateTypes.UPDATE_STUDY_DESCRIPTION:
        updatedStudy.details = appDesignProps.studySummaryBody
        break
      case AppDesignUpdateTypes.UPDATE_STUDY_IRB_NUMBER:
        updatedStudy.irbProtocolId = appDesignProps.irbProtocolId
        break
      case AppDesignUpdateTypes.UPDATE_STUDY_LOGO:
        updatedStudy.studyLogoUrl = appDesignProps.logo
        break
      case AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO:
        updatedStudy.clientData.welcomeScreenData = {
          ...appDesignProps.welcomeScreenInfo,
        }
        break
    }
    onUpdate(updatedStudy)
  }

  const debouncedUpdateColor = useCallback(
    _.debounce(
      color =>
        updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_COLOR, color),
      1000,
    ),
    [],
  )

  const formatPhoneNumber = (phoneNumber: string) => {
    if (phoneNumber.length != 10) {
      return phoneNumber
    }
    return (
      phoneNumber.slice(0, 3) +
      '-' +
      phoneNumber.slice(3, 6) +
      '-' +
      phoneNumber.slice(6)
    )
  }

  useEffect(() => {
    // When the component mounts, pull out the information from the study object
    const contacts = study.contacts || []
    const leadPrincipleInvestigatorContact = contacts.find(
      el => el.role === 'principal_investigator',
    )
    const funder = contacts.find(el => el.role === 'sponsor')
    const irbInfo = contacts.find(el => el.role === 'irb')
    const studySupport = contacts.find(el => el.role === 'study_support')
    if (studySupport?.phone) {
      const phoneWithoutZipcode = studySupport.phone.number?.replace('+1', '')
      const formattedPhone = formatPhoneNumber(phoneWithoutZipcode)
      setGeneralContactPhoneNumber(formattedPhone)
    }
    if (irbInfo?.phone) {
      const phoneWithoutZipcode = irbInfo.phone.number?.replace('+1', '')
      const formattedPhone = formatPhoneNumber(phoneWithoutZipcode)
      setIrbPhoneNumber(formattedPhone)
    }
    const isWelcomeScreenDataEmpty =
      Object.keys(study.clientData.welcomeScreenData || {}).length == 0
    const welcomeScreenData = isWelcomeScreenDataEmpty
      ? { ...appDesignProperties.welcomeScreenInfo }
      : { ...study.clientData.welcomeScreenData! }
    setIrbNameSameAsInstitution(
      irbInfo?.name === leadPrincipleInvestigatorContact?.affiliation,
    )
    setAppDesignProperties(prevState => {
      return {
        ...prevState,
        leadPrincipleInvestigatorInfo: leadPrincipleInvestigatorContact,
        funder: funder,
        ethicsBoardInfo: irbInfo,
        contactLeadInfo: studySupport,
        logo: study.studyLogoUrl || '',
        backgroundColor: study.colorScheme || {
          ...appDesignProperties.backgroundColor,
        },
        welcomeScreenInfo: welcomeScreenData,
        studyTitle: study.name || '',
        studySummaryBody: study.details || '',
        irbProtocolId: study.irbProtocolId || '',
      }
    })
  }, [])

  useEffect(() => {
    updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_WELCOME_SCREEN_INFO)
  }, [
    appDesignProperties.welcomeScreenInfo.useOptionalDisclaimer,
    appDesignProperties.welcomeScreenInfo.isUsingDefaultMessage,
  ])

  useEffect(() => {
    updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
  }, [
    appDesignProperties.leadPrincipleInvestigatorInfo?.name,
    appDesignProperties.contactLeadInfo?.phone,
    appDesignProperties.ethicsBoardInfo?.phone,
    appDesignProperties.ethicsBoardInfo?.name,
  ])

  const getContact = (
    type: 'FUNDER' | 'ETHICS_BOARD' | 'LEAD_INVESTIGATOR' | 'CONTACT',
  ) => {
    if (type === 'FUNDER') {
      return appDesignProperties.funder
        ? { ...appDesignProperties.funder }
        : ({ role: 'sponsor', name: '' } as Contact)
    } else if (type === 'ETHICS_BOARD') {
      return appDesignProperties.ethicsBoardInfo
        ? { ...appDesignProperties.ethicsBoardInfo }
        : ({ role: 'irb', name: '' } as Contact)
    } else if (type === 'LEAD_INVESTIGATOR') {
      return appDesignProperties.leadPrincipleInvestigatorInfo
        ? { ...appDesignProperties.leadPrincipleInvestigatorInfo }
        : ({ role: 'principal_investigator', name: '' } as Contact)
    } else {
      return appDesignProperties.contactLeadInfo
        ? { ...appDesignProperties.contactLeadInfo }
        : ({
            role: 'study_support',
            name: '',
          } as Contact)
    }
  }
  return (
    <Box className={classes.root}>
      <Paper className={classes.section} elevation={2} id="container">
        <Box className={classes.fields}>
          <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
          <p className={classes.smallScreenText}>
            When a participant downloads the app, they will be presented a
            welcome screen after signing into the study.
            <br></br>
            <br></br>
            You can choose a default message or customize this screen below by
            adding your logo, background color, and message. View how it would
            be displayed to the right.
          </p>
          <div className={classes.switchContainer}>
            <Box marginRight="12px">Use default message</Box>
            <Box marginTop="4px">
              <Switch
                color="primary"
                checked={
                  !appDesignProperties.welcomeScreenInfo.isUsingDefaultMessage
                }
                onChange={() =>
                  setAppDesignProperties(prevState => {
                    const newWelcomeScreenData = {
                      ...prevState.welcomeScreenInfo,
                    }
                    newWelcomeScreenData.isUsingDefaultMessage = !prevState
                      .welcomeScreenInfo.isUsingDefaultMessage
                    return {
                      ...appDesignProperties,
                      welcomeScreenInfo: newWelcomeScreenData,
                    }
                  })
                }
              ></Switch>
            </Box>
            <Box marginLeft="12px">Customize</Box>
          </div>
          <div
            className={clsx(
              appDesignProperties.welcomeScreenInfo.isUsingDefaultMessage &&
                classes.hideSection,
            )}
          >
            <ol className={classes.steps}>
              <UploadStudyLogoSection
                handleFileChange={handleFileChange}
                previewFile={previewFile}
                imgHeight={imgHeight}
                saveLoader={saveLoader}
              />
              <ColorPickerSection
                appDesignProperties={appDesignProperties}
                setAppDesignProperties={setAppDesignProperties}
                debouncedUpdateColor={debouncedUpdateColor}
              />
              <WelcomeScreenMessagingSection
                appDesignProperties={appDesignProperties}
                setAppDesignProperties={setAppDesignProperties}
                updateAppDesignInfo={updateAppDesignInfo}
                saveLoader={saveLoader}
                saveInfo={saveInfo}
                SimpleTextInputStyles={SimpleTextInputStyles}
              />
            </ol>
          </div>
          {appDesignProperties.welcomeScreenInfo.isUsingDefaultMessage && (
            <Box className={classes.hideSectionVisibility}>
              <ol className={classes.steps}>
                <li></li>
                <li></li>
                <li></li>
              </ol>
            </Box>
          )}
        </Box>
        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={`${classes.phone}`}>
            <SectionIndicator
              index={1}
              className={clsx(classes.sectionOneIndicatorPosition)}
            />
            <SectionIndicator
              index={2}
              className={clsx(classes.sectionTwoIndicatorPosition)}
            />
            <PhoneTopBar
              color={appDesignProperties.backgroundColor.foreground}
              previewFile={previewFile}
              isUsingDefaultMessage={
                appDesignProperties.welcomeScreenInfo.isUsingDefaultMessage
              }
            />
            <WelcomeScreenPhoneContent
              appDesignProperties={appDesignProperties}
            />
            <div
              className={clsx(
                classes.phoneBottom,
                classes.optionalDisclaimerTextOnPhone,
              )}
            >
              {appDesignProperties.welcomeScreenInfo.useOptionalDisclaimer
                ? 'This is a research study and does not provide medical advice,diagnosis, or treatment'
                : ''}
            </div>
          </Box>
        </Box>
      </Paper>
      <Paper className={classes.section} elevation={2}>
        <Box className={classes.fields}>
          <MTBHeadingH2>Study Page</MTBHeadingH2>
          <p className={classes.smallScreenText}>
            Within the app, there will be a dedicated page where you can
            describe your study further and list who to contact for participant
            support.
          </p>
          <ol className={classes.steps}>
            <StudySummarySection
              appDesignProperties={appDesignProperties}
              setAppDesignProperties={setAppDesignProperties}
              updateAppDesignInfo={updateAppDesignInfo}
              SimpleTextInputStyles={SimpleTextInputStyles}
            />
            <StudyLeadInformationSection
              appDesignProperties={appDesignProperties}
              setAppDesignProperties={setAppDesignProperties}
              updateAppDesignInfo={updateAppDesignInfo}
              SimpleTextInputStyles={SimpleTextInputStyles}
              orgMembership={orgMembership}
              token={token}
              getContact={getContact}
              irbNameSameAsInstitution={irbNameSameAsInstitution}
            />
            <GeneralContactAndSupportSection
              appDesignProperties={appDesignProperties}
              setAppDesignProperties={setAppDesignProperties}
              updateAppDesignInfo={updateAppDesignInfo}
              SimpleTextInputStyles={SimpleTextInputStyles}
              phoneNumberErrorState={phoneNumberErrorState}
              setPhoneNumberErrorState={setPhoneNumberErrorState}
              emailErrorState={emailErrorState}
              setEmailErrorState={setEmailErrorState}
              getContact={getContact}
              generalContactPhoneNumber={generalContactPhoneNumber}
              setGeneralContactPhoneNumber={setGeneralContactPhoneNumber}
            />
            <Subsection heading="IRB or Ethics Board Contact">
              <Box
                width="80%"
                marginTop="12px"
                fontSize="15px"
                lineHeight="18px"
                fontFamily="Lato"
                marginBottom="16px"
              >
                For questions about your rights as a research participant in
                this study, please contact :
              </Box>
              <FormGroup className={classes.formFields}>
                <Box paddingLeft="2px" marginTop="8px">
                  What is your IRB of record?*
                </Box>
                <Box
                  width="100%"
                  boxSizing="border-box"
                  marginTop="8px"
                  paddingLeft="48px"
                  paddingRight="8px"
                >
                  <RadioGroup
                    aria-label="gender"
                    value={
                      irbNameSameAsInstitution
                        ? 'Same Institutional Affiliation'
                        : 'Other'
                    }
                    onChange={e => {
                      if (e.target.value === 'Same Institutional Affiliation') {
                        const studyLead = getContact('LEAD_INVESTIGATOR')
                        const newEthicsBoard = getContact('ETHICS_BOARD')
                        newEthicsBoard.name = studyLead.affiliation || ''
                        setAppDesignProperties({
                          ...appDesignProperties,
                          ethicsBoardInfo: newEthicsBoard,
                        })
                      }
                      setIrbNameSameAsInstitution(
                        e.target.value === 'Same Institutional Affiliation',
                      )
                    }}
                    style={{ marginBottom: '8px' }}
                  >
                    <FormControlLabel
                      value="Same Institutional Affiliation"
                      control={<Radio />}
                      label="Same Institutional Affiliation"
                    />
                    <FormControlLabel
                      value="Other"
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                  <FormControl className={classes.irbInputFormControl}>
                    <SimpleTextInput
                      className={clsx(
                        classes.informationRowStyle,
                        classes.irbInput,
                      )}
                      id="ethics-board-input"
                      placeholder="Name IRB of record"
                      value={appDesignProperties.ethicsBoardInfo?.name || ''}
                      onChange={e => {
                        const newEthicsBoard = getContact('ETHICS_BOARD')
                        newEthicsBoard.name = e.target.value
                        setAppDesignProperties({
                          ...appDesignProperties,
                          ethicsBoardInfo: newEthicsBoard,
                        })
                      }}
                      onBlur={() =>
                        updateAppDesignInfo(
                          AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS,
                        )
                      }
                      rows={1}
                      rowsMax={1}
                      inputProps={{
                        style: {
                          fontSize: '15px',
                          width: '100%',
                          height: '44px',
                          boxSizing: 'border-box',
                        },
                      }}
                      readOnly={irbNameSameAsInstitution}
                    />
                  </FormControl>
                </Box>
                <FormControl
                  className={clsx(
                    !phoneNumberErrorState.isIrbPhoneNumberValid && 'error',
                  )}
                >
                  <SimpleTextLabel htmlFor="ethics-phone-number-input">
                    Phone Number*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={clsx(classes.informationRowStyle, 'error')}
                    id="ethics-phone-number-input"
                    placeholder="xxx-xxx-xxxx"
                    value={irbPhoneNumber}
                    onChange={e => {
                      setIrbPhoneNumber(e.target.value)
                    }}
                    onBlur={() => {
                      const isInvalidPhoneNumber =
                        isInvalidPhone(irbPhoneNumber) && irbPhoneNumber !== ''
                      setPhoneNumberErrorState(prevState => {
                        return {
                          ...prevState,
                          isIrbPhoneNumberValid: !isInvalidPhoneNumber,
                        }
                      })
                      const newEthicsBoard = getContact('ETHICS_BOARD')
                      newEthicsBoard.phone = makePhone(irbPhoneNumber)
                      setAppDesignProperties({
                        ...appDesignProperties,
                        ethicsBoardInfo: newEthicsBoard,
                      })
                    }}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                  {!phoneNumberErrorState.isIrbPhoneNumberValid && (
                    <FormHelperText
                      id="ethics-phone-text"
                      className={classes.errorText}
                    >
                      phone should be in the format: xxx-xxx-xxxx
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  className={clsx(!emailErrorState.isIrbEmailValid && 'error')}
                >
                  <SimpleTextLabel htmlFor="ethics-email-input">
                    Email*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-email-input"
                    placeholder="Institutional Email"
                    value={appDesignProperties.ethicsBoardInfo?.email || ''}
                    onChange={e => {
                      const newEthicsBoard = getContact('ETHICS_BOARD')
                      newEthicsBoard.email = e.target.value
                      setAppDesignProperties({
                        ...appDesignProperties,
                        ethicsBoardInfo: newEthicsBoard,
                      })
                    }}
                    onBlur={() => {
                      const validEmail =
                        isValidEmail(
                          appDesignProperties.ethicsBoardInfo?.email || '',
                        ) || !appDesignProperties.ethicsBoardInfo?.email
                      setEmailErrorState(prevState => {
                        return {
                          ...prevState,
                          isIrbEmailValid: validEmail,
                        }
                      })
                      updateAppDesignInfo(
                        AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS,
                      )
                    }}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                  {!emailErrorState.isIrbEmailValid && (
                    <FormHelperText
                      id="ethics-email-text"
                      className={classes.errorText}
                    >
                      email should be in a valid format such as:
                      example@placeholder.com
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="IRB-approval-input">
                    IRB Protocol ID*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="IRB-approval-input"
                    placeholder="XXXXXXXXXX"
                    value={appDesignProperties.irbProtocolId}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        irbProtocolId: e.target.value,
                      })
                    }}
                    onBlur={() =>
                      updateAppDesignInfo(
                        AppDesignUpdateTypes.UPDATE_STUDY_IRB_NUMBER,
                      )
                    }
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
              </FormGroup>
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
          </ol>
        </Box>

        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={classes.phone}>
            <PhoneTopBar
              color={appDesignProperties.backgroundColor.foreground}
              previewFile={previewFile}
              isUsingDefaultMessage={
                appDesignProperties.welcomeScreenInfo.isUsingDefaultMessage
              }
            />
            <StudyPagePhoneContent
              appDesignProperties={appDesignProperties}
              irbPhoneNumber={irbPhoneNumber}
              generalContactPhoneNumber={generalContactPhoneNumber}
            />
            <div className={classes.phoneBottom}>
              <PhoneBottomImg title="phone bottom image" />
            </div>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default AppDesign
