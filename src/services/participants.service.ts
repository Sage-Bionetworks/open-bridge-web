import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { LoggedInUserData, Response } from '../types/types'

async function getParticipants(token: string): Promise<LoggedInUserData[]> {
  const e = constants.endpoints.participants
  const result = await callEndpoint<{ items: LoggedInUserData[] }>(
    e,
    'POST',
    {},
    token,
  )
  return result.data.items
}

const ParticipantService = {
  getParticipants,
}

export default ParticipantService
