import AssessmentService from '@services/assessment.service'
import constants from '@typedefs/constants'
import {Assessment} from '@typedefs/types'
import * as assessmentData from '../../data/assessments'

const token = 'token_123'
const appId = constants.constants.MTB_APP_ID
/*
j  createSurveyAssessment,
  updateSurveyAssessment,
  updateSurveyAssessmentConfig,
  getSurveyAssessmentConfig,
  getSurveyAssessment,
  getAssessments,
  getAssessmentsWithResources,
  getResource,
})*/

describe('assessment.service', () => {
  describe('#createSurveyAssessment', () => {
    it('should make a call to local assessment and return a survey  and add tag', async () => {
      let assessment: Assessment = {
        ...assessmentData.LocalAssessmentsArc[0],
      } as unknown as Assessment
      assessment.tags = []
      const result = await AssessmentService.createSurveyAssessment(
        assessment,
        token,
        appId
      )
      expect(result.tags).toContainEqual(
        AssessmentService.SURVEY_APP_TAG[appId]
      )
    })
  })

  describe('#getSurveyAssessment', () => {
    it('should make a call to local assessment and return a survey', async () => {
      let assessment: Assessment = {
        ...assessmentData.LocalAssessmentsArc[0],
      } as unknown as Assessment
      assessment.tags = []
      const result = await AssessmentService.getAssessments(appId, token, true)
      expect(assessmentData.LocalAssessmentsMTB.length).toBe(2)
      expect(
        assessmentData.LocalAssessmentsMTB.filter(a =>
          a.tags.includes(AssessmentService.SURVEY_APP_TAG[appId])
        ).length
      ).toBe(1)
      expect(result.length).toBe(1)
    })
  })
})
