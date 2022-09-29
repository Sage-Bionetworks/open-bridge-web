import constants from '@typedefs/constants'
import { rest } from 'msw'
import SurveyAssessment from '__test_utils/mocks/surveyAssessment'
import * as Assessments from '../mocks/assessments'
import AssessmentConfig from '../mocks/surveySampleA'
/*
Mocks for assessment endpoints

    assessment: '/v1/assessments/:id',
    assessmentShared: '/v1/sharedassessments/:id',
    assessments: '/v1/assessments/?includeDeleted=false',
    assessmentsShared: '/v1/sharedassessments/?includeDeleted=false',
    assessmentResources: '/v1/assessments/identifier::identifier/resources', //'/v1/sharedassessments',
    assessmentSharedResources: '/v1/sharedassessments/identifier::identifier/resources',
    assmentsForSessions: '/v1/sessions/:sessionId/assessments',
*/
const mtbAppId = constants.constants.MTB_APP_ID
const arcAppId = constants.constants.ARC_APP_ID

const endpoints = [
  //shared assessments
  rest.get(
    `*${constants.endpoints.assessmentsShared.split('/?')[0]}/*`,
    (req, res, ctx) => {
      // console.log('REQ', req)
      return res(
        ctx.json({
          items: [Assessments.SharedAssessmentsArc],
        }),
        ctx.status(200)
      )
    }
  ),


  // get single local assessmsent
  rest.get(
    `*${constants.endpoints.assessment}`,
    (req, res, ctx) => {
      //  console.log('REQ1', req)
      return res(
        ctx.json(SurveyAssessment),
        ctx.status(200)
      )
    }
  ),

  // get local assessment config
  rest.get(
    `*${constants.endpoints.assessment}/config`,
    (req, res, ctx) => {
      //   console.log('REQCONFIG', req)
      //  console.log({ config: { ...AssessmentConfig } })
      return res(
        ctx.json({ config: { ...AssessmentConfig } }),
        ctx.status(200)
      )
    }
  ),


  //get local assessments
  rest.get(
    `*${constants.endpoints.assessments.split('/?')[0]}/*`,
    (req, res, ctx) => {
      //   console.log('REQ', req)
      return res(

        ctx.json({
          items: [...Assessments.LocalAssessmentsMTB],
        }),

        ctx.status(200)
      )
    }
  ),


  //update local assessment
  rest.post(
    `*${constants.endpoints.assessment.replace(':id', '')}`,
    (req, res, ctx) => {
      return res(ctx.json(req.body), ctx.status(200))
    }
  ),
]
export default endpoints
