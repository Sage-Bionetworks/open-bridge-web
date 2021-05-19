import { Box } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import AccessService from '../../../services/access.service'
import { OrgUser } from '../../../types/types'
import BlackBorderDropdown from '../../widgets/BlackBorderDropdown'

type LeadInvestigatorDropdownProps = {
  onChange: Function
  currentInvestigatorSelected: string
  token: string
  orgMembership: string
}

type leadInvestigatorOption = {
  name: string
}

const LeadInvestigatorDropdown: React.FunctionComponent<LeadInvestigatorDropdownProps> = ({
  onChange,
  currentInvestigatorSelected,
  token,
  orgMembership,
}) => {
  const [leadInvestigatorOptions, setLeadInvestigatorOptions] = useState<
    leadInvestigatorOption[]
  >([])

  const formatName = (currentAccount: OrgUser) => {
    const { firstName, lastName, email } = currentAccount
    const name = firstName || lastName ? [firstName, lastName].join(' ') : email
    return name
  }

  useEffect(() => {
    const getLeadResearchAccount = async () => {
      const accounts = await AccessService.getAccountsForOrg(
        token!,
        orgMembership!,
      )
      const promises = accounts.map(async account => {
        return await AccessService.getIndividualAccount(token!, account.id)
      })
      const admins = await Promise.all(promises).then(values => {
        return values.filter(account => account.roles.includes('org_admin'))
      })
      const leadInvestigatorArray = []
      for (let i = 0; i < admins.length; i++) {
        const currentAccount = admins[i]
        let currentObj = {
          name: formatName(currentAccount)!,
        }
        leadInvestigatorArray.push(currentObj)
      }
      setLeadInvestigatorOptions(leadInvestigatorArray)
    }
    getLeadResearchAccount()
  }, [token, orgMembership])

  return (
    <div>
      <Box ml={1}>Lead Principle Investigator*</Box>
      <BlackBorderDropdown
        id="lead-investigator-drop-down"
        dropdown={leadInvestigatorOptions.map(item => ({
          value: item.name,
          label: item.name,
        }))}
        emptyValueLabel="Select Principle Investigator"
        width="100%"
        itemHeight="48px"
        value={currentInvestigatorSelected}
        onChange={e => {
          onChange(e.target.value)
        }}
      />
    </div>
  )
}

export default LeadInvestigatorDropdown
