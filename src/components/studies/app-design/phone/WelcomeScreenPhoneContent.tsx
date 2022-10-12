import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, playfairDisplayFont} from '@style/theme'
import {SubType, WelcomeScreenData} from '@typedefs/types'
import clsx from 'clsx'
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
  headlineStyle: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '21px',
    lineHeight: '28px',
    whiteSpace: 'pre-line',
  },
  fromText: {
    marginTop: theme.spacing(1),
  },
  bodyText: {
    fontFamily: latoFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: theme.spacing(3),
    whiteSpace: 'pre-line',
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
      <Box className={classes.headlineStyle}>{getMessage('welcomeScreenHeader')}</Box>
      <p className={clsx(classes.bodyText)}>{getMessage('welcomeScreenBody')}</p>
      <Box className={clsx(classes.bodyText, classes.salutationText)}>{getMessage('welcomeScreenSalutation')}</Box>
      <Box className={clsx(classes.bodyText, classes.fromText)}>{getMessage('welcomeScreenFromText')}</Box>
      {welcomeScreenContent.isUsingDefaultMessage && (
        <Box className={clsx(classes.bodyText, classes.disclaimerText)}>
          This is a research Study. It does not provide medical advice, diagnosis, or treatment.
        </Box>
      )}
    </Box>
  )
}

export default WelcomeScreenPhoneContent
