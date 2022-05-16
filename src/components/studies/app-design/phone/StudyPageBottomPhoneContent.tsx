import {Box, Divider} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, poppinsFont} from '@style/theme'
import {Contact} from '@typedefs/types'
import React from 'react'
import StudySummaryRoles from '../StudySummaryRoles'
import ContactInformation from '../widgets/ContactInformation'
import SectionIndicator from '../widgets/SectionIndicator'

const useStyles = makeStyles(theme => ({
  bodyPhoneText: {
    fontFamily: latoFont,
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '15px',
    marginTop: theme.spacing(1),
    textAlign: 'left',
  },
  divider: {
    width: '256px',
    marginTop: theme.spacing(3.75),
  },
  contactAndSupportText: {
    fontFamily: poppinsFont,
    fontWeight: 'normal',
    fontSize: '18px',
    lineHeight: '24px',
    textAlign: 'left',
  },
  summaryRoles: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(1.25),
    marginTop: theme.spacing(1),
    position: 'relative',
  },
  sectionSixAndSevenIndicatorPosition: {
    position: 'absolute',
    right: theme.spacing(33),
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
  },
  withdrawFromStudyContainer: {
    height: '140px',
    width: '225px',
    borderRadius: '10px',
    backgroundColor: '#93CCF0',
    alignSelf: 'center',
    marginTop: theme.spacing(3),
    padding: theme.spacing(0.5, 2.5, 0.5, 2.5),
  },
  widthdrawText: {
    fontFamily: latoFont,
    fontSize: '12px',
    textAlign: 'left',
  },
  idContainer: {
    width: '100%',
    height: '50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    textAlign: 'left',
    fontSize: '12px',
    fontFamily: latoFont,
  },
}))

type StudyPageBottomPhoneContentProps = {
  generalContactPhoneNumber: string
  irbPhoneNumber: string
  studyID: string
  ethicsBoardInfo: Contact
  contactLead: Contact
  irbProtocolId: string
  getContactName: Function
  isReadOnly?: boolean
}

const StudyPageBottomPhoneContent: React.FunctionComponent<StudyPageBottomPhoneContentProps> =
  ({
    generalContactPhoneNumber,
    irbPhoneNumber,
    studyID,
    ethicsBoardInfo,
    contactLead,
    irbProtocolId,
    getContactName,
    isReadOnly,
  }) => {
    const classes = useStyles()
    return (
      <Box className={classes.container}>
        <Box className={classes.innerContainer}>
          <Box className={classes.contactAndSupportText}>General Support</Box>
          <p className={classes.bodyPhoneText}>
            For general questions about the study or to{' '}
            <strong>withdraw</strong> from the study, please contact:
          </p>
          <Box className={classes.summaryRoles}>
            {!isReadOnly && (
              <SectionIndicator
                index={6}
                className={classes.sectionSixAndSevenIndicatorPosition}
              />
            )}
            <StudySummaryRoles
              type={contactLead.position || 'Role in study'}
              name={getContactName(contactLead.name) || 'Contact lead'}
            />
          </Box>
          <ContactInformation
            phoneNumber={generalContactPhoneNumber}
            email={contactLead.email || ''}
          />
          <Box className={classes.withdrawFromStudyContainer}>
            <p className={classes.widthdrawText}>
              To <strong>withdraw from this study</strong>, you’ll need the
              following info:
            </p>
            <Box className={classes.idContainer}>
              <Box>
                <strong>Study ID:</strong> {studyID}
              </Box>
              <Box>
                <strong>Enrollment ID:</strong> -------
              </Box>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Box className={classes.contactAndSupportText} mt={3}>
            Your Participant Rights
          </Box>
          <p className={classes.bodyPhoneText}>
            For questions about your rights as a research participant, please
            contact :
          </p>
          <Box className={classes.summaryRoles}>
            {!isReadOnly && (
              <SectionIndicator
                index={7}
                className={classes.sectionSixAndSevenIndicatorPosition}
              />
            )}
            <StudySummaryRoles
              type={ethicsBoardInfo.position!}
              name={getContactName(ethicsBoardInfo.name) || 'IRB/Ethics Board'}
            />
          </Box>
          <ContactInformation
            phoneNumber={irbPhoneNumber}
            email={ethicsBoardInfo.email || ''}
          />
          <Box mt={1.5} width="100%">
            IRB Protocol ID: {irbProtocolId || 'placeholder'}
          </Box>
        </Box>
      </Box>
    )
  }

export default StudyPageBottomPhoneContent
