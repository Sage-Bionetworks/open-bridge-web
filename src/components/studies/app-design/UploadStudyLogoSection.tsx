import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Box, Button, CircularProgress} from '@material-ui/core'
import Subsection from './Subsection'

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
  studyLogoUrl?: string
  isSettingStudyLogo: boolean
}

const UploadStudyLogoSection: React.FunctionComponent<UploadStudyLogoSection> = ({
  handleFileChange,
  imgHeight,
  saveLoader,
  studyLogoUrl,
  isSettingStudyLogo,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Upload Study Logo">
      <Box>
        <Box className={classes.studyLogoUploadText}>
          Recommended dimensions are 320px x 80px
        </Box>

        <Box
          style={{
            padding: '8px 1px',
            textAlign: 'center',
            width: '320px',
            height: `${imgHeight + 16}px`,
            border: '1px solid black',
          }}>
          {studyLogoUrl && (
            <img
              src={studyLogoUrl}
              style={{height: `${imgHeight}px`, width: '310px'}}
            />
          )}
        </Box>
      </Box>

      {saveLoader && (
        <Box className="text-center">
          <CircularProgress color="primary" />
        </Box>
      )}
      {isSettingStudyLogo ? (
        <CircularProgress color="primary" className={classes.uploadButton} />
      ) : (
        <Button
          variant="contained"
          component="label"
          color="primary"
          className={classes.uploadButton}>
          Upload
          <input
            accept="image/*,.pdf,.jpg,.png,.svg"
            id="file"
            multiple={false}
            type="file"
            onChange={e => handleFileChange(e)}
            style={{display: 'none'}}
          />
        </Button>
      )}
    </Subsection>
  )
}

export default UploadStudyLogoSection
