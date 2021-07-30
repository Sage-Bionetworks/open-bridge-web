import {Box, Paper, Switch} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import clsx from 'clsx'
import React, {ChangeEvent, useEffect, useState} from 'react'
import {HexColorPicker} from 'react-colorful'
import {useErrorHandler} from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import {ReactComponent as PhoneTopImgLeftHighlighted} from '../../../assets/appdesign/CustomizeAppTopbarLeft.svg'
import {ReactComponent as PhoneTopImgRightHighlighted} from '../../../assets/appdesign/CustomizeAppTopbarRight.svg'
import PhoneBg from '../../../assets/appdesign/phone_bg.svg'
import {ReactComponent as PhoneBottomImg} from '../../../assets/appdesign/phone_buttons.svg'
import DefaultLogo from '../../../assets/logo_mtb.svg'
import {useUserSessionDataState} from '../../../helpers/AuthContext'
import Utility from '../../../helpers/utility'
import StudyService from '../../../services/study.service'
import {ThemeType} from '../../../style/theme'
import constants from '../../../types/constants'
import {
  Contact,
  Study,
  StudyBuilderComponentProps,
  WelcomeScreenData,
} from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import GeneralContactAndSupportSection from './GeneralContactAndSupportSection'
import IrbBoardContactSection from './IrbBoardContactSection'
import SectionIndicator from './SectionIndicator'
import StudyLeadInformationSection from './StudyLeadInformationSection'
import StudyPageBottomPhoneContent from './StudyPageBottomPhoneContent'
import StudyPageTopPhoneContent from './StudyPageTopPhoneContent'
import StudySummarySection from './StudySummarySection'
import Subsection from './Subsection'
import UploadStudyLogoSection from './UploadStudyLogoSection'
import WelcomeScreenMessagingSection from './WelcomeScreenMessagingSection'
import WelcomeScreenPhoneContent from './WelcomeScreenPhoneContent'
import ReadOnlyAppDesign from './read-only-pages/ReadOnlyAppDesign'

const imgHeight = 70
const DEFAULT_CONTACT_NAME = constants.constants.DEFAULT_PLACEHOLDER

export const useStyles = makeStyles((theme: ThemeType) => ({
  root: {counterReset: 'orderedlist'},
  section: {
    backgroundColor: '#fefefe',
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
    borderWidth: '4px 4px 0px 4px',
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
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
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
  optionalDisclaimerTextOnPhone: {
    fontSize: '12px',
    fontStyle: 'italic',
    paddingLeft: theme.spacing(4),
    textAlign: 'left',
  },
  studyPageTopBar: {
    backgroundColor: '#F6F6F6',
  },
}))

const SimpleTextInputStyles = {
  fontSize: '15px',
  width: '100%',
  height: '44px',
  paddingTop: '8px',
  boxSizing: 'border-box',
} as React.CSSProperties

export type ContactType =
  | 'principal_investigator'
  | 'irb'
  | 'sponsor'
  | 'study_support'

export type PreviewFile = {
  file: File
  name: string
  size: number
  body?: string
}

export interface AppDesignProps {
  onSave: Function
  study: Study
  onError: Function
  isReadOnly: boolean
}

type ErrorStateType = {
  studyTitleHasError?: boolean
  studySummaryCopyHasError?: boolean
  leadPINameHasError?: boolean
  leadPIAffiliationHasError?: boolean
  contactLeadNameHasError?: boolean
  contactLeadPositonHasError?: boolean
  irbRecordNameHasError?: boolean
  irbProtocolIdHasError?: boolean
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
  isUsingDefaultMessage?: boolean
  studyLogoUrl?: string
}> = ({color = 'transparent', isUsingDefaultMessage, studyLogoUrl}) => {
  const classes = useStyles()
  return (
    <div
      className={classes.phoneTopBar}
      style={{backgroundColor: isUsingDefaultMessage ? '#BCD5E4' : color}}>
      {!isUsingDefaultMessage ? (
        studyLogoUrl && (
          <img
            src={studyLogoUrl}
            style={{height: `${imgHeight}px`}}
            alt="study-logo"
          />
        )
      ) : (
        <img
          src={DefaultLogo}
          style={{height: `${imgHeight - 16}px`}}
          alt="study-logo"
        />
      )}
    </div>
  )
}

export const WelcomeScreenDisplay: React.FunctionComponent<{
  study: Study
  isReadOnly?: boolean
}> = ({study, isReadOnly}) => {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.phone}>
        {!study.clientData.welcomeScreenData?.isUsingDefaultMessage &&
          !isReadOnly && [
            <SectionIndicator
              index={1}
              className={classes.sectionOneIndicatorPosition}
              key={1}
            />,
            <SectionIndicator
              index={2}
              className={classes.sectionTwoIndicatorPosition}
              key={2}
            />,
          ]}
        <PhoneTopBar
          color={study.colorScheme?.background || 'transparent'}
          isUsingDefaultMessage={
            study.clientData.welcomeScreenData?.isUsingDefaultMessage || false
          }
          studyLogoUrl={study.studyLogoUrl}
        />
        <WelcomeScreenPhoneContent
          welcomeScreenContent={
            study.clientData.welcomeScreenData || ({} as WelcomeScreenData)
          }
          studyTitle={study.name}
          isReadOnly={isReadOnly || false}
        />
        <Box
          className={clsx(
            classes.phoneBottom,
            classes.optionalDisclaimerTextOnPhone
          )}>
          {study.clientData.welcomeScreenData?.useOptionalDisclaimer
            ? 'This is a research study and does not provide medical advice, diagnosis, or treatment'
            : ''}
        </Box>
      </Box>
    </>
  )
}

export const StudyPageTopPhone: React.FunctionComponent<{
  study: Study
  getContactPersonObject: Function
  isReadOnly?: boolean
}> = ({study, getContactPersonObject, isReadOnly}) => {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.phone}>
        <Box className={clsx(classes.phoneTopBar, classes.studyPageTopBar)}>
          <PhoneTopImgLeftHighlighted title="phone top image" width="312px" />
        </Box>
        <StudyPageTopPhoneContent
          studyLogoUrl={study.studyLogoUrl}
          isUsingDefaultMessage={
            study.clientData.welcomeScreenData?.isUsingDefaultMessage || false
          }
          imgHeight={imgHeight}
          appColor={study.colorScheme?.background || 'transparent'}
          leadInvestigator={getContactPersonObject('principal_investigator')}
          funder={getContactPersonObject('sponsor')}
          studyTitle={study.name}
          studySummaryBody={study.details || ''}
          getContactName={getContactName}
          isReadOnly={isReadOnly || false}
        />
        <Box className={classes.phoneBottom}>
          <PhoneBottomImg title="phone bottom image" />
        </Box>
      </Box>
    </>
  )
}

export const StudyPageBottomPhone: React.FunctionComponent<{
  study: Study
  generalContactPhoneNumber: string
  irbPhoneNumber: string
  getContactPersonObject: Function
  isReadOnly?: boolean
}> = ({
  study,
  generalContactPhoneNumber,
  irbPhoneNumber,
  getContactPersonObject,
  isReadOnly,
}) => {
  const classes = useStyles()
  return (
    <>
      <Box
        className={classes.phone}
        style={{marginTop: isReadOnly ? '30px' : '134px'}}>
        <Box className={clsx(classes.phoneTopBar, classes.studyPageTopBar)}>
          <PhoneTopImgRightHighlighted title="phone top image" width="312px" />
        </Box>
        <StudyPageBottomPhoneContent
          generalContactPhoneNumber={generalContactPhoneNumber}
          irbPhoneNumber={irbPhoneNumber}
          studyID={study.identifier}
          irbProtocolId={study.irbProtocolId || ''}
          ethicsBoardInfo={getContactPersonObject('irb')}
          contactLead={getContactPersonObject('study_support')}
          getContactName={getContactName}
          isReadOnly={isReadOnly || false}
        />
        <div className={classes.phoneBottom}>
          <PhoneBottomImg title="phone bottom image" />
        </div>
      </Box>
    </>
  )
}

export function getContact(
  study: Study,
  role: ContactType
): Contact | undefined {
  let contacts = study.contacts
  if (!contacts) {
    return undefined
  }
  return contacts.find(el => el.role === role)
}

export const formatPhoneNumber = (phoneNumber: string | undefined) => {
  if (!phoneNumber) {
    return ''
  }
  const updatedPhoneNumber = phoneNumber.replace('+1', '')
  if (updatedPhoneNumber.length !== 10) {
    return updatedPhoneNumber
  }
  return (
    updatedPhoneNumber.slice(0, 3) +
    '-' +
    updatedPhoneNumber.slice(3, 6) +
    '-' +
    updatedPhoneNumber.slice(6)
  )
}

export const getContactName = (name: string | undefined) => {
  return name && name !== DEFAULT_CONTACT_NAME ? name : ''
}

const AppDesign: React.FunctionComponent<
  AppDesignProps & StudyBuilderComponentProps
> = ({
  hasObjectChanged,
  saveLoader,
  children,
  onUpdate,
  onSave,
  study,
  onError,
  isReadOnly,
}: AppDesignProps & StudyBuilderComponentProps) => {
  const handleError = useErrorHandler()
  const params = Utility.getSearchParams(window.location.search)
  const showError = params.from !== undefined
  const anchor = params.anchor

  const {token, orgMembership} = useUserSessionDataState()

  const classes = useStyles()

  const [isSettingStudyLogo, setIsSettingStudyLogo] = useState(false)
  const [
    irbNameSameAsInstitution,
    setIrbNameSameAsInstitution,
  ] = useState<boolean>(
    getContact(study, 'irb')?.name ===
      getContact(study, 'principal_investigator')?.affiliation
  )
  const [
    generalContactPhoneNumber,
    setGeneralContactPhoneNumber,
  ] = React.useState(
    formatPhoneNumber(getContact(study, 'study_support')?.phone?.number)
  )
  const [irbPhoneNumber, setIrbPhoneNumber] = React.useState(
    formatPhoneNumber(getContact(study, 'irb')?.phone?.number)
  )

  const [phoneNumberErrorState, setPhoneNumberErrorState] = React.useState({
    isGeneralContactPhoneNumberValid: true,
    isIrbPhoneNumberValid: true,
  })

  const [emailErrorState, setEmailErrorState] = React.useState({
    isGeneralContactEmailValid: true,
    isIrbEmailValid: true,
  })

  const [errorState, setErrorState] = React.useState<ErrorStateType>({})

  useEffect(() => {
    setTimeout(() => {
      const element = document.getElementById(anchor)
      if (!element) return
      window.scrollTo({
        behavior: 'smooth',
        top: element.offsetTop,
      })
    }, 100)
  }, [anchor])

  const handleUpdate = (updatedStudy: Study) => {
    const formattedStudy = formatStudy(updatedStudy)
    if (formattedStudy.contacts) {
      for (const contact of formattedStudy.contacts) {
        if (contact.name === '') {
          contact.name = DEFAULT_CONTACT_NAME
        }
      }
    }
    onUpdate(formattedStudy)
  }

  const checkPhoneError = (contactLead?: Contact, irbRecord?: Contact) => {
    const generalContactPhoneError =
      !contactLead?.phone?.number ||
      Utility.isInvalidPhone(generalContactPhoneNumber)
    const irbRecordHasError =
      !irbRecord?.phone?.number || Utility.isInvalidPhone(irbPhoneNumber)
    setPhoneNumberErrorState({
      isGeneralContactPhoneNumberValid: !generalContactPhoneError,
      isIrbPhoneNumberValid: !irbRecordHasError,
    })
  }

  const checkEmailError = (contactLead?: Contact, irbRecord?: Contact) => {
    const generalContactEmailHasError =
      !contactLead?.email || !Utility.isValidEmail(contactLead.email)
    const irbRecordEmailHasError =
      !irbRecord?.email || !Utility.isValidEmail(irbRecord.email)
    setEmailErrorState({
      isGeneralContactEmailValid: !generalContactEmailHasError,
      isIrbEmailValid: !irbRecordEmailHasError,
    })
  }

  const isContactValid = (
    contact: Contact | undefined,
    property: keyof Contact
  ) => {
    return (
      contact && contact[property] && contact[property] !== DEFAULT_CONTACT_NAME
    )
  }

  useEffect(() => {
    if (!showError) return
    const updatedErrorState = {} as ErrorStateType
    const contactLead = getContact(study, 'study_support')
    const principalInvestigator = getContact(study, 'principal_investigator')
    const irbRecord = getContact(study, 'irb')
    updatedErrorState.leadPINameHasError = !isContactValid(
      principalInvestigator,
      'name'
    )
    updatedErrorState.leadPIAffiliationHasError = !isContactValid(
      principalInvestigator,
      'affiliation'
    )

    updatedErrorState.contactLeadNameHasError = !isContactValid(
      contactLead,
      'name'
    )
    updatedErrorState.contactLeadPositonHasError = !isContactValid(
      contactLead,
      'position'
    )
    updatedErrorState.irbRecordNameHasError = !isContactValid(irbRecord, 'name')
    updatedErrorState.irbProtocolIdHasError = !study.irbProtocolId
    updatedErrorState.studyTitleHasError = !study.name
    updatedErrorState.studySummaryCopyHasError = !study.details?.trim()
    checkPhoneError(contactLead, irbRecord)
    checkEmailError(contactLead, irbRecord)
    setErrorState(updatedErrorState)
  }, [study])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist()
    if (!event.target.files) {
      return
    }
    setIsSettingStudyLogo(true)
    const file = event.target.files[0]
    const previewForImage = getPreviewForImage(file)
    try {
      const uploadResponse = await StudyService.editStudyLogo(
        study.identifier,
        token!,
        previewForImage.size,
        previewForImage.name,
        previewForImage.body || '',
        file.type,
        previewForImage.file
      )
      const updatedStudy: Study = {
        ...study,
        studyLogoUrl: uploadResponse.studyLogoUrl,
        version: uploadResponse.version,
      }

      handleUpdate(updatedStudy)
    } catch (error) {
      onError(error)
    } finally {
      setIsSettingStudyLogo(false)
    }
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
        'Please make sure that all fields are entered in the correct format.'
      )
      return
    }
    const updatedStudy = formatStudy(study)
    onSave(updatedStudy)
  }

  const formatStudy = (newStudy: Study) => {
    const updatedStudy = {...newStudy}
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
      el => el.role === 'study_support'
    )
    if (generalContact?.email === '') {
      delete generalContact.email
    }
    const generalContactPhone = generalContact?.phone?.number
    if (generalContactPhone === '' || generalContactPhone === '+1') {
      delete generalContact!.phone
    }
    return updatedStudy
  }

  // This is the method without useCallback or debounce.
  const updateColor = (color: string) => {
    const updatedStudy = {...study}
    updatedStudy.colorScheme = {
      ...updatedStudy.colorScheme,
      background: color,
    }
    handleUpdate(updatedStudy)
  }

  const updateContacts = (
    leadPrincipalInvestigator: Contact,
    funder: Contact,
    ethicsBoardContact: Contact,
    contactLeadInfo: Contact
  ) => {
    const updatedContacts: Contact[] = []
    updatedContacts.push(ethicsBoardContact)
    updatedContacts.push(funder)
    updatedContacts.push(contactLeadInfo)
    updatedContacts.push(leadPrincipalInvestigator)
    return updatedContacts
  }

  useEffect(() => {
    // Set the use default message property to true by default
    const {welcomeScreenData} = study.clientData
    if (welcomeScreenData?.isUsingDefaultMessage === undefined) {
      updateWelcomeScreenMessaging(
        welcomeScreenData?.welcomeScreenHeader || '',
        welcomeScreenData?.welcomeScreenBody || '',
        welcomeScreenData?.welcomeScreenSalutation || '',
        welcomeScreenData?.welcomeScreenFromText || '',
        true
      )
    }
  }, [])

  const getContactPersonObject = (type: ContactType): Contact => {
    const contact = getContact(study, type)
    return contact || {role: type, name: DEFAULT_CONTACT_NAME}
  }

  const updateWelcomeScreenMessaging = (
    welcomeScreenHeader: string,
    welcomeScreenBody: string,
    welcomeScreenSalutation: string,
    welcomeScreenFromText: string,
    useOptionalDisclaimer: boolean
  ) => {
    const newWelcomeScreenData = {
      welcomeScreenHeader: welcomeScreenHeader,
      welcomeScreenBody: welcomeScreenBody,
      welcomeScreenFromText: welcomeScreenFromText,
      welcomeScreenSalutation: welcomeScreenSalutation,
      useOptionalDisclaimer: useOptionalDisclaimer,
      isUsingDefaultMessage:
        study.clientData.welcomeScreenData?.isUsingDefaultMessage || false,
    } as WelcomeScreenData
    const updatedStudy = {...study}
    updatedStudy.clientData.welcomeScreenData = newWelcomeScreenData
    handleUpdate(updatedStudy)
  }

  const hasError = (errorProperty: keyof ErrorStateType) => {
    return showError && !!errorState[errorProperty]
  }
  if (isReadOnly) {
    return (
      <ReadOnlyAppDesign
        children={children}
        study={study}
        getContactPersonObject={getContactPersonObject}
      />
    )
  }

  return (
    <>
      <Box className={classes.root}>
        <NavigationPrompt when={hasObjectChanged} key="prompt">
          {({onConfirm, onCancel}) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
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
              <Box mr={1.5}>Use default message</Box>
              <Box mt={0.5}>
                <Switch
                  color="primary"
                  checked={
                    !study.clientData.welcomeScreenData
                      ?.isUsingDefaultMessage || false
                  }
                  onChange={() => {
                    const updatedStudy = {...study}
                    let currentWelcomeScreenData
                    if (!study.clientData.welcomeScreenData) {
                      currentWelcomeScreenData = {
                        welcomeScreenBody: '',
                        welcomeScreenFromText: '',
                        welcomeScreenSalutation: '',
                        welcomeScreenHeader: '',
                        isUsingDefaultMessage: false,
                        useOptionalDisclaimer: false,
                      } as WelcomeScreenData
                    } else {
                      currentWelcomeScreenData = {
                        ...study.clientData.welcomeScreenData,
                      }
                    }
                    const newWelcomeScreenData = {
                      ...currentWelcomeScreenData,
                      isUsingDefaultMessage: !currentWelcomeScreenData.isUsingDefaultMessage,
                    }
                    updatedStudy.clientData.welcomeScreenData = newWelcomeScreenData
                    handleUpdate(updatedStudy)
                  }}></Switch>
              </Box>
              <Box ml={1.5}>Customize</Box>
            </div>
            <div
              className={clsx(
                study.clientData.welcomeScreenData?.isUsingDefaultMessage &&
                  classes.hideSection
              )}>
              <ol className={classes.steps}>
                <UploadStudyLogoSection
                  handleFileChange={handleFileChange}
                  imgHeight={imgHeight}
                  saveLoader={saveLoader}
                  studyLogoUrl={study.studyLogoUrl}
                  isSettingStudyLogo={isSettingStudyLogo}
                />

                <Subsection heading="Select background color">
                  <p>
                    Select a background color that matches your institution or
                    study to be seen beneath your logo.
                  </p>
                  <Box width="250px" height="230px" ml={-1.25}>
                    <HexColorPicker
                      color={study.colorScheme?.background || 'transparent'}
                      onChange={updateColor}
                    />
                  </Box>
                </Subsection>

                <WelcomeScreenMessagingSection
                  saveLoader={saveLoader}
                  saveInfo={saveInfo}
                  SimpleTextInputStyles={SimpleTextInputStyles}
                  onUpdate={updateWelcomeScreenMessaging}
                  welcomeScreenHeader={
                    study.clientData.welcomeScreenData?.welcomeScreenHeader ||
                    ''
                  }
                  welcomeScreenBody={
                    study.clientData.welcomeScreenData?.welcomeScreenBody || ''
                  }
                  welcomeScreenFromText={
                    study.clientData.welcomeScreenData?.welcomeScreenFromText ||
                    ''
                  }
                  welcomeScreenSalutation={
                    study.clientData.welcomeScreenData
                      ?.welcomeScreenSalutation || ''
                  }
                  useOptionalDisclaimer={
                    study.clientData.welcomeScreenData?.useOptionalDisclaimer ||
                    false
                  }
                />
              </ol>
            </div>
            {study.clientData.welcomeScreenData?.isUsingDefaultMessage && (
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
            <WelcomeScreenDisplay study={study} />
          </Box>
        </Paper>
        <Paper className={classes.section} elevation={2}>
          <Box className={classes.fields}>
            <MTBHeadingH2>Study Page</MTBHeadingH2>
            <p className={classes.smallScreenText}>
              Within the app, there will be a dedicated page where you can
              describe your study further and list who to contact for
              participant support.
            </p>
            <a id="summary" />
            <ol className={classes.steps}>
              <StudySummarySection
                SimpleTextInputStyles={SimpleTextInputStyles}
                onUpdate={(studyTitle: string, studySummaryBody: string) => {
                  const updatedStudy = {...study}
                  updatedStudy.name = studyTitle
                  updatedStudy.details = studySummaryBody
                  handleUpdate(updatedStudy)
                }}
                studyTitle={study.name || ''}
                studySummaryBody={study.details || ''}
                studyTitleHasError={hasError('studyTitleHasError')}
                studySummaryCopyHasError={hasError('studySummaryCopyHasError')}
              />
              <a id="leadPI" />
              <StudyLeadInformationSection
                SimpleTextInputStyles={SimpleTextInputStyles}
                orgMembership={orgMembership}
                token={token}
                getContactPersonObject={getContactPersonObject}
                irbNameSameAsInstitution={irbNameSameAsInstitution}
                onUpdate={(
                  leadPrincipalInvestigator: Contact,
                  funder: Contact,
                  ethicsBoardContact: Contact
                ) => {
                  const updatedContacts = updateContacts(
                    leadPrincipalInvestigator,
                    funder,
                    ethicsBoardContact,
                    getContactPersonObject('study_support')
                  )
                  const updatedStudy = {...study}
                  updatedStudy.contacts = updatedContacts
                  handleUpdate(updatedStudy)
                }}
                leadPrincipalInvestigator={getContactPersonObject(
                  'principal_investigator'
                )}
                ethicsBoardContact={getContactPersonObject('irb')}
                funder={getContactPersonObject('sponsor')}
                getContactName={getContactName}
                principleInvestigatorNameHasError={hasError(
                  'leadPINameHasError'
                )}
                principleInvestigatorAffiliationHasError={hasError(
                  'leadPIAffiliationHasError'
                )}
              />
              <a id="contactLead" />
              <GeneralContactAndSupportSection
                SimpleTextInputStyles={SimpleTextInputStyles}
                phoneNumberErrorState={phoneNumberErrorState}
                setPhoneNumberErrorState={setPhoneNumberErrorState}
                emailErrorState={emailErrorState}
                setEmailErrorState={setEmailErrorState}
                getContactPersonObject={getContactPersonObject}
                generalContactPhoneNumber={generalContactPhoneNumber}
                setGeneralContactPhoneNumber={setGeneralContactPhoneNumber}
                contactLead={getContactPersonObject('study_support')}
                onUpdate={(contactLead: Contact) => {
                  const updatedContacts = updateContacts(
                    getContactPersonObject('principal_investigator'),
                    getContactPersonObject('sponsor'),
                    getContactPersonObject('irb'),
                    contactLead
                  )
                  const updatedStudy = {...study}
                  updatedStudy.contacts = updatedContacts
                  handleUpdate(updatedStudy)
                }}
                getContactName={getContactName}
                contactLeadNameHasError={hasError('contactLeadNameHasError')}
                contactLeadPositionHasError={hasError(
                  'contactLeadPositonHasError'
                )}
              />
              <a id="contactIrb" />
              <IrbBoardContactSection
                SimpleTextInputStyles={SimpleTextInputStyles}
                phoneNumberErrorState={phoneNumberErrorState}
                setPhoneNumberErrorState={setPhoneNumberErrorState}
                emailErrorState={emailErrorState}
                setEmailErrorState={setEmailErrorState}
                getContactPersonObject={getContactPersonObject}
                irbPhoneNumber={irbPhoneNumber}
                setIrbPhoneNumber={setIrbPhoneNumber}
                saveInfo={saveInfo}
                saveLoader={saveLoader}
                irbNameSameAsInstitution={irbNameSameAsInstitution}
                setIrbNameSameAsInstitution={setIrbNameSameAsInstitution}
                onUpdate={(irbInfo: Contact, protocolId: string) => {
                  const updatedContacts = updateContacts(
                    getContactPersonObject('principal_investigator'),
                    getContactPersonObject('sponsor'),
                    irbInfo,
                    getContactPersonObject('study_support')
                  )
                  const updatedStudy = {...study}
                  updatedStudy.contacts = updatedContacts
                  updatedStudy.irbProtocolId = protocolId
                  handleUpdate(updatedStudy)
                }}
                irbInfo={getContactPersonObject('irb')}
                protocolId={study.irbProtocolId || ''}
                getContactName={getContactName}
                irbNameHasError={hasError('irbRecordNameHasError')}
                irbProtocolIdHasError={hasError('irbProtocolIdHasError')}
              />
            </ol>
          </Box>
          <Box className={classes.phoneArea}>
            <MTBHeadingH1>What participants will see: </MTBHeadingH1>
            <StudyPageTopPhone
              study={study}
              getContactPersonObject={getContactPersonObject}
            />
            <StudyPageBottomPhone
              study={study}
              getContactPersonObject={getContactPersonObject}
              irbPhoneNumber={irbPhoneNumber}
              generalContactPhoneNumber={generalContactPhoneNumber}
            />
          </Box>
        </Paper>
      </Box>
      {children}
    </>
  )
}

export default AppDesign
