import Preview from '@components/studies/preview/Preview'
import BreadCrumb from '@components/widgets/BreadCrumb'
import {Box, Container} from '@mui/material'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps} from 'react-router-dom'

type AssessmentsPreviewOwnProps = {
  title?: string
  paragraph?: string
}

type AssessmentsPreviewProps = AssessmentsPreviewOwnProps & RouteComponentProps

const AssessmentsPreview: FunctionComponent<AssessmentsPreviewProps> = ({
  title = 'something',
  paragraph,
}) => {
  const links = [{url: '/assessments', text: 'Assessments'}]
  return (
    <Container maxWidth="xl" style={{position: 'relative'}}>
      <Box mt={2} mb={8}>
        <BreadCrumb links={links} />
      </Box>

      <Preview id={'demo'} isAssessmentDemo={true} />
    </Container>
  )
}
export default AssessmentsPreview
