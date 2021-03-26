import {
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormGroup,
  Paper
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
  ThemeType
} from '../../../style/theme'
import { StudyBuilderComponentProps } from '../../../types/types'
import {
  MTBHeadingH1,
  MTBHeadingH2,
  MTBHeadingH4
} from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import {
  SimpleTextInput,
  SimpleTextLabel
} from '../../widgets/StyledComponents'

const imgHeight = 70

const useStyles = makeStyles((theme: ThemeType) => ({
  root: { counterReset: 'orderedlist' },
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
    '& textarea': {
      fontFamily: playfairDisplayFont,
      fontStyle: 'italic',
      fontWeight: 'normal',
      fontSize: '21px',
      lineHeight: '28px',
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
    minHeight: '600px',
    marginTop: theme.spacing(4),
    backgroundRepeat: 'no-repeat',
    justifyContent: 'space-between',
  },
  phoneInner: {
    marginLeft: '9px',
    marginRight: theme.spacing(1),
    padding: theme.spacing(4),
    textAlign: 'left',
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
    paddingTop: '10px',

    borderStyle: 'solid',
    borderWidth: '3px 3px 1px 3px',
    borderColor: 'black',
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
      <div>
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
}: AppDesignProps & StudyBuilderComponentProps) => {
  const handleError = useErrorHandler()

  const classes = useStyles()

  const [color, setColor] = useState<string | undefined>()
  const [previewFile, setPreviewFile] = useState<PreviewFile>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const [logo, setLogo] = useState()
  const [header, setHeader] = useState('')
  const [bodyCopy, setBodyCopy] = useState('')
  const [signature, setSignature] = useState('')

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist()
    if (!event.target.files) {
      return
    }
    const file = event.target.files[0]
    setPreviewFile(getPreviewForImage(file))
  }

  return (
    <Box className={classes.root}>
      <Paper className={classes.section} elevation={2}>
        <Box className={classes.fields}>
          <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
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
                    border: '1px solid black',
                    textAlign: 'center',
                    width: '320px',
                    height: `${imgHeight + 16}px`,
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
                  onChange={(color: string) => setColor(color)}
                />
              </Box>
            </Subsection>

            <Subsection heading="Welcome screen messaging">
              <p>
                When a participant first downloads the app and enters the study,
                they will see a Welcome screen as the first step in the
                onboarding experience.
              </p>
              <p>What information would you like to display here?</p>
              <FormGroup className={classes.formFields}>
                <FormControl>
                  <SimpleTextLabel htmlFor="headline-input">
                    Main Header
                  </SimpleTextLabel>
                  <SimpleTextInput
                    className={classes.headlineStyle}
                    id="headline-input"
                    placeholder="Welcome Headline"
                    value={header}
                    onChange={e => setHeader(e.target.value)}
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
                    multiline
                    rows={4}
                    rowsMax={6}
                    placeholder="What are the first things you want participants to know about the study."
                  />
                </FormControl>
                <FormControl>
                  <SimpleTextLabel>Signature</SimpleTextLabel>
                  <SimpleTextInput
                    id="outlined-textarea"
                    value={signature}
                    onChange={e => setSignature(e.target.value)}
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
              <div className={classes.headlineStyle}>{header}</div>
              <p>{bodyCopy}</p>
            </div>
            <div className={classes.phoneBottom}></div>
          </Box>
        </Box>
      </Paper>
      <Paper className={classes.section} elevation={2}>
        <Box className={classes.fields}>
          <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
          <ol className={classes.steps}>
            <li>another</li>
            <li>another</li>
          </ol>
        </Box>

        <Box className={classes.phoneArea}>
          <MTBHeadingH1>What participants will see: </MTBHeadingH1>
          <Box className={classes.phone}>
            <PhoneTopBar color={color} previewFile={previewFile} />
            <Box
              bgcolor="#FDFDFD"
              marginLeft="9px"
              marginRight="8px"
              px={4}
              textAlign="left"
            >
              Description about the study.Lorem ipsum about the study written by
              the research team that they want to share to participants. Lorem
              ipsum about the study written by the research team that they want
              to share to participants. Lorem ipsum about the study written by
              the research team that they want to share to participants.
              <Divider />
              <MTBHeadingH4>Name one</MTBHeadingH4>
              lorem inpsum
              <Box bgcolor="#F7F7F7">
                For general questions
                <Divider />
              </Box>
              fgdgdg
            </Box>
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
