import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormGroup,
  Paper,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ReactColorPicker from '@super-effective/react-color-picker'
import React, { ChangeEvent, useState } from 'react'
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
  StudyBuilderComponentProps,
  StudyAppDesign,
} from '../../../types/types'
import {
  MTBHeadingH1,
  MTBHeadingH2,
  MTBHeadingH4,
} from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import StudySummaryRoles from './StudySummaryRoles'
import ContactInformation from './ContactInformation'
import { ColorLensTwoTone } from '@material-ui/icons'

const imgHeight = 70

const useStyles = makeStyles((theme: ThemeType) => ({
  root: { counterReset: 'orderedlist' },
  bodyText: {
    fontFamily: 'Lato',
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: '25px',
  },
  bodyPhoneText: {
    fontFamily: 'Lato',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '15px',
    marginTop: '25px',
  },
  section: {
    padding: theme.spacing(9, 9, 5, 17),
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
    marginLeft: '9px',
    marginRight: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'left',
    height: `521px`,
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
    marginBottom: '10px',
  },
  divider: {
    width: '256px',
    marginTop: '30px',
  },
  phoneGrayBackground: {
    backgroundColor: '#F7F7F7',
  },
}))

type PreviewFile = {
  file: File
  name: string
  size: number
  body?: string
}

type UploadedFile = {
  success: boolean
  fileName: string
  message: string
}

export interface AppDesignProps {
  id: string
  currentAppDesign: StudyAppDesign
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
}> = ({ color = 'transparent', previewFile }) => {
  const classes = useStyles()
  return (
    <div className={classes.phoneTopBar} style={{ backgroundColor: color }}>
      {previewFile && (
        <img src={previewFile.body} style={{ height: `${imgHeight}px` }} />
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
}: AppDesignProps & StudyBuilderComponentProps) => {
  const handleError = useErrorHandler()

  const classes = useStyles()

  // color is not changing for some reason even tough setcolor is being callsed
  const [color, setColor] = useState<string | undefined>(
    currentAppDesign.backgroundColor || '#6040FF',
  )
  const [previewFile, setPreviewFile] = useState<PreviewFile>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [logo, setLogo] = useState()
  const [header, setHeader] = useState(
    currentAppDesign.welcomeScreenHeader || '',
  )
  const [bodyCopy, setBodyCopy] = useState(
    currentAppDesign.welcomeScreenBody || '',
  )
  const [signature, setSignature] = useState(
    currentAppDesign.welcomeScreenSignature || '',
  )
  const [titleOfStudy, setTitleOfStudy] = useState<string>(
    currentAppDesign.studyTitle || '',
  )
  const [studySummaryBodyText, setStudySummaryBodyText] = useState<string>(
    currentAppDesign.studySummaryBody || '',
  )
  const [
    leadPrincipleInvestigator,
    setLeadPrincipleInvestigator,
  ] = useState<String>(currentAppDesign.leadPrincicpleInvestigator || '')
  const [institution, setInstitution] = useState<String>(
    currentAppDesign.institution || '',
  )
  const [funder, setFunder] = useState<string>(currentAppDesign.funder || '')
  const [IRBApprovalNumber, setIRBApprovalNumber] = useState<string>(
    currentAppDesign.IRBApprovalNumber || '',
  )
  const [contactLead, setContactLead] = useState<string>(
    currentAppDesign.contactLead || '',
  )
  const [roleInStudy, setRoleInStudy] = useState<string>(
    currentAppDesign.contactLeadRoleInStudy || '',
  )
  const [contactPhoneNumber, setContactPhoneNumber] = useState<string>(
    currentAppDesign.contactLeadPhoneNumber || '',
  )
  const [contactEmail, setContactEmail] = useState<string>(
    currentAppDesign.contactLeadEmail || '',
  )
  const [nameOfEthicsBoard, setNameOfEthicsBoard] = useState<string>(
    currentAppDesign.nameOfEthicsBoard || '',
  )
  const [ethicsBoardPhoneNumber, setEthicsBoardPhoneNumber] = useState<string>(
    currentAppDesign.ethicsBoardPhoneNumber || '',
  )
  const [ethicsBoardEmail, setEthicsBoardEmail] = useState<string>(
    currentAppDesign.ethicsBoardEmail || '',
  )

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist()
    if (!event.target.files) {
      return
    }
    const file = event.target.files[0]
    setPreviewFile(getPreviewForImage(file))
  }

  const updateAppDesignInfo = () => {
    const info = {
      logo: '',
      backgroundColor: color,
      welcomeScreenHeader: header,
      welcomeScreenBody: bodyCopy,
      welcomeScreenSignature: signature,
      studyTitle: titleOfStudy,
      studySummaryBody: studySummaryBodyText,
      leadPrincicpleInvestigator: leadPrincipleInvestigator,
      institution: institution,
      funder: funder,
      IRBApprovalNumber: IRBApprovalNumber,
      contactLead: contactLead,
      contactLeadRoleInStudy: roleInStudy,
      contactLeadPhoneNumber: contactPhoneNumber,
      contactLeadEmail: contactEmail,
      nameOfEthicsBoard: nameOfEthicsBoard,
      ethicsBoardPhoneNumber: ethicsBoardPhoneNumber,
      ethicsBoardEmail: ethicsBoardEmail,
    } as StudyAppDesign
    onUpdate(info)
  }

  return (
    <Box className={classes.root}>
      <Paper className={classes.section} elevation={2}>
        <Box className={classes.fields}>
          <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
          <p style={{ fontSize: '15px', marginTop: '30px' }}>
            When a participant first downloads the app, they will see a Welcome
            screen. You can customize this screen by adding your own logo,
            background color and Welcome message.
          </p>
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
                style={{ marginTop: '20px' }}
              >
                Upload
                <input
                  accept="image/*,.pdf,.doc,.docx,.jpg,.png, .txt"
                  id="file"
                  multiple={false}
                  type="file"
                  onChange={e => handleFileChange(e)}
                  onBlur={() => updateAppDesignInfo()}
                  style={{ display: 'none' }}
                />
              </Button>
            </Subsection>
            <Subsection heading="Select background color">
              <p>
                Select a background color that matches your institution or study
                to be seen beneath your logo.
              </p>
              <Box
                border="1px colid black"
                width="250px"
                height="230px"
                marginLeft="-10px"
              >
                <ReactColorPicker
                  color={color}
                  onChange={(currentColor: string) => {
                    console.log('the current color is changed to', currentColor)
                    console.log('the set color is', color)
                    setColor(currentColor)
                  }}
                  onInteractionEnd={() => {
                    updateAppDesignInfo()
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
                    value={header}
                    onChange={e => {
                      setHeader(e.target.value)
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={2}
                    rowsMax={4}
                    inputProps={{ style: { fontSize: '24px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel>Body Copy</SimpleTextLabel>
                  <SimpleTextInput
                    id="outlined-textarea"
                    value={bodyCopy}
                    onChange={e => setBodyCopy(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={4}
                    rowsMax={6}
                    placeholder="What are the first things you want participants to know about the study."
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel>Signature</SimpleTextLabel>
                  <SimpleTextInput
                    id="signature-textarea"
                    value={signature}
                    onChange={e => setSignature(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={2}
                    rowsMax={4}
                    placeholder=""
                  />
                </FormControl>
              </FormGroup>
              <Box textAlign="right">
                <SaveButton onClick={() => alert('save')} />
              </Box>
            </Subsection>
          </ol>
        </Box>
        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={classes.phone}>
            <PhoneTopBar color={color} previewFile={previewFile} />
            <div className={classes.phoneInner}>
              <div className={classes.headlineStyle}>
                {header || 'Welcome Headline'}
              </div>
              <p className={classes.bodyText}>{bodyCopy || 'Body copy'}</p>
            </div>
            <div className={classes.phoneBottom}></div>
          </Box>
        </Box>
      </Paper>
      <Paper className={classes.section} elevation={2}>
        <Box className={classes.fields}>
          <MTBHeadingH2>Study Page</MTBHeadingH2>
          <p style={{ fontSize: '15px', marginTop: '30px' }}>
            Within the app, there will be a dedicated page where you can
            describe your study further and list who to contact for participant
            support.
          </p>
          <ol className={classes.steps}>
            <Subsection heading="Study Summary">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="study-name-input">
                    Title of Study
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.headlineStyle}
                    id="study-name-input"
                    placeholder="Headline"
                    value={titleOfStudy}
                    onChange={e => {
                      setTitleOfStudy(e.target.value)
                    }}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={2}
                    rowsMax={4}
                    inputProps={{ style: { fontSize: '24px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel>Body Copy</SimpleTextLabel>
                  <SimpleTextInput
                    id="study-body-text"
                    value={studySummaryBodyText}
                    onChange={e => setStudySummaryBodyText(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={8}
                    rowsMax={10}
                    placeholder="Lorem ipsum"
                  />
                </FormControl>
              </FormGroup>
            </Subsection>
            <Subsection heading="Information about the Study Leads">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="lead-investigator-input">
                    Lead pricinple investigator
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="lead-investigator-input"
                    placeholder="First and Last name"
                    value={leadPrincipleInvestigator}
                    onChange={e => setLeadPrincipleInvestigator(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="institution-input">
                    Institution
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="institution-input"
                    placeholder="Name of Institution"
                    value={institution}
                    onChange={e => setInstitution(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="funder-input">
                    Funder
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="funder-input"
                    placeholder="Name of Funder(s)"
                    value={funder}
                    onChange={e => setFunder(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="IRB-approval-input">
                    IRB Approval Number
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="IRB-approval-input"
                    placeholder="XXXXXXXXXX"
                    value={IRBApprovalNumber}
                    onChange={e => setIRBApprovalNumber(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
              </FormGroup>
            </Subsection>
            <Subsection heading="General Contact and Support">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="contact-lead-input">
                    Contact Lead
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="contact-lead-input"
                    placeholder="First and Last name"
                    value={contactLead}
                    onChange={e => setContactLead(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="role-in-study-input">
                    Role in the Study
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="role-in-study-input"
                    placeholder="Title of Position"
                    value={roleInStudy}
                    onChange={e => setRoleInStudy(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="phone-number-contact-input">
                    Phone Number
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="phone-number-contact-input"
                    placeholder="xxx-xxx-xxxx"
                    value={contactPhoneNumber}
                    onChange={e => setContactPhoneNumber(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="contact-email-input">
                    Email
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="contact-email-input"
                    placeholder="Institutional Email"
                    value={contactEmail}
                    onChange={e => setContactEmail(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
              </FormGroup>
            </Subsection>
            <Subsection heading="IRB or Ethics Board Contact">
              <FormGroup className={classes.formFields}>
                <FormControl className={classes.firstFormElement}>
                  <SimpleTextLabel htmlFor="ethics-board-input">
                    Name of IRB/Ethics Board
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-board-input"
                    placeholder="First and Last name"
                    value={nameOfEthicsBoard}
                    onChange={e => setNameOfEthicsBoard(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="ethics-phone-number-input">
                    Phone Number
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-phone-number-input"
                    placeholder="xxx-xxx-xxxx"
                    value={ethicsBoardPhoneNumber}
                    onChange={e => setEthicsBoardPhoneNumber(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel htmlFor="ethics-email-input">
                    Email
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.informationRowStyle}
                    id="ethics-email-input"
                    placeholder="Institutional Email"
                    value={ethicsBoardEmail}
                    onChange={e => setEthicsBoardEmail(e.target.value)}
                    onBlur={() => updateAppDesignInfo()}
                    multiline
                    rows={1}
                    rowsMax={1}
                    inputProps={{ style: { fontSize: '15px' } }}
                  />
                </FormControl>
              </FormGroup>
              <Box textAlign="right">
                <SaveButton onClick={() => alert('save')} />
              </Box>
            </Subsection>
          </ol>
        </Box>

        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={classes.phone}>
            <PhoneTopBar color={color} previewFile={previewFile} />
            <div className={classes.phoneInner}>
              <div className={classes.headlineStyle}>
                {titleOfStudy || 'Title of study...'}
              </div>
              <p className={classes.bodyText}>
                {studySummaryBodyText || 'Body...'}
              </p>
              <Divider className={classes.divider} />
              <StudySummaryRoles
                type="Lead Principal Investigator"
                name={leadPrincipleInvestigator || 'placeholder'}
              />
              <StudySummaryRoles
                type="Institution"
                name={institution || 'placeholder'}
              />
              <StudySummaryRoles type="Funder" name={funder || 'placeholder'} />
              <StudySummaryRoles
                type="IRB Approval Number"
                name={IRBApprovalNumber || 'placeholder'}
              />
            </div>
            <div
              className={`${classes.phoneInner} ${classes.phoneGrayBackground}`}
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
                  type={roleInStudy || 'Role in study'}
                  name={contactLead || 'Contact lead'}
                />
              </div>
              <ContactInformation
                phoneNumber={contactPhoneNumber}
                email={contactEmail}
              />
              <Divider className={classes.divider} />
              <p className={classes.bodyPhoneText}>
                For questions about your rights as a research participant,
                please contact :
              </p>
              <div className={classes.summaryRoles}>
                <StudySummaryRoles
                  type=""
                  name={nameOfEthicsBoard || 'IRB/Ethics Board'}
                />
              </div>
              <ContactInformation
                phoneNumber={ethicsBoardPhoneNumber}
                email={ethicsBoardEmail}
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
