import {useUserSessionDataState} from '@helpers/AuthContext'
import AccessService from '@services/access.service'
import ParticipantService from '@services/participants.service'
import UserService from '@services/user.service'
import {SynapseClientError} from '@typedefs/types'
import {UseMutationOptions, useMutation} from 'react-query'
import {getRolesFromAccess} from './AccessGrid'
import {NewOrgAccount} from './MemberInvite'

async function createNewAccount(account: NewOrgAccount, currentUserOrg: string, token: string) {
  const {email, firstName, lastName, access} = account

  if (!email) {
    throw new Error('No email provided')
  }

  let principalId: string | null = null
  let synapseFirstName: string | null = null
  let synapseLastName: string | null = null

  if (AccessService.isSynapseEmail(email)) {
    const synapseAlias = await AccessService.getAliasFromSynapseByEmail(email)
    principalId = synapseAlias.principalId
    synapseFirstName = synapseAlias.firstName
    synapseLastName = synapseAlias.lastName
  }

  const demoExternalId = await ParticipantService.signUpForAssessmentDemoStudy(token!)

  const {identifier: userId} = await AccessService.createIndividualAccount(
    token!,
    email,
    principalId,
    firstName || synapseFirstName,
    lastName || synapseLastName,
    currentUserOrg,
    {demoExternalId},
    getRolesFromAccess(access)
  )

  if (!AccessService.isSynapseEmail(email)) {
    await UserService.sendRequestResetPassword(userId, token!)
  }
}

export const useCreateNewAccount = (
  options?: UseMutationOptions<
    void,
    SynapseClientError,
    {
      account: NewOrgAccount
      currentUserOrg: string
    }
  >
) => {
  const {token} = useUserSessionDataState()
  return useMutation({
    ...options,
    mutationFn: args => createNewAccount(args.account, args.currentUserOrg, token!),
  })
}
