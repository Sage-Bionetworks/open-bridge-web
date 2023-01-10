import {Box, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {SubType, WelcomeScreenData} from '@typedefs/types'
import React from 'react'
import SectionIndicator from '../widgets/SectionIndicator'

const useStyles = makeStyles(theme => ({
  phoneInner: {
    marginLeft: theme.spacing(0.75),
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(4),
    textAlign: 'left',
    minHeight: `475px`,
    paddingTop: theme.spacing(5.5),
  },
  sectionThreeIndicatorPosition: {
    position: 'absolute',
    marginLeft: theme.spacing(-6),
    marginTop: theme.spacing(-0.25),
  },

  fromText: {
    marginTop: theme.spacing(1),
  },

  salutationText: {
    marginTop: theme.spacing(5),
  },
  disclaimerText: {
    marginTop: theme.spacing(10),
    fontStyle: 'italic',
  },
}))

type WelcomeScreenPhoneContentProps = {
  welcomeScreenContent: WelcomeScreenData
  studyTitle: string
  isReadOnly?: boolean
}

type WelcomeScreenStrings = keyof SubType<WelcomeScreenData, string>

export const DEFAULT_TEXT: {[K in WelcomeScreenStrings]: string} = {
  welcomeScreenHeader: 'Welcome to \n[STUDY_TITLE]!',
  welcomeScreenBody: 'We are excited that you will be participating. We hope that you find this study helpful.',
  welcomeScreenSalutation: 'Sincerely,',
  welcomeScreenFromText: 'The [STUDY_TITLE] team',
}

const PLACEHOLDER_TEXT: {[K in WelcomeScreenStrings]: string} = {
  welcomeScreenHeader: 'Main Header',
  welcomeScreenBody: 'Body Copy',
  welcomeScreenSalutation: 'Salutation,',
  welcomeScreenFromText: 'Study Team Name',
}

const WelcomeScreenPhoneContent: React.FunctionComponent<WelcomeScreenPhoneContentProps> = ({
  welcomeScreenContent,
  studyTitle,
  isReadOnly,
}) => {
  const classes = useStyles()

  function getMessage(field: WelcomeScreenStrings): string {
    if (welcomeScreenContent.isUsingDefaultMessage) {
      return DEFAULT_TEXT[field].replace('[STUDY_TITLE]', studyTitle)
    } else {
      return welcomeScreenContent[field] || PLACEHOLDER_TEXT[field]
    }
  }

  return (
    <Box className={classes.phoneInner}>
      {!welcomeScreenContent.isUsingDefaultMessage && !isReadOnly && (
        <SectionIndicator index={3} className={classes.sectionThreeIndicatorPosition} />
      )}
      <Typography variant="h3">{getMessage('welcomeScreenHeader')}</Typography>
      <p>{getMessage('welcomeScreenBody')}</p>
      <p>{getMessage('welcomeScreenSalutation')}</p>
      <p className={classes.fromText}>{getMessage('welcomeScreenFromText')}</p>
      {welcomeScreenContent.isUsingDefaultMessage && (
        <p className={classes.disclaimerText}>
          This is a research Study. It does not provide medical advice, diagnosis, or treatment.
        </p>
      )}
    </Box>
  )
}

export default WelcomeScreenPhoneContent
