import {BuilderWrapper} from '@components/studies/StudyBuilder'
import {Box, Checkbox, FormControlLabel, styled, Typography} from '@mui/material'
import React from 'react'

import {theme} from '@style/theme'
import {Study} from '@typedefs/types'
import {getDateWithTimeZone, getFormattedDate} from '../IrbDetails'

const StyledHeader = styled(Typography, {label: 'styledHeader'})(({theme}) => ({
  fontWeight: 700,
  fontSize: '14px',
  marginBottom: theme.spacing(1),
  ':not(:first-of-type)': {
    marginTop: theme.spacing(3),
  },
}))

const ReadOnlyIrbDetails: React.FunctionComponent<{study: Study}> = ({study}) => {
  return (
    <BuilderWrapper sectionName="Launch Study Requirements" isReadOnly>
      <Typography variant="h2" paragraph textAlign="left">
        Study & IRB Details
      </Typography>
      <Box sx={{textAlign: 'left', marginTop: theme.spacing(5), marginLeft: theme.spacing(4)}}>
        <Typography variant="h3">Study Details</Typography>
        <StyledHeader>Study Type</StyledHeader>
        <Typography>
          {study.studyDesignTypes![0] === 'observation'
            ? 'Observational/Natural History'
            : 'Interventional/Experimental'}
        </Typography>
        <StyledHeader>Study conditions/diseases targets</StyledHeader>
        <Typography>{study.diseases?.map((disease, index) => `${index > 0 && ','} ${disease}`)}</Typography>
        <StyledHeader>Keywords associated with study:</StyledHeader>

        <Typography>
          {' '}
          {study.keywords?.split('*')?.map((keyword, index) => `${index > 0 && ','} ${keyword}`)}{' '}
        </Typography>

        <Typography variant="h3" paragraph sx={{marginTop: theme.spacing(10)}}>
          IRB Details & Certification
        </Typography>
        <strong>I certify that:</strong>
        <Box mt={1}>
          <Box pl={3} mb={4}>
            <FormControlLabel
              key="confirmReviewed"
              control={<Checkbox checked={true} onChange={() => {}} color="primary" />}
              label="The study protocol was reviewed by the IRB and /or equivalent body listed below."
            />
            <FormControlLabel
              key="confirmConsistent"
              control={<Checkbox checked={true} onChange={() => {}} color="primary" />}
              label="The Principal Investigator has assured that this study is consistent with applicable laws and regulations as well as relevant institutional policies."
            />
          </Box>
        </Box>
        <StyledHeader>IRB Protocol Title</StyledHeader>
        {study.name || ''}
        <StyledHeader>Lead Principal Investigator</StyledHeader>
        {study.contacts?.find(el => el.role === 'principal_investigator')?.name || ''}

        <StyledHeader>Institutional Affiliation</StyledHeader>
        {study.contacts?.find(el => el.role === 'principal_investigator')?.affiliation || ''}

        <StyledHeader>IRB of record</StyledHeader>
        {study.contacts?.find(el => el.role === 'irb')?.name || ''}
        <StyledHeader>IRB Protocol ID </StyledHeader>
        {study.irbProtocolId || ''}
        <StyledHeader>IRB Decision </StyledHeader>
        {study.irbDecisionType === 'approved' ? 'Approved' : 'Exempt'}
        <StyledHeader>
          {study.irbDecisionType === 'approved' ? 'Date of IRB Approval' : 'Date of Exemption'}
        </StyledHeader>
        {getFormattedDate(getDateWithTimeZone(new Date(study.irbDecisionOn!)))}

        {study.irbDecisionType === 'approved' && (
          <>
            <StyledHeader>Date of Approval Expiration</StyledHeader>
            {getFormattedDate(getDateWithTimeZone(new Date(study.irbExpiresOn!)))}
          </>
        )}
      </Box>
    </BuilderWrapper>
  )
}

export default ReadOnlyIrbDetails
