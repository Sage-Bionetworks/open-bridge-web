import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {WelcomeScreenData} from '../../../types/types'
import {Box} from '@material-ui/core'
import SectionIndicator from './SectionIndicator'
import clsx from 'clsx'
import {latoFont, playfairDisplayFont} from '../../../style/theme'

const useStyles = makeStyles(theme => ({
  phoneInner: {
    marginLeft: theme.spacing(0.75),
    marginRight: theme.spacing(0.5),
    padding: theme.spacing(4),
    textAlign: 'left',
    minHeight: `521px`,
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
    marginTop: '25px',
    whiteSpace: 'pre-line',
  },
  salutationText: {
    marginTop: theme.spacing(2.5),
  },
  firstPhoneScreenBodyText: {
    height: '325px',
  },
}))

type WelcomeScreenPhoneContentProps = {
  welcomeScreenContent: WelcomeScreenData
  studyTitle: string
}

const WelcomeScreenPhoneContent: React.FunctionComponent<WelcomeScreenPhoneContentProps> = ({
  welcomeScreenContent,
  studyTitle,
}) => {
  const classes = useStyles()
  const defaultStudyBody =
    'We’re excited to have you help us in conduting this study! \n \n This is a research study and does not provide medical advice, diagnosis, or treatment.'
  const defaultSalutations = 'Thank you for your contributions,'
  const defaultFrom = 'Research Team X'

  return (
    <Box className={classes.phoneInner}>
      {!welcomeScreenContent.isUsingDefaultMessage && (
        <SectionIndicator
          index={3}
          className={classes.sectionThreeIndicatorPosition}
        />
      )}
      <Box className={classes.headlineStyle}>
        {welcomeScreenContent.isUsingDefaultMessage
          ? 'Thanks for joining \n' + studyTitle
          : welcomeScreenContent.welcomeScreenHeader || 'Welcome Headline'}
      </Box>
      <p className={clsx(classes.bodyText, classes.firstPhoneScreenBodyText)}>
        {welcomeScreenContent.isUsingDefaultMessage
          ? defaultStudyBody
          : welcomeScreenContent.welcomeScreenBody || 'Body copy'}
      </p>
      <Box className={clsx(classes.bodyText, classes.salutationText)}>
        {welcomeScreenContent.isUsingDefaultMessage
          ? defaultSalutations
          : welcomeScreenContent.welcomeScreenSalutation ||
            'Placeholder salutation,'}
      </Box>
      <Box className={clsx(classes.bodyText, classes.fromText)}>
        {welcomeScreenContent.isUsingDefaultMessage
          ? defaultFrom
          : welcomeScreenContent.welcomeScreenFromText || 'from placeholder'}
      </Box>
    </Box>
  )
}

export default WelcomeScreenPhoneContent
