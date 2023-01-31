import {Box, Divider, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {Contact} from '@typedefs/types'
import React from 'react'
import StudySummaryRoles from '../StudySummaryRoles'
import SectionIndicator from '../widgets/SectionIndicator'

const useStyles = makeStyles(theme => ({
  divider: {
    width: '256px',
    marginTop: theme.spacing(3.5),
    marginBottom: theme.spacing(3.5),
  },
  sectionIndicatorPosition: {
    position: 'absolute',
    marginLeft: theme.spacing(-7),
    top: theme.spacing(2.5),
  },
  container: {
    padding: theme.spacing(2, 2, 2, 2.25),
    width: '311px',

    marginLeft: theme.spacing(1.25),
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
  imgHeight: number
  appColor: string
  studyTitle: string
  studySummaryBody: string
  leadInvestigator: Contact
  funder: Contact
  studyLogoUrl?: string
  getContactName: Function
  isReadOnly?: boolean
}

const StudyPageTopPhoneContent: React.FunctionComponent<StudyPageTopPhoneContentProps> = ({
  imgHeight,
  appColor,
  studyTitle,
  studySummaryBody,
  leadInvestigator,
  funder,
  studyLogoUrl,
  getContactName,
  isReadOnly,
}) => {
  const classes = useStyles()
  return (
    <Box className={classes.container}>
      <Box
        className={classes.studyLogoContainer}
        style={{
          backgroundColor: appColor ? 'transparent' : appColor,
        }}>
        {studyLogoUrl ? <img src={studyLogoUrl} style={{height: `${imgHeight - 16}px`}} alt="study-logo" /> : <></>}
      </Box>
      <Box>
        {!isReadOnly && <SectionIndicator index={4} className={classes.sectionIndicatorPosition} />}
        <Box>
          <Typography variant="h3">{studyTitle || 'Title of study...'}</Typography>
          <Typography paragraph>{studySummaryBody || 'Body...'}</Typography>
        </Box>
      </Box>
      <Divider className={classes.divider} />
      <Box>
        <StudySummaryRoles
          type="Lead Principal Investigator"
          name={getContactName(leadInvestigator.name) || 'placeholder'}
          sx={{mb: 2}}
        />
        {!isReadOnly && <SectionIndicator index={5} className={classes.sectionIndicatorPosition} />}

        <StudySummaryRoles type="Institution" name={leadInvestigator.affiliation || 'placeholder'} sx={{mb: 2}} />
        <StudySummaryRoles type="Funder" name={getContactName(funder.name) || 'placeholder'} />
      </Box>
    </Box>
  )
}

export default StudyPageTopPhoneContent
