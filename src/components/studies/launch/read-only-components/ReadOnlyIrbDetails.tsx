import {Box, Checkbox, FormControlLabel} from '@material-ui/core'
import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont, poppinsFont, ThemeType} from '../../../../style/theme'
import {Study} from '../../../../types/types'
import ReadOnlyTextbox from './ReadOnlyTextbox'
import {getDateWithTimeZone, getFormattedDate} from '../IrbDetails'

const useStyles = makeStyles((theme: ThemeType) => ({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: theme.spacing(7, 7),
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    textAlign: 'left',
  },
  text: {
    fontFamily: poppinsFont,
    fontSize: '18px',
    lineHeight: '27px',
  },
  certifyText: {
    fontFamily: latoFont,
    fontSize: '16px',
    lineHeight: '19px',
  },
  blueWordContainer: {
    fontSize: '15px',
    fontFamily: latoFont,
    padding: theme.spacing(1.25, 2.5),
    borderRadius: '20px',
    backgroundColor: '#87D2EA',
    marginRight: theme.spacing(2),
  },
}))

const ReadOnlyIrbDetails: React.FunctionComponent<{study: Study}> = ({
  study,
}) => {
  const classes = useStyles()
  return (
    <Box padding="50px 0px">
      <Box className={classes.container}>
        <Box className={classes.row}>
          <Box className={classes.text}>Study Type:</Box>&nbsp;&nbsp;&nbsp;
          <strong className={classes.text}>
            {study.studyDesignTypes![0] === 'observation'
              ? 'Observational/Natural History'
              : 'Interventional/Experimental'}
          </strong>
        </Box>
        <Box>
          <Box className={classes.text} mt={6}>
            Study conditions/diseases targets:
          </Box>
          <Box display="flex" pt={2} flexWrap="wrap">
            {study.diseases?.map((disease, index) => {
              return (
                <Box key={index} className={classes.blueWordContainer}>
                  {disease}
                </Box>
              )
            })}
          </Box>
          <Box className={classes.text} mt={6}>
            Keywords associated with study:
          </Box>
          <Box display="flex" pt={2} flexWrap="wrap">
            {study.keywords?.split('*')?.map((keyword, index) => {
              return (
                <Box key={index} className={classes.blueWordContainer}>
                  {keyword}
                </Box>
              )
            })}
          </Box>
        </Box>
      </Box>
      <Box className={classes.container} mt={5}>
        <strong className={classes.text}>IRB Details & Certification</strong>
        <Box className={classes.certifyText} mt={2}>
          I certify that:
        </Box>
        <Box mt={1}>
          <Box pl={3} mb={4}>
            <FormControlLabel
              key="confirmReviewed"
              control={
                <Checkbox checked={true} onChange={() => {}} color="primary" />
              }
              label="The study protocol was reviewed by the IRB and /or equivalent body listed below."
            />
            <FormControlLabel
              key="confirmConsistent"
              control={
                <Checkbox checked={true} onChange={() => {}} color="primary" />
              }
              label="The Principal Investigator has assured that this study is consistent with applicable laws and regulations as well as relevant institutional policies."
            />
          </Box>
        </Box>
        <ReadOnlyTextbox
          header="IRB Protocol Title:"
          value={study.name || ''}
        />
        <ReadOnlyTextbox
          header="Lead Principal Investigator:"
          value={
            study.contacts?.find(el => el.role === 'principal_investigator')
              ?.name || ''
          }
        />
        <ReadOnlyTextbox
          header="Institutional Affiliation:"
          value={
            study.contacts?.find(el => el.role === 'principal_investigator')
              ?.affiliation || ''
          }
        />
        <ReadOnlyTextbox
          header="IRB of record:"
          value={study.contacts?.find(el => el.role === 'irb')?.name || ''}
        />
        <ReadOnlyTextbox
          header="IRB Protocol ID:"
          value={study.irbProtocolId || ''}
        />
        <Box mt={3} fontWeight="bold" fontFamily={poppinsFont} fontSize="14px">
          IRB Decision*:{' '}
          {study.irbDecisionType === 'approved' ? 'Approved' : 'Exempt'}
        </Box>
        <Box display="flex" flexDirection="row" mt={-2}>
          <Box mr={2} width="194px">
            <ReadOnlyTextbox
              header={
                study.irbDecisionType === 'approved'
                  ? 'Date of IRB sApproval'
                  : 'Date of Exemption'
              }
              value={getFormattedDate(
                getDateWithTimeZone(new Date(study.irbDecisionOn!))
              )}
            />
          </Box>
          {study.irbDecisionType === 'approved' && (
            <ReadOnlyTextbox
              header={'Date of Approval Expiration'}
              value={getFormattedDate(
                getDateWithTimeZone(new Date(study.irbExpiresOn!))
              )}
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ReadOnlyIrbDetails
