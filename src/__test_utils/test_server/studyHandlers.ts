import constants from '@typedefs/constants'
import {Study} from '@typedefs/types'
import {rest} from 'msw'
import * as studies from '../mocks/studies.json'

export const handlers = [
  // get all studies

  rest.get(`*${constants.endpoints.studies}`, async (req, res, ctx) => {
    // Check if the user is authenticated in this session
    //const isAuthenticated = sessionStorage.getItem('is-authenticated')

    return res(
      ctx.status(200),
      ctx.json({
        items: studies.data,
        total: 6,
      })
    )
  }),

  //  get single study
  rest.get(`*${constants.endpoints.study}`, async (req, res, ctx) => {
    const {id} = req.params

    const _study = studies.data.find(study => study.identifier === id)
    if (_study) {
      return res(ctx.status(200), ctx.json(_study))
    } else {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Not found',
        })
      )
    }
  }),

  //delete study
  rest.delete(`*${constants.endpoints.study}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Study deleted',
      })
    )
  }),

  //create study
  rest.post(`*${constants.endpoints.study}`, async (req, res, ctx) => {
    const study = req.body as Study

    return res(
      ctx.status(200),
      ctx.json({
        data: study,
      })
    )
  }),

  // update
  rest.post(`*${constants.endpoints.study.replace('/:id', '')}`, async (req, res, ctx) => {
    const study = req.body as Study
    study.identifier = req.params.id

    return res(
      ctx.status(201),
      ctx.json({
        version: study.version + 1,
        data: study,
      })
    )
  }),
]

export default handlers
