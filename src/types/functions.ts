import { ParticipantAccountSummary } from '../types/types'

export const generateSampleParticipantGridData = (
  amount: number,
  offsetBy: number,
): ParticipantAccountSummary[] => {
  const expectedData = []
  for (let i = offsetBy + 1; i <= amount + offsetBy; i++) {
    let obj: ParticipantAccountSummary = {
      createdOn: '2021-02-22T20:45:38.375Z',
      externalIds: { testID: `test-id-${i}` },
      id: 'dRNO0ydUO3hAGD5rHOXx1Gmb' + i,
      status: 'unverified',
      firstName: '',
      lastName: '',
      email: '',
    }
    expectedData.push(obj)
  }
  return expectedData
}

// check two arrays containing sample participants for equality
export const checkTwoPartcipantArraysForEquality = (
  arr1: ParticipantAccountSummary[],
  arr2: ParticipantAccountSummary[],
) => {
  expect(arr1.length).toBe(arr2.length)
  for (let i = 0; i < arr1.length; i++) {
    const el1 = arr1[i]
    const el2 = arr2[i]
    expect(el1.externalIds.testID).toBe(el2.externalIds.testID)
  }
}
