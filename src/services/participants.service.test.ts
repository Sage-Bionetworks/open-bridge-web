import ParticipantService from '@services/participants.service'
import * as participant from '../../src/__test_utils/mocks/participant.json'
describe('participants.service', () => {
  it('it should get the single participant correctly', async () => {
    const result = await ParticipantService.getParticipant('study123', 'p123', 'token123')
    const name = participant.firstName
    expect(name).toBe('Some')
    expect(result.firstName).toBe(name)
  })
  describe('update participant', () => {
    it('it should update the single participant with a participant property', async () => {
      const result = await ParticipantService.updateParticipant('study123', 'token123', ['p123'], {
        firstName: 'NewName',
      })
      const name = participant.firstName

      expect(name).toBe('Some')
      expect(result[0].firstName).toBe('NewName')
      //iterate over participant properties and check if they are updated
      for (const [key, value] of Object.entries(result[0])) {
        if (key === 'firstName') {
          expect(value).not.toEqual(participant[key])
          expect(value).toBe('NewName')
        } else {
          //@ts-ignore
          expect(value).toEqual(participant[key])
        }
      }
    })

    it('it should update the single participant with property and note', async () => {
      const result = await ParticipantService.updateParticipant('study123', 'token123', ['p123'], {
        firstName: 'NewName',
        note: 'My Note',
      })
      const name = participant.firstName

      expect(name).toBe('Some')
      expect(result[0].firstName).toBe('NewName')
      //iterate over participant properties and check if they are updated
      for (const [key, value] of Object.entries(result[0])) {
        if (key === 'firstName') {
          expect(value).not.toEqual(participant[key])
          expect(value).toBe('NewName')
        } else {
          //@ts-ignore
          expect(value).toEqual(participant[key])
        }
      }
    })

    it('it should uupdate timezone for several participants', async () => {
      const result = await ParticipantService.updateParticipant('study123', 'token123', ['p123', 'p456'], {
        clientTimeZone: 'America/New_York',
      })

      expect(result.length).toBe(2)

      //iterate over participant properties and check if they are updated

      for (var participant of result) {
        for (const [key, value] of Object.entries(participant)) {
          if (key === 'clientTimeZone') {
            expect(value).toBe('America/New_York')
          } else {
            //@ts-ignore
            expect(value).toEqual(participant[key])
          }
        }
      }
    })
  })
})
