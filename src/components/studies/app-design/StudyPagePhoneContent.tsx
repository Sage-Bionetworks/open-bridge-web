import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Box, Divider } from '@material-ui/core'
import ContactInformation from './ContactInformation'
import StudySummaryRoles from './StudySummaryRoles'
import SectionIndicator from './SectionIndicator'
import { StudyAppDesign } from '../../../types/types'
import clsx from 'clsx'
import { latoFont, playfairDisplayFont } from '../../../style/theme'

const useStyles = makeStyles(theme => ({
  sectionFourIndicatorPosition: {
    marginTop: theme.spacing(-0.5),
    position: 'absolute',
    marginLeft: theme.spacing(-6.5),
  },
  headlineStyle: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '21px',
    lineHeight: '28px',
    whiteSpace: 'pre-line',
  },
  phoneInnerBottom: {
    marginLeft: '5px',
    marginRight: theme.spacing(0.26),
    padding: theme.spacing(4),
    textAlign: 'left',
    minHeight: `500px`,
    borderRight: '4px solid black',
    borderLeft: '4px solid black',
  },
  bodyText: {
    fontFamily: latoFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
    marginTop: theme.spacing(3),
    whiteSpace: 'pre-line',
  },
  bodyPhoneText: {
    fontFamily: latoFont,
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '15px',
    marginTop: theme.spacing(3),
  },
  divider: {
    width: '256px',
    marginTop: theme.spacing(3.75),
  },
  sectionFiveIndicatorPosition: {
    marginTop: theme.spacing(2.5),
    position: 'absolute',
    marginLeft: theme.spacing(-6.5),
  },
  phoneGrayBackground: {
    backgroundColor: '#F7F7F7',
  },
  contactAndSupportText: {
    fontFamily: playfairDisplayFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '24px',
  },
  summaryRoles: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(1.25),
  },
  sectionSixAndSevenIndicatorPosition: {
    marginTop: theme.spacing(2.5),
    position: 'absolute',
    marginLeft: theme.spacing(-39.5),
  },
}))

type StudyPagePhoneContentProps = {
  appDesignProperties: StudyAppDesign
  generalContactPhoneNumber: string
  irbPhoneNumber: string
}

const StudyPagePhoneContent: React.FunctionComponent<StudyPagePhoneContentProps> = ({
  appDesignProperties,
  generalContactPhoneNumber,
  irbPhoneNumber,
}) => {
  const classes = useStyles()
  return (
    <Box>
      {' '}
      <Box className={classes.phoneInnerBottom}>
        <SectionIndicator
          index={4}
          className={clsx(classes.sectionFourIndicatorPosition)}
        />
        <Box className={classes.headlineStyle}>
          {appDesignProperties.studyTitle || 'Title of study...'}
        </Box>
        <p className={classes.bodyText}>
          {appDesignProperties.studySummaryBody || 'Body...'}
        </p>
        <Divider className={classes.divider} />
        <SectionIndicator
          index={5}
          className={clsx(classes.sectionFiveIndicatorPosition)}
        />
        <StudySummaryRoles
          type="Lead Principal Investigator"
          name={
            appDesignProperties.leadPrincipleInvestigatorInfo?.name ||
            'placeholder'
          }
        />
        <StudySummaryRoles
          type="Institution"
          name={
            appDesignProperties.leadPrincipleInvestigatorInfo?.affiliation ||
            'placeholder'
          }
        />
        <StudySummaryRoles
          type="Funder"
          name={appDesignProperties.funder?.name || 'placeholder'}
        />
      </Box>
      <Box
        className={clsx(classes.phoneInnerBottom, classes.phoneGrayBackground)}
      >
        <Box className={classes.contactAndSupportText}>Contact & support</Box>
        <p className={classes.bodyPhoneText}>
          For general questions about the study or to <strong>withdraw</strong>{' '}
          from the study, please contact:
        </p>
        <Box className={classes.summaryRoles}>
          <SectionIndicator
            index={6}
            className={clsx(classes.sectionSixAndSevenIndicatorPosition)}
          />
          <StudySummaryRoles
            type={
              appDesignProperties.contactLeadInfo?.position || 'Role in study'
            }
            name={appDesignProperties.contactLeadInfo?.name || 'Contact lead'}
          />
        </Box>
        <ContactInformation
          phoneNumber={generalContactPhoneNumber}
          email={appDesignProperties.contactLeadInfo?.email || ''}
        />
        <Divider className={classes.divider} />
        <p className={classes.bodyPhoneText}>
          For questions about your rights as a research participant, please
          contact :
        </p>
        <Box className={classes.summaryRoles}>
          <SectionIndicator
            index={7}
            className={clsx(classes.sectionSixAndSevenIndicatorPosition)}
          />
          <StudySummaryRoles
            type="IRB/Ethics Board of Record"
            name={
              appDesignProperties.ethicsBoardInfo?.name || 'IRB/Ethics Board'
            }
          />
        </Box>
        <ContactInformation
          phoneNumber={irbPhoneNumber}
          email={appDesignProperties.ethicsBoardInfo?.email || ''}
        />
        <Box
          style={{
            marginLeft: '52px',
            marginTop: '10px',
            marginBottom: '20px',
          }}
        >
          {appDesignProperties.irbProtocolId || 'placeholder'}
          <br />
          IRB Protocol ID
        </Box>
      </Box>
    </Box>
  )
}

export default StudyPagePhoneContent
