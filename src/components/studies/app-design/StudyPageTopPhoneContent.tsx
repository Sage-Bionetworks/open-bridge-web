import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Divider } from '@material-ui/core'
import StudySummaryRoles from './StudySummaryRoles'
import SectionIndicator from './SectionIndicator'
import { Contact } from '../../../types/types'
import { latoFont, playfairDisplayFont } from '../../../style/theme'
import DefaultLogo from '../../../assets/logo_mtb.svg'
import { PreviewFile } from './AppDesign'

const useStyles = makeStyles(theme => ({
  sectionFourIndicatorPosition: {
    position: 'absolute',
    marginLeft: theme.spacing(-7),
    top: theme.spacing(2.5),
  },
  headlineStyle: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '21px',
    lineHeight: '28px',
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  bodyText: {
    fontFamily: latoFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: theme.spacing(3),
    whiteSpace: 'pre-line',
    textAlign: 'left',
    height: '350px',
  },
  divider: {
    width: '256px',
    marginTop: theme.spacing(3.75),
    marginBottom: theme.spacing(3.75),
  },
  sectionFiveIndicatorPosition: {
    position: 'absolute',
    marginLeft: theme.spacing(-7),
    top: theme.spacing(63)
  },
  container: {
    padding: theme.spacing(2, 2, 2, 2.25),
    width: '311px',
    backgroundColor: '#F6F6F6',
    marginLeft: theme.spacing(1.25),
  },
  innerContainer: {
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    padding: theme.spacing(3, 2, 3, 2),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
  },
  studySummaryRoles: {
    marginBottom: theme.spacing(3),
  },
  studyLogoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '80px',
  },
}))

type StudyPageTopPhoneContentProps = {
  isUsingDefaultMessage: boolean
  imgHeight: number
  appColor: string
  previewFile: PreviewFile | undefined
  studyTitle: string
  studySummaryBody: string
  leadInvestigator: Contact
  funder: Contact
}

const StudyPageTopPhoneContent: React.FunctionComponent<StudyPageTopPhoneContentProps> = ({
  isUsingDefaultMessage,
  imgHeight,
  appColor,
  previewFile,
  studyTitle,
  studySummaryBody,
  leadInvestigator,
  funder,
}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Box
        className={classes.studyLogoContainer}
        style={{
          backgroundColor: isUsingDefaultMessage ? '#BCD5E4' : appColor,
        }}
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
      </Box>
      <Box className={classes.innerContainer}>
        <SectionIndicator
          index={4}
          className={classes.sectionFourIndicatorPosition}
        />
        <Box height="420px">
          <Box className={classes.headlineStyle}>
            {studyTitle || 'Title of study...'}
          </Box>
          <p className={classes.bodyText}>{studySummaryBody || 'Body...'}</p>
        </Box>

        <Divider className={classes.divider} />
        <StudySummaryRoles
          type="Lead Principal Investigator"
          name={leadInvestigator.name || 'placeholder'}
          className={classes.studySummaryRoles}
        />
        <SectionIndicator
          index={5}
          className={classes.sectionFiveIndicatorPosition}
        />

        <StudySummaryRoles
          type="Institution"
          name={leadInvestigator.affiliation || 'placeholder'}
          className={classes.studySummaryRoles}
        />
        <StudySummaryRoles
          type="Funder"
          name={funder.name || 'placeholder'}
          className={classes.studySummaryRoles}
        />
      </Box>
    </Box>
  )
}

export default StudyPageTopPhoneContent
