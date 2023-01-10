import {Box, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {WelcomeScreenData} from '@typedefs/types'
import React from 'react'
import SectionIndicator from './widgets/SectionIndicator'

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

const WelcomeScreenPhoneContent: React.FunctionComponent<WelcomeScreenPhoneContentProps> = ({
  welcomeScreenContent,
  studyTitle,
  isReadOnly,
}) => {
  const classes = useStyles()
  const defaultStudyBody = 'We are excited that you will be participating. We hope that you find this study helpful.'
  const defaultSalutations = 'Sincerely,'
  const defaultFrom = `The ${studyTitle} team`

  return (
    <Box className={classes.phoneInner}>
      {!welcomeScreenContent.isUsingDefaultMessage && !isReadOnly && (
        <SectionIndicator index={3} className={classes.sectionThreeIndicatorPosition} />
      )}
      <Typography variant="h3">
        {welcomeScreenContent.isUsingDefaultMessage
          ? 'Welcome to \n' + studyTitle + '!'
          : welcomeScreenContent.welcomeScreenHeader || 'Main Header'}
      </Typography>
      <p>
        {welcomeScreenContent.isUsingDefaultMessage
          ? defaultStudyBody
          : welcomeScreenContent.welcomeScreenBody || 'Body Copy'}
      </p>
      <p className={classes.salutationText}>
        {welcomeScreenContent.isUsingDefaultMessage
          ? defaultSalutations
          : welcomeScreenContent.welcomeScreenSalutation || 'Salutation,'}
      </p>
      <p className={classes.fromText}>
        {welcomeScreenContent.isUsingDefaultMessage
          ? defaultFrom
          : welcomeScreenContent.welcomeScreenFromText || 'Study Team Name'}
      </p>
      {welcomeScreenContent.isUsingDefaultMessage && (
        <p className={classes.disclaimerText}>
          This is a research Study. It does not provide medical advice, diagnosis, or treatment.
        </p>
      )}
    </Box>
  )
}

export default WelcomeScreenPhoneContent
