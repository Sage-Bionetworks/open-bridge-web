import {ReactComponent as DeleteIcon} from '@assets/trash.svg'
import {Box, Button, CircularProgress, IconButton} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import Subsection from './widgets/Subsection'

const useStyles = makeStyles(theme => ({
  uploadButton: {
    marginTop: theme.spacing(2.5),
  },
  studyLogoUploadText: {
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
  },
  imagePreviewBox: {
    textAlign: 'center',
    width: '320px',
    border: '1px solid black',
    boxSizing: 'content-box',
  },
}))

type UploadStudyLogoSection = {
  handleFileChange: Function
  imgHeight: number
  saveLoader: boolean
  studyLogoUrl?: string

  isSettingStudyLogo: boolean
}

const UploadStudyLogoSection: React.FunctionComponent<UploadStudyLogoSection> =
  ({
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
            Files should be in .jpg, .png. Recommended dimensions are 1280px x
            320px.
          </Box>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <Box
              className={classes.imagePreviewBox}
              style={{
                height: `${imgHeight}px`,
              }}>
              {studyLogoUrl && (
                <img src={studyLogoUrl} style={{height: `${imgHeight}px`}} />
              )}
            </Box>
            {studyLogoUrl && (
              <IconButton
                style={{height: '40px'}}
                onClick={e => handleFileChange(undefined)}>
                <DeleteIcon />
              </IconButton>
            )}
          </div>
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
              accept="image/*,.jpg,.png"
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
