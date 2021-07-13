import {Box} from '@material-ui/core'
import React, {useEffect, useState} from 'react'
import {isInAdminRole} from '../../../helpers/utility'
import AccessService from '../../../services/access.service'
import {OrgUser} from '../../../types/types'
import BlackBorderDropdown from '../../widgets/BlackBorderDropdown'

type LeadInvestigatorDropdownProps = {
  onChange: Function
  currentInvestigatorSelected: string
  token: string
  orgMembership: string
  hasError?: boolean
}

type leadInvestigatorOption = {
  name: string
}

const LeadInvestigatorDropdown: React.FunctionComponent<LeadInvestigatorDropdownProps> = ({
  onChange,
  currentInvestigatorSelected,
  token,
  orgMembership,
  hasError,
}) => {
  const [leadInvestigatorOptions, setLeadInvestigatorOptions] = useState<
    leadInvestigatorOption[]
  >([])

  const formatName = (currentAccount: OrgUser) => {
    const {firstName, lastName, email} = currentAccount
    const name = firstName || lastName ? [firstName, lastName].join(' ') : email
    return name
  }

  useEffect(() => {
    const getLeadResearchAccount = async () => {
      const accounts = await AccessService.getDetailedAccountsForOrg(
        token!,
        orgMembership!
      )
      const admins = accounts.filter(account => isInAdminRole(account.roles))
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
        hasError={!!hasError}
      />
    </div>
  )
}

export default LeadInvestigatorDropdown
