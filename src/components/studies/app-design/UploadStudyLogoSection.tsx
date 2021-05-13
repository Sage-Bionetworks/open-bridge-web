import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Button, CircularProgress } from '@material-ui/core'
import Subsection from './Subsection'
import { PreviewFile } from './AppDesign'
import { bytesToSize } from '../../../helpers/utility'

const useStyles = makeStyles(theme => ({
  uploadButton: {
    marginTop: theme.spacing(2.5),
  },
  studyLogoUploadText: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
}))

type UploadStudyLogoSection = {
  handleFileChange: Function
  imgHeight: number
  saveLoader: boolean
  previewFile: PreviewFile | undefined
}

const UploadStudyLogoSection: React.FunctionComponent<UploadStudyLogoSection> = ({
  handleFileChange,
  imgHeight,
  saveLoader,
  previewFile,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Upload Study Logo">
      <Box>
        <Box className={classes.studyLogoUploadText}>
          {`Study Logo: 320px x 80px ${
            previewFile ? bytesToSize(previewFile.size) : ''
          }`}
        </Box>

        <Box
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
        </Box>
      </Box>

      {saveLoader && (
        <Box className="text-center">
          <CircularProgress color="primary" />
        </Box>
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
  )
}

export default UploadStudyLogoSection
