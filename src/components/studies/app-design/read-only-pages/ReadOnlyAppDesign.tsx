import {Box, Paper} from '@material-ui/core'
import React from 'react'
import {Study} from '../../../../types/types'
import {MTBHeadingH2} from '../../../widgets/Headings'
import {
  useStyles as AppDesignSharedStyles,
  formatPhoneNumber,
  getContact,
  WelcomeScreenDisplay,
  StudyPageTopPhone,
  StudyPageBottomPhone,
} from '../AppDesign'

const ReadOnlyAppDesign: React.FunctionComponent<{
  children: React.ReactNode
  study: Study
  getContactPersonObject: Function
}> = ({children, study, getContactPersonObject}) => {
  const AppDesignClasses = AppDesignSharedStyles()
  const generalContactPhoneNumber =
    getContact(study, 'study_support')?.phone?.number || ''
  const irbPhoneNumber = formatPhoneNumber(
    getContact(study, 'irb')?.phone?.number || ''
  )

  return (
    <>
      <Box className={AppDesignClasses.root}>
        <Paper
          className={AppDesignClasses.section}
          style={{flexDirection: 'column'}}
          elevation={2}
          id="container">
          <Box className={AppDesignClasses.fields}>
            <MTBHeadingH2>WELCOME SCREEN</MTBHeadingH2>
            <p
              className={AppDesignClasses.smallScreenText}
              style={{maxWidth: '350px'}}>
              When a participant first downloads the app, they will see this
              Welcome screen message:
            </p>
          </Box>
          <Box className={AppDesignClasses.phoneArea}>
            <Box ml={-3}>
              <WelcomeScreenDisplay study={study} isReadOnly={true} />
            </Box>
          </Box>
        </Paper>
        <Paper
          className={AppDesignClasses.section}
          style={{flexDirection: 'column'}}
          elevation={2}>
          <Box className={AppDesignClasses.fields}>
            <MTBHeadingH2>Study Page</MTBHeadingH2>
            <p className={AppDesignClasses.smallScreenText}>
              Your About the Study and Contact & Support pages will look like
              this:
            </p>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            ml={-1}>
            <StudyPageTopPhone
              study={study}
              getContactPersonObject={getContactPersonObject}
              isReadOnly={true}
            />
            <StudyPageBottomPhone
              study={study}
              getContactPersonObject={getContactPersonObject}
              generalContactPhoneNumber={generalContactPhoneNumber}
              irbPhoneNumber={irbPhoneNumber}
              isReadOnly={true}
            />
          </Box>
        </Paper>
      </Box>
      {children}
    </>
  )
}

export default ReadOnlyAppDesign
