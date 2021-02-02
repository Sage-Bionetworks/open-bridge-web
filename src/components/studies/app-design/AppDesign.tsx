import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TextField,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import ReactColorPicker from '@super-effective/react-color-picker'
import React, { ChangeEvent, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
//import { ReactComponent as PhoneBg } from '../../../assets/phone_bg.svg'
import PhoneBg from '../../../assets/phone_bg.svg'
import { useNavigate, useStudy } from '../../../helpers/hooks'
import { bytesToSize } from '../../../helpers/utility'
import { ThemeType } from '../../../style/theme'
import { StudySection } from '../sections'

const topBarHeight = '48px'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
  section: {
    display: 'flex',
  },
  phone: {
    backgroundImage: 'url(' + PhoneBg + ')',
    width: '308px',
    height: '635px',
    backgroundRepeat: 'no-repeat',
  },
  phoneTopBar: {
    width: '100%',
    height: topBarHeight,
    borderRadius: '40px 40px 0 0',
    //backgroundColor: 'red',
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
    marginLeft: theme.spacing(2),
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
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

  onNavigate: Function
  section: StudySection
  nextSection: StudySection
  children?: React.ReactNode
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

const AppDesign: React.FunctionComponent<AppDesignProps> = ({
  id,
  section,
  nextSection,
  onNavigate
}: AppDesignProps) => {
  const handleError = useErrorHandler()

  const classes = useStyles()

  const { data, status, error } = useStudy(id)

  const [color, setColor] = useState<string | undefined>()
  const [previewFile, setPreviewFile] = useState<PreviewFile>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])


  const [logo, setLogo] = useState()


  const {hasObjectChanged, setHasObjectChanged, saveLoader,  save} = useNavigate(section, nextSection, async()=>{
  
  }, ()=> onNavigate(nextSection, data))

  
  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    event.persist()
    if (!event.target.files) {
      return
    }
    const file = event.target.files[0]
    setPreviewFile(getPreviewForImage(file))
  }

  const getActionButtons = (file?: File): JSX.Element => {
    const getUploadButton = (
      cta: string,
      variant?: 'contained' | 'outlined',
    ) => (
      <Button
        variant={variant || 'contained'}
        component="label"
        fullWidth
        color="primary"
        style={{ marginTop: '20px' }}
      >
        {cta}
        <input
          accept="image/*,.pdf,.doc,.docx,.jpg,.png, .txt"
          id="file"
          multiple={false}
          type="file"
          onChange={e => handleFileChange(e)}
          style={{ display: 'none' }}
        />
      </Button>
    )

    return getUploadButton('Upload')
  }

  if (status === 'PENDING') {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'RESOLVED') {
    return (
      <Paper className={classes.root} elevation={2}>
        <Box className={classes.section}>
          <Box className={classes.phone}>
            <div
              className={classes.phoneTopBar}
              style={{ backgroundColor: color || 'transparent' }}
            >
              {previewFile && (
                <img src={previewFile.body} style={{ height: topBarHeight }} />
              )}
            </div>
            phone
          </Box>
          <Box className={classes.fields}>
            <div className={classes.preview}>
              {previewFile && (
                <div>
                  {previewFile.name} ({bytesToSize(previewFile.size)})
                </div>
              )}
            </div>

            {saveLoader && (
              <div className="text-center">
                <CircularProgress color="primary" />
              </div>
            )}
            <Typography variant="h4"> Upload logo</Typography>
            {getActionButtons(previewFile?.file)}
            <p>&nbsp;</p>
            <Typography variant="h4"> Select Log background color</Typography>

            <ReactColorPicker
              color={color}
              onChange={(color: string) => setColor(color)}
            />

            <TextField
              id="outlined-textarea"
              label="Multiline Placeholder"
              placeholder="Placeholder"
              multiline
              variant="outlined"
            />
            <TextField
              id="outlined-multiline-static"
              label="Multiline"
              multiline
              rows={4}
              defaultValue="Default Value"
              variant="outlined"
            />
          </Box>
        </Box>
        <Divider />
        <Box>box2</Box>
        <Divider />
        <Box>box3</Box>
        jsx-output-here appdesign
      </Paper>
    )
  }
  return <></>
}

export default AppDesign
