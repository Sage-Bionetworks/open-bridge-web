import React, { useEffect, useState } from 'react'
import { Box, Select, MenuItem } from '@material-ui/core'
import AccessService from '../../../services/access.service'
import { OrgUser } from '../../../types/types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'

type LeadInvestigatorDropdownProps = {
  onChange: Function
  currentInvestigatorSelected: string
  token: string
  orgMembership: string
}

type leadInvestigatorOption = {
  name: string
}

const useStyles = makeStyles(theme => ({
  selectPrincipleInvestigatorButton: {
    height: '48px',
    border: '1px solid black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    outline: 'none',
    transition: '0.25s ease',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    paddingLeft: theme.spacing(2),
  },
  principleInvestigatorOption: {
    backgroundColor: 'white',
    height: '48px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    transition: '0.25s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    cursor: 'pointer',
  },
  selectMenu: {
    backgroundColor: 'white',
    '&:focus': {
      backgroundColor: 'white',
    },
  },
  container: {
    width: '100%',
    height: '48px',
  },
  listPadding: {
    padding: theme.spacing(0),
  },
  listBorder: {
    borderRadius: '0px',
  },
}))

const LeadInvestigatorDropdown: React.FunctionComponent<LeadInvestigatorDropdownProps> = ({
  onChange,
  currentInvestigatorSelected,
  token,
  orgMembership,
}) => {
  const [leadInvestigatorOptions, setLeadInvestigatorOptions] = useState<
    leadInvestigatorOption[]
  >([])

  const classes = useStyles()

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
      <Box marginLeft="8px">Lead Principle Investigator*</Box>
      <Select
        labelId="lead-investigator-drop-down"
        id="lead-investigator-drop-down"
        value={currentInvestigatorSelected}
        onChange={e => {
          onChange(e.target.value)
        }}
        className={classes.container}
        disableUnderline
        classes={{
          selectMenu: classes.selectMenu,
          root: classes.selectPrincipleInvestigatorButton,
        }}
        MenuProps={{
          classes: { list: classes.listPadding, paper: classes.listBorder },
          getContentAnchorEl: null,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'center',
          },
        }}
        displayEmpty
      >
        <MenuItem value="" disabled style={{ display: 'none' }}>
          Select Principle Investigator
        </MenuItem>
        {leadInvestigatorOptions.map((el, index) => (
          <MenuItem
            className={clsx(classes.principleInvestigatorOption)}
            key={index}
            value={el.name}
            id={`investigator-${index}`}
          >
            {el.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}

export default LeadInvestigatorDropdown
