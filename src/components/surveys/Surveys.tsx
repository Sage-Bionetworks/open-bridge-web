import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import SurveyDesign from './survey-design/SurveyDesign'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type SurveysOwnProps = {
  studyId?: string
}

type SurveysProps = SurveysOwnProps & RouteComponentProps

const Surveys: FunctionComponent<SurveysProps> = props => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  return (
    <Box>
      <SurveyDesign {...props} />
    </Box>
  )
}
export default Surveys
