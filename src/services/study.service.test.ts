import ScheduleService from '@services/schedule.service'
import StudyService from '@services/study.service'
import constants from '@typedefs/constants'
import {Schedule} from '@typedefs/scheduling'
import {rest} from 'msw'
import server from '__test_utils/test_server/server'
import mockSchedule from '../__test_utils/mocks/schedule.json'
import mockStudy from '../__test_utils/mocks/study.json'

export const getStudyResponse = rest.get(`*${constants.endpoints.study}`, async (req, res, ctx) => {
  return res(ctx.status(200), ctx.json(mockStudy))
})

describe('Copy Study', () => {
  it('should copy a study with without export information', async () => {
    server.use(getStudyResponse)

    jest.spyOn(ScheduleService, 'getSchedule').mockImplementation(function () {
      return Promise.resolve(mockSchedule.data as unknown as Schedule)
    })

    jest.spyOn(ScheduleService, 'createSchedule').mockImplementation(function () {
      return Promise.resolve(mockSchedule.data as unknown as Schedule)
    })

    const result = await StudyService.copyStudy('123', 'MTB', 'token123')

    expect(result.study.name).toBe(`Copy of ${mockStudy.name}`)
    expect(mockStudy.exporter3Configuration).toBeDefined()
    expect(result.study.exporter3Configuration).toBeUndefined()
  })
})
