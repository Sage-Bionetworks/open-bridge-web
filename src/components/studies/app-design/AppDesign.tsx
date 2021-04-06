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
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ReactColorPicker from '@super-effective/react-color-picker'
import _ from 'lodash'
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import PhoneBg from '../../../assets/appdesign/phone_bg.svg'
import { ReactComponent as PhoneBottomImg } from '../../../assets/appdesign/phone_buttons.svg'
import { bytesToSize } from '../../../helpers/utility'
import {
  latoFont,
  playfairDisplayFont,
  poppinsFont,
  ThemeType,
} from '../../../style/theme'
import {
  OrgUser,
  StudyAppDesign,
  StudyBuilderComponentProps,
} from '../../../types/types'
import { MTBHeadingH1, MTBHeadingH2 } from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import {
  SimpleTextInput,
  SimpleTextLabel,
  AntSwitch,
} from '../../widgets/StyledComponents'
import ContactInformation from './ContactInformation'
import StudySummaryRoles from './StudySummaryRoles'
import DefaultLogo from '../../../assets/logo_mtb.svg'
import ChevronDownIcon from '../../../assets/chevron_down_icon.svg'
import clsx from 'clsx'
import AccessService from '../../../services/access.service'
import { useUserSessionDataState } from '../../../helpers/AuthContext'

const imgHeight = 70

const useStyles = makeStyles((theme: ThemeType) => ({
  root: { counterReset: 'orderedlist' },
  bodyText: {
    fontFamily: 'Lato',
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: '25px',
    whiteSpace: 'pre-line',
  },
  firstPhoneScreenBodyText: {
    height: '325px',
  },
  bodyPhoneText: {
    fontFamily: 'Lato',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '15px',
    marginTop: '25px',
  },
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
  headlineStyle: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '21px',
    lineHeight: '28px',
  },
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
  contactAndSupportText: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '24px',
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
  phoneInner: {
    marginLeft: '6px',
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(4),
    textAlign: 'left',
    minHeight: `521px`,
    borderRight: '3px solid black',
    borderLeft: '3px solid black',
  },
  phoneInnerBottom: {
    marginLeft: '5px',
    marginRight: theme.spacing(0.26),
    padding: theme.spacing(4),
    textAlign: 'left',
    minHeight: `521px`,
    borderRight: '4px solid black',
    borderLeft: '4px solid black',
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
    marginTop: '20px',
  },
  summaryRoles: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(1.25),
  },
  divider: {
    width: '256px',
    marginTop: theme.spacing(3.75),
  },
  phoneGrayBackground: {
    backgroundColor: '#F7F7F7',
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
  optionalDisclaimerText: {
    marginLeft: theme.spacing(2),
    fontSize: '14px',
    lineHeight: '20px',
    fontFamily: 'Lato',
  },
  optionalDisclaimerRow: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1.25),
    alignItems: 'center',
    marginBottom: theme.spacing(1.5),
  },
  checkBox: {
    width: '20px',
    height: '20px',
  },
  hideSectionVisibility: {
    visibility: 'hidden',
  },
  selectPrincipleInvestigatorButton: {
    width: '410px',
    height: '48px',
    border: '1px solid black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    outline: 'none',
    transition: '0.25s ease',
    fontSize: '14px',
  },
  selectPrincipleInvestigatorButtonClosed: {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  principleInvestigatorOption: {
    backgroundColor: 'white',
    height: '48px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    transition: '0.25s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    cursor: 'pointer',
  },
  principleInvestigatorDropdown: {
    paddingLeft: theme.spacing(0),
    zIndex: 500,
    position: 'absolute',
    width: '410px',
  },
  principleInvestigatorsParagraph: {
    fontSize: '12px',
    marginLeft: theme.spacing(2),
    lineHeight: '14px',
    marginTop: theme.spacing(2),
  },
  uploadButton: {
    marginTop: theme.spacing(2.5),
  },
  fromText: {
    marginTop: theme.spacing(1.5),
  },
  salutationText: {
    marginTop: theme.spacing(2.5),
  },
}))

type UploadedFile = {
  success: boolean
  fileName: string
  message: string
}

type PreviewFile = {
  file: File
  name: string
  size: number
  body?: string
}

type leadInvestigatorOption = {
  name: string
}

export interface AppDesignProps {
  id: string
  currentAppDesign: StudyAppDesign
  onSave: Function
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

const Subsection: React.FunctionComponent<{ heading: string }> = ({
  heading,
  children,
}) => {
  return (
    <li>
      <div style={{ width: '100%' }}>
        <MTBHeadingH2>{heading}</MTBHeadingH2>
        {children}
      </div>
    </li>
  )
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
  currentAppDesign,
  onSave,
}: AppDesignProps & StudyBuilderComponentProps) => {
  const handleError = useErrorHandler()

  const { token, orgMembership } = useUserSessionDataState()

  const classes = useStyles()

  const [previewFile, setPreviewFile] = useState<PreviewFile>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [
    isLeadInvestigatorDropdownOpen,
    setIsLeadInvestigatorDropdownOpen,
  ] = useState<boolean>(false)
  const [leadInvestigatorOptions, setLeadInvestigatorOptions] = useState<
    leadInvestigatorOption[]
  >([])

  const defaultHeader = 'Thanks for joining us!'
  const defaultStudyBody =
    'We’re excited to have you help us in conduting this study! \n \n This is a research study and does not provide medical advice, diagnosis, or treatment.'
  const defaultSalutations = 'Thank you for your contributions,'
  const defaultFrom = 'Research Team X'

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
    backgroundColor: currentAppDesign.backgroundColor || '#6040FF',
    welcomeScreenHeader: currentAppDesign.welcomeScreenHeader || '',
    welcomeScreenBody: currentAppDesign.welcomeScreenBody || '',
    welcomeScreenFromText: currentAppDesign.welcomeScreenFromText || '',
    welcomeScreenSalutation: currentAppDesign.welcomeScreenSalutation || '',
    studyTitle: currentAppDesign.studyTitle || '',
    studySummaryBody: currentAppDesign.studySummaryBody || '',
    leadPrincipleInvestigator: currentAppDesign.leadPrincipleInvestigator || '',
    institution: currentAppDesign.institution || '',
    funder: currentAppDesign.funder || '',
    IRBApprovalNumber: currentAppDesign.IRBApprovalNumber || '',
    contactLead: currentAppDesign.contactLead || '',
    contactLeadRoleInStudy: currentAppDesign.contactLeadRoleInStudy || '',
    contactLeadPhoneNumber: currentAppDesign.contactLeadPhoneNumber || '',
    contactLeadEmail: currentAppDesign.contactLeadEmail || '',
    nameOfEthicsBoard: currentAppDesign.nameOfEthicsBoard || '',
    ethicsBoardPhoneNumber: currentAppDesign.ethicsBoardPhoneNumber || '',
    ethicsBoardEmail: currentAppDesign.ethicsBoardEmail || '',
    useOptionalDisclaimer: currentAppDesign.useOptionalDisclaimer || false,
    isUsingDefaultMessage: currentAppDesign.isUsingDefaultMessage || false,
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

  const updateAppDesignInfo = (color?: string) => {
    const props = { ...appDesignProperties }
    if (color) {
      props.backgroundColor = color
    }
    onUpdate(props)
  }

  const debouncedUpdateColor = useCallback(
    _.debounce(color => updateAppDesignInfo(color), 1000),
    [],
  )

  useEffect(() => {
    updateAppDesignInfo()
  }, [
    appDesignProperties.useOptionalDisclaimer,
    appDesignProperties.isUsingDefaultMessage,
    appDesignProperties.leadPrincipleInvestigator,
  ])

  const formatName = (currentAccount: OrgUser) => {
    const { firstName, lastName, email } = currentAccount
    const name = firstName || lastName ? [firstName, lastName].join(' ') : email
    return name
  }

  useEffect(() => {
    const getLeadResearchAccount = async () => {
      const accounts = await AccessService.getAccountsForOrg(
        token!,
        orgMembership!,
      )
      const promises = accounts.map(async account => {
        return await AccessService.getIndividualAccount(token!, account.id)
      })
      const admins = await Promise.all(promises).then(values => {
        return values.filter(account => account.roles.includes('org_admin'))
      })
      const leadInvestigatorArray = []
      for (let i = 0; i < admins.length; i++) {
        const currentAccount = admins[i]
        let currentObj = {
          name: formatName(currentAccount)!,
        }
        leadInvestigatorArray.push(currentObj)
      }
      setLeadInvestigatorOptions(leadInvestigatorArray)
    }
    getLeadResearchAccount()
  }, [])

  return (
    <Box className={classes.root}>
      <Paper className={classes.section} elevation={2}>
        <Box className={classes.fields}>
          <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
          <p className={classes.smallScreenText}>
            When a participant first downloads the app, they will see a Welcome
            screen.
            <br></br>
            <br></br>
            You can customize this screen by adding your own logo, background
            color, and message, or select a default message to be shown.
          </p>
          <div className={classes.switchContainer}>
            <Box marginRight="12px">Use default message</Box>
            <Box marginTop="4px">
              <AntSwitch
                checked={!currentAppDesign.isUsingDefaultMessage}
                onChange={() =>
                  setAppDesignProperties(prevState => {
                    return {
                      ...appDesignProperties,
                      isUsingDefaultMessage: !prevState.isUsingDefaultMessage,
                    }
                  })
                }
              ></AntSwitch>
            </Box>
            <Box marginLeft="12px">Customize</Box>
          </div>
          <div
            className={clsx(
              appDesignProperties.isUsingDefaultMessage && classes.hideSection,
            )}
          >
            <ol className={classes.steps}>
              <Subsection heading="Upload Study Logo">
                <p className={classes.intro}>
                  Customize your study by uploading a logo framed into a 320px x
                  80px size.
                </p>

                <div>
                  {`Study Logo: 320px x 80px ${
                    previewFile ? bytesToSize(previewFile.size) : ''
                  }`}
                  <div
                    style={{
                      padding: '8px 1px',
                      textAlign: 'center',
                      width: '320px',
                      height: `${imgHeight + 16}px`,
                      border: '1px solid black',
                    }}
                  >
                    {previewFile && (
                      <img
                        src={previewFile.body}
                        style={{ height: `${imgHeight}px`, width: '310px' }}
                      />
                    )}
                  </div>
                </div>

                {saveLoader && (
                  <div className="text-center">
                    <CircularProgress color="primary" />
                  </div>
                )}

                <Button
                  variant="contained"
                  component="label"
                  color="primary"
                  className={classes.uploadButton}
                >
                  Upload
                  <input
                    accept="image/*,.pdf,.doc,.docx,.jpg,.png, .txt"
                    id="file"
                    multiple={false}
                    type="file"
                    onChange={e => handleFileChange(e)}
                    style={{ display: 'none' }}
                  />
                </Button>
              </Subsection>
              <Subsection heading="Select background color">
                <p>
                  Select a background color that matches your institution or
                  study to be seen beneath your logo.
                </p>
                <Box width="250px" height="230px" marginLeft="-10px">
                  <ReactColorPicker
                    color={appDesignProperties.backgroundColor}
                    onChange={(currentColor: string) => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        backgroundColor: currentColor,
                      })
                      debouncedUpdateColor(currentColor)
                    }}
                  />
                </Box>
              </Subsection>

              <Subsection heading="Welcome screen messaging">
                <FormGroup className={classes.formFields}>
                  <FormControl className={classes.firstFormElement}>
                    <SimpleTextLabel htmlFor="headline-input">
                      Main Header
                    </SimpleTextLabel>
                    <SimpleTextInput
                      className={classes.headlineStyle}
                      id="headline-input"
                      placeholder="Welcome Headline"
                      value={appDesignProperties.welcomeScreenHeader}
                      onChange={e => {
                        setAppDesignProperties({
                          ...appDesignProperties,
                          welcomeScreenHeader: e.target.value,
                        })
                      }}
                      onBlur={() => updateAppDesignInfo()}
                      multiline
                      rows={2}
                      rowsMax={4}
                      inputProps={{
                        style: { fontSize: '24px', width: '100%' },
                      }}
                    />
                  </FormControl>
                  <FormControl>
                    <SimpleTextLabel>
                      Body Copy (maximum 250 characters)
                    </SimpleTextLabel>
                    <SimpleTextInput
                      id="outlined-textarea"
                      value={appDesignProperties.welcomeScreenBody}
                      onChange={e => {
                        setAppDesignProperties({
                          ...appDesignProperties,
                          welcomeScreenBody: e.target.value,
                        })
                      }}
                      onBlur={() => updateAppDesignInfo()}
                      multiline
                      rows={4}
                      rowsMax={6}
                      placeholder="What are the first things you want participants to know about the study."
                      inputProps={{ style: { width: '100%' }, maxLength: 250 }}
                    />
                  </FormControl>
                  <FormControl>
                    <SimpleTextLabel>Salutations</SimpleTextLabel>
                    <SimpleTextInput
                      id="salutations"
                      value={appDesignProperties.welcomeScreenSalutation}
                      onChange={e => {
                        setAppDesignProperties({
                          ...appDesignProperties,
                          welcomeScreenSalutation: e.target.value,
                        })
                      }}
                      onBlur={() => updateAppDesignInfo()}
                      multiline
                      rows={2}
                      rowsMax={4}
                      placeholder="Thank you for your contribution"
                      inputProps={{ style: SimpleTextInputStyles }}
                    />
                  </FormControl>
                  <FormControl>
                    <SimpleTextLabel>From</SimpleTextLabel>
                    <SimpleTextInput
                      id="signature-textarea"
                      value={appDesignProperties.welcomeScreenFromText}
                      onChange={e => {
                        setAppDesignProperties({
                          ...appDesignProperties,
                          welcomeScreenFromText: e.target.value,
                        })
                      }}
                      onBlur={() => updateAppDesignInfo()}
                      multiline
                      rows={2}
                      rowsMax={4}
                      placeholder="Study team name"
                      inputProps={{ style: SimpleTextInputStyles }}
                    />
                  </FormControl>
                  <Box marginTop="20px">Add optional disclaimer:</Box>
                  <div className={classes.optionalDisclaimerRow}>
                    <Checkbox
                      checked={appDesignProperties.useOptionalDisclaimer}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      className={classes.checkBox}
                      onChange={() => {
                        setAppDesignProperties(prevState => {
                          return {
                            ...appDesignProperties,
                            useOptionalDisclaimer: !prevState.useOptionalDisclaimer,
                          }
                        })
                      }}
                    ></Checkbox>
                    <div className={classes.optionalDisclaimerText}>
                      This is a research study and does not provide medical
                      advice, diagnosis, or treatment.
                    </div>
                  </div>
                </FormGroup>
                <Box textAlign="left">
                  {saveLoader ? (
                    <div className="text-center">
                      <CircularProgress
                        color="primary"
                        size={25}
                      ></CircularProgress>
                    </div>
                  ) : (
                    <SaveButton onClick={() => onSave()} />
                  )}
                </Box>
              </Subsection>
            </ol>
          </div>
          {appDesignProperties.isUsingDefaultMessage && (
            <div className={classes.hideSectionVisibility}>
              <ol className={classes.steps}>
                <li></li>
                <li></li>
                <li></li>
              </ol>
            </div>
          )}
        </Box>
        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={`${classes.phone}`}>
            <PhoneTopBar
              color={appDesignProperties.backgroundColor}
              previewFile={previewFile}
              isUsingDefaultMessage={appDesignProperties.isUsingDefaultMessage}
            />
            <div className={`${classes.phoneInner}`}>
              <div className={classes.headlineStyle}>
                {appDesignProperties.isUsingDefaultMessage
                  ? defaultHeader
                  : appDesignProperties.welcomeScreenHeader ||
                    'Welcome Headline'}
              </div>
              <p
                className={clsx(
                  classes.bodyText,
                  classes.firstPhoneScreenBodyText,
                )}
              >
                {appDesignProperties.isUsingDefaultMessage
                  ? defaultStudyBody
                  : appDesignProperties.welcomeScreenBody || 'Body copy'}
              </p>
              <div className={clsx(classes.bodyText, classes.salutationText)}>
                {appDesignProperties.isUsingDefaultMessage
                  ? defaultSalutations
                  : appDesignProperties.welcomeScreenSalutation ||
                    'Placeholder salutation,'}
              </div>
              <div className={clsx(classes.bodyText, classes.fromText)}>
                {appDesignProperties.isUsingDefaultMessage
                  ? defaultFrom
                  : appDesignProperties.welcomeScreenFromText ||
                    'from placeholder'}
              </div>
            </div>
            <div className={classes.phoneBottom}></div>
          </Box>
        </Box>
      </Paper>
      <Paper
        className={classes.section}
        elevation={2}
        onClick={() => {
          if (isLeadInvestigatorDropdownOpen) {
            setIsLeadInvestigatorDropdownOpen(false)
          }
        }}
      >
        <Box className={classes.fields}>
          <MTBHeadingH2>Study Page</MTBHeadingH2>
          <p className={classes.smallScreenText}>
            Within the app, there will be a dedicated page where you can
            describe your study further and list who to contact for participant
            support.
          </p>
          <ol className={classes.steps}>
            <Subsection heading="Study Summary">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="study-name-input">
                    Official Study Name*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="study-name-input"
                    placeholder="Headline"
                    value={appDesignProperties.studyTitle}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        studyTitle: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel>
                    Body Copy (maximum 500 characters)
                  </SimpleTextLabel>
                  <SimpleTextInput
                    id="study-body-text"
                    value={appDesignProperties.studySummaryBody}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        studySummaryBody: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={8}
                    rowsMax={10}
                    placeholder="Lorem ipsum"
                    inputProps={{ style: { width: '100%' }, maxLength: 500 }}
                  />
                </FormControl>
              </FormGroup>
            </Subsection>
            <Subsection heading="Information about the Study Leads">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <Box marginLeft="8px">Lead Principle Investigator*</Box>
                  <div>
                    <button
                      className={clsx(
                        classes.selectPrincipleInvestigatorButton,
                        !isLeadInvestigatorDropdownOpen &&
                          classes.selectPrincipleInvestigatorButtonClosed,
                      )}
                      onClick={() => {
                        setIsLeadInvestigatorDropdownOpen(
                          !isLeadInvestigatorDropdownOpen,
                        )
                      }}
                    >
                      {appDesignProperties.leadPrincipleInvestigator ||
                        'Select pricinple investigator'}
                      <img src={ChevronDownIcon} alt="chevron-down-logo"></img>
                    </button>
                    {isLeadInvestigatorDropdownOpen &&
                      leadInvestigatorOptions.length > 0 && (
                        <ul className={classes.principleInvestigatorDropdown}>
                          {leadInvestigatorOptions.map((el, index) => (
                            <option
                              className={clsx(
                                classes.principleInvestigatorOption,
                              )}
                              key={index}
                              value={el.name}
                              onClick={() => {
                                setIsLeadInvestigatorDropdownOpen(false)
                                setAppDesignProperties({
                                  ...appDesignProperties,
                                  leadPrincipleInvestigator: el.name,
                                })
                              }}
                            >
                              {el.name}
                            </option>
                          ))}
                        </ul>
                      )}
                  </div>
                  <p className={classes.principleInvestigatorsParagraph}>
                    Principle Investigators are required to be part of the study
                    as a “Study Administrator”.
                    <br></br>
                    <br></br>
                    If your PI is not listed in the dropdown, please add them to
                    the study and/or make them a{' '}
                    <strong>Co-Study Administrator</strong> via the{' '}
                    <strong>
                      <u>Access Settings</u>
                    </strong>{' '}
                    tab on the top right hand side.{' '}
                  </p>
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="institution-input">
                    Institution Affiliation*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="institution-input"
                    placeholder="Name of Institution"
                    value={appDesignProperties.institution}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        institution: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="funder-input">
                    Funder*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="funder-input"
                    placeholder="Name of Funder(s)"
                    value={appDesignProperties.funder}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        funder: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="IRB-approval-input">
                    IRB Approval Number*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="IRB-approval-input"
                    placeholder="XXXXXXXXXX"
                    value={appDesignProperties.IRBApprovalNumber}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        IRBApprovalNumber: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Subsection>
            <Subsection heading="General Contact and Support">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="contact-lead-input">
                    Contact Lead*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="contact-lead-input"
                    placeholder="First and Last name"
                    value={appDesignProperties.contactLead}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        contactLead: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
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
                    value={appDesignProperties.contactLeadRoleInStudy}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        contactLeadRoleInStudy: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="phone-number-contact-input">
                    Phone Number*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="phone-number-contact-input"
                    placeholder="xxx-xxx-xxxx"
                    value={appDesignProperties.contactLeadPhoneNumber}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        contactLeadPhoneNumber: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="contact-email-input">
                    Email*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="contact-email-input"
                    placeholder="Institutional Email"
                    value={appDesignProperties.contactLeadEmail}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        contactLeadEmail: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
              </FormGroup>
            </Subsection>
            <Subsection heading="IRB or Ethics Board Contact">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="ethics-board-input">
                    Name of IRB/Ethics Board*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-board-input"
                    placeholder="First and Last name"
                    value={appDesignProperties.nameOfEthicsBoard}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        nameOfEthicsBoard: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="ethics-phone-number-input">
                    Phone Number*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-phone-number-input"
                    placeholder="xxx-xxx-xxxx"
                    value={appDesignProperties.ethicsBoardPhoneNumber}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        ethicsBoardPhoneNumber: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{
                      style: SimpleTextInputStyles,
                    }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="ethics-email-input">
                    Email*
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-email-input"
                    placeholder="Institutional Email"
                    value={appDesignProperties.ethicsBoardEmail}
                    onChange={e => {
                      setAppDesignProperties({
                        ...appDesignProperties,
                        ethicsBoardEmail: e.target.value,
                      })
                    }}
                    onBlur={() => updateAppDesignInfo()}
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
                  <SaveButton onClick={() => onSave()} />
                )}
              </Box>
            </Subsection>
          </ol>
        </Box>

        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={classes.phone}>
            <PhoneTopBar
              color={appDesignProperties.backgroundColor}
              previewFile={previewFile}
              isUsingDefaultMessage={appDesignProperties.isUsingDefaultMessage}
            />
            <div className={classes.phoneInnerBottom}>
              <div className={classes.headlineStyle}>
                {appDesignProperties.studyTitle || 'Title of study...'}
              </div>
              <p className={classes.bodyText}>
                {appDesignProperties.studySummaryBody || 'Body...'}
              </p>
              <Divider className={classes.divider} />
              <StudySummaryRoles
                type="Lead Principal Investigator"
                name={
                  appDesignProperties.leadPrincipleInvestigator || 'placeholder'
                }
              />
              <StudySummaryRoles
                type="Institution"
                name={appDesignProperties.institution || 'placeholder'}
              />
              <StudySummaryRoles
                type="Funder"
                name={appDesignProperties.funder || 'placeholder'}
              />
              <StudySummaryRoles
                type="IRB Approval Number"
                name={appDesignProperties.IRBApprovalNumber || 'placeholder'}
              />
            </div>
            <div
              className={`${classes.phoneInnerBottom} ${classes.phoneGrayBackground}`}
            >
              <div className={classes.contactAndSupportText}>
                Contact & support
              </div>
              <p className={classes.bodyPhoneText}>
                For general questions about the study or to{' '}
                <strong>withdraw</strong> from the study, please contact:
              </p>
              <div className={classes.summaryRoles}>
                <StudySummaryRoles
                  type={
                    appDesignProperties.contactLeadRoleInStudy ||
                    'Role in study'
                  }
                  name={appDesignProperties.contactLead || 'Contact lead'}
                />
              </div>
              <ContactInformation
                phoneNumber={appDesignProperties.contactLeadPhoneNumber}
                email={appDesignProperties.contactLeadEmail}
              />
              <Divider className={classes.divider} />
              <p className={classes.bodyPhoneText}>
                For questions about your rights as a research participant,
                please contact :
              </p>
              <div className={classes.summaryRoles}>
                <StudySummaryRoles
                  type=""
                  name={
                    appDesignProperties.nameOfEthicsBoard || 'IRB/Ethics Board'
                  }
                />
              </div>
              <ContactInformation
                phoneNumber={appDesignProperties.ethicsBoardPhoneNumber}
                email={appDesignProperties.ethicsBoardEmail}
              />
            </div>
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
