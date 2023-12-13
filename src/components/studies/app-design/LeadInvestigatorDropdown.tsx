import Dropdown from '@components/widgets/Dropdown'
import {SimpleTextLabel} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AccessService from '@services/access.service'
import {ThemeType} from '@style/theme'
import {LoggedInUserData} from '@typedefs/types'
import clsx from 'clsx'
import React, {useEffect, useState} from 'react'

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

const useStyles = makeStyles((theme: ThemeType) => ({
  errorText: {
    color: theme.palette.error.main,
  },
}))

const LeadInvestigatorDropdown: React.FunctionComponent<LeadInvestigatorDropdownProps> = ({
  onChange,
  currentInvestigatorSelected,
  token,
  orgMembership,
  hasError,
}) => {
  const classes = useStyles()
  const [leadInvestigatorOptions, setLeadInvestigatorOptions] = useState<leadInvestigatorOption[]>([])

  const formatName = (currentAccount: LoggedInUserData) => {
    const {firstName, lastName, email} = currentAccount
    const name = firstName || lastName ? [firstName, lastName].join(' ') : email
    return name
  }

  useEffect(() => {
    const getLeadResearchAccount = async () => {
      const accounts = await AccessService.getAccountsForOrg(token!, orgMembership!)
      const admins = accounts.filter(account => Utility.isInAdminRole(account.roles))
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
      <Box className={clsx(hasError && classes.errorText)} sx={{marginBottom: '6px'}}>
        <SimpleTextLabel sx={{position: 'relative'}}>Lead Principal Investigator*</SimpleTextLabel>
      </Box>
      <Dropdown
        id="lead-investigator-drop-down"
        dropdown={leadInvestigatorOptions.map(item => ({
          value: item.name,
          label: item.name,
        }))}
        emptyValueLabel="Select Principal Investigator"
        width="100%"
        itemHeight="48px"
        value={currentInvestigatorSelected}
        onChange={e => {
          onChange(e.target.value)
        }}
        hasError={hasError}
      />
    </div>
  )
}

export default LeadInvestigatorDropdown
