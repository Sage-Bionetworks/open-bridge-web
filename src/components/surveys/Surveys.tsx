import {Box} from '@mui/material'
import {FunctionComponent} from 'react'
import {RouteComponentProps} from 'react-router-dom'
import SurveyDesign from './survey-design/SurveyDesign'

type SurveysProps = RouteComponentProps

const Surveys: FunctionComponent<SurveysProps> = props => {
  return (
    <Box>
      <SurveyDesign {...props} />
    </Box>
  )
}
export default Surveys
