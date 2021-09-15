import Preview from '@components/studies/preview/Preview'
import BreadCrumb from '@components/widgets/BreadCrumb'
import {Container} from '@material-ui/core'
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
    <Container maxWidth="xl">
      <BreadCrumb links={links} />

      <Preview id={'demo'} isAssessmentDemo={true} />
    </Container>
  )
}
export default AssessmentsPreview
