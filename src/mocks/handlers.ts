import { rest } from 'msw'
import { getRandomId } from '../helpers/utility'
import { getItem, KEYS, MOCKS, setItem } from '../services/lshelper'
import constants from '../types/constants'
import { Schedule } from '../types/scheduling'
import { Study, StudyStatus } from '../types/types'

async function getStudies() {
  let studies = await getItem<Study[]>(KEYS.STUDIES)
  if (!studies) {
    const mocks = MOCKS.STUDIES.map(s => ({
      ...s,
      clientData: s.clientData || {},
      status: s.status as StudyStatus,
      createdOn: new Date(s.createdOn),
      modifiedOn: new Date(s.modifiedOn),
    }))
    studies = await setItem<Study[]>(KEYS.STUDIES, mocks)
  }
  return studies
}

async function getAllSchedules(): Promise<Schedule[]> {
  let s = await getItem<Schedule[]>(KEYS.SCHEDULES)
  return s || []
}

export const handlers = [
  // get all studies
  rest.get(`*${constants.endpoints.studies}`, async (req, res, ctx) => {
    // Check if the user is authenticated in this session
    //const isAuthenticated = sessionStorage.getItem('is-authenticated')
    console.log('get studies handler')
    const studies = await getStudies()
    if (studies === null) {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Not found',
        }),
      )
    }
    return res(
      ctx.status(200),
      ctx.json({
        items: studies,
      }),
    )
  }),

  //  get single study
  rest.get(`*${constants.endpoints.study}`, async (req, res, ctx) => {
    const { id } = req.params
    const studies = await getStudies()
    const _study = studies.find(study => study.identifier === id)
    if (_study) {
      const study: Study = {
        ..._study!,
        status: _study.status as StudyStatus,
      }
      return res(ctx.status(200), ctx.json(study))
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Not found',
        }),
      )
    }
  }),

  //delete study
  rest.delete(`*${constants.endpoints.study}`, async (req, res, ctx) => {
    const { id } = req.params
    const studies = await getStudies()
    const newStudies = studies.filter(s => s.identifier !== id)
    const result = await setItem(KEYS.STUDIES, newStudies)

    return res(
      ctx.status(200),
      ctx.json({
        item: result,
      }),
    )
  }),

  //update study
  rest.post(`*${constants.endpoints.study}`, async (req, res, ctx) => {
    const { id } = req.params
    const study = req.body as Study
    const studies = (await getStudies()) || []

    let newStudies: Study[]
    if (studies.find(s => s.identifier === id)) {
      //if study exist
      newStudies = studies.map(s =>
        s.identifier === id ? { ...s, ...study } : s,
      )
    } else {
      newStudies = [...studies, study]
    }
    const result = await setItem(KEYS.STUDIES, newStudies)

    return res(
      ctx.status(200),
      ctx.json({
        data: result,
      }),
    )
  }),

  // create a study
  rest.post(
    `*${constants.endpoints.study.replace('/:id', '')}`,
    async (req, res, ctx) => {
      const study = req.body as Study
      console.log('inside of handler', req)
      const studies = (await getStudies()) || []
      const newStudies = [...studies, study]
      await setItem(KEYS.STUDIES, newStudies)
      return res(
        ctx.status(201),
        ctx.json({
          version: study.version,
          type: study.status,
        }),
      )
    },
  ),

  //get schedule
  rest.get(`*${constants.endpoints.schedule}`, async (req, res, ctx) => {
    const { id } = req.params
    console.log('getting schedule' + id)

    let schedules = await getItem<Schedule[]>(KEYS.SCHEDULES)
    let schedule = schedules?.filter(s => s.guid === id)?.[0]

    return res(
      ctx.status(200),
      ctx.json({
        data: schedule,
      }),
    )
  }),

  //create schedule
  rest.post(
    `*${constants.endpoints.schedule.replace('/:id', '')}`,
    async (req, res, ctx) => {
      console.log('creating schedule')
      const { name, duration } = req.body as { name: string; duration: string }
      let guid = getRandomId()
      let newSchedule: Schedule = {
        name,
        duration,
        guid,
        sessions: [],
      }

      const allSchedules = await getAllSchedules()
      await setItem(KEYS.SCHEDULES, [...allSchedules, newSchedule])

      return res(ctx.status(200), ctx.json(guid))
    },
  ),

  //update  schedule
  rest.post(`*${constants.endpoints.schedule}`, async (req, res, ctx) => {
    console.log('updating schedule from handler')
    const { id } = req.params
    console.log('updaging schedule' + id)
    const newSchedule = req.body

    let schedules = await getItem<Schedule[]>(KEYS.SCHEDULES)
    let updatedSchedules = schedules?.map(s =>
      s.guid === id ? newSchedule : s,
    )
    await setItem(KEYS.SCHEDULES, updatedSchedules)

    return res(
      ctx.status(200),
      ctx.json({
        data: newSchedule,
      }),
    )
  }),

  /* ****************************
   * THOSE ENDPOINTS EXIST. THEY ARE REPLACED FOR TESTING. COMMENT THEM OUT TO GET THE REAL RESPONSE
   *************************  */

  // These two endpoints below simulate fake data used to test the functionality of the
  // ParticpantManager component. Uncomment them when running tests
  /*
  rest.post(
    `*${constants.endpoints.participantsSearch}`,
    async (req, res, ctx) => {
      const items = []
      for (let i = 1; i <= 100; i++) {
        let obj = {
          appId: 'mtb-user-testing',
          attributes: {},
          createdOn: '2021-02-22T20:45:38.375Z',
          externalId: `test-id-${i}`,
          externalIds: { kkynty35udejidtdp8h: '342067' },
          id: 'dRNO0ydUO3hAGD5rHOXx1Gmb' + i,
          status: 'unverified',
          studyIds: ['kkynty35udejidtdp8h'],
          type: 'AccountSummary',
        }
        items.push(obj)
      }
      return res(
        ctx.status(200),
        ctx.json({
          items: items,
          total: items.length,
        }),
      )
    },
  ),

  rest.get(`*${constants.endpoints.events}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      }),
    )
  }),
  */

  //to get the error from synapse pass email w/ synapseErr to get error from bridge pass email w/ bridgeErr

  //get principal id from synapse
  /*
  rest.post(
    `*${constants.endpoints.synapseGetAlias}`,
    async (req, res, ctx) => {
      //@ts-ignore
      const alias = req.body!.alias
      const isError = alias.indexOf('sErr') > -1
      if (isError) {
        return res(
          ctx.status(404),
          ctx.json({ reason: 'Not found in synapse' }),
        )
      }

      return res(
        ctx.status(200),
        ctx.json({
          principalId: 3420774,
        }),
      )
    },
  ),

  //get profile from synapse
  rest.get(
    `*${constants.endpoints.synapseGetUserProfile}`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          userId: '3420774',
          userProfile: {
            ownerId: '3420774',
            firstName: 'Alina!!!',
            lastName: 'Testing!!!',
            userName: 'agendel_test',
            summary: '',
            position: '',
            location: '',
            industry: '',
            company: '',
            url: '',
            createdOn: '2021-01-12T01:51:16.000Z',
          },
        }),
      )
    },
  ),

  //create account
  rest.post(`*${constants.endpoints.bridgeAccount}`, async (req, res, ctx) => {
    //@ts-ignore
    const email = req.body!.email

    const isError = email.indexOf('bErr') > -1
    if (isError) {
      return res(
        ctx.status(409),
        ctx.json({ message: 'Error from adding a user account' }),
      )
    }

    return res(
      ctx.status(200),
      ctx.json({
        identifier: 'U6tVUQfQr2GYDROdeTNLa6LB',
        type: 'IdentifierHolder',
      }),
    )
  }),*/

  //delete account
  /* rest.delete(
    `*${constants.endpoints.bridgeAccount}`,
    async (req, res, ctx) => {
      //@ts-ignore
      const { id } = req.params

      return res(
        ctx.status(200),
        ctx.json({
          identifier: 'U6tVUQfQr2GYDROdeTNLa6LB',
          type: 'IdentifierHolder',
        }),
      )
    },
  ),*/
]
