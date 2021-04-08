import React, { useEffect, useState } from 'react'
import { Box } from '@material-ui/core'
import AccessService from '../../../services/access.service'
import { OrgUser } from '../../../types/types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import ChevronDownIcon from '../../../assets/chevron_down_icon.svg'

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
    width: '410px',
    height: '48px',
    border: '1px solid black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    outline: 'none',
    transition: '0.25s ease',
    fontSize: '14px',
  },
  selectPrincipleInvestigatorButtonClosed: {
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
  principleInvestigatorOption: {
    backgroundColor: 'white',
    height: '48px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    transition: '0.25s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    cursor: 'pointer',
  },
  principleInvestigatorDropdown: {
    paddingLeft: theme.spacing(0),
    zIndex: 500,
    position: 'absolute',
    width: '410px',
  },
}))

const LeadInvestigatorDropdown: React.FunctionComponent<LeadInvestigatorDropdownProps> = ({
  onChange,
  currentInvestigatorSelected = 'Select pricinple investigator',
  token,
  orgMembership,
}) => {
  const [
    isLeadInvestigatorDropdownOpen,
    setIsLeadInvestigatorDropdownOpen,
  ] = useState<boolean>(false)

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
  }, [])

  return (
    <div>
      <Box marginLeft="8px">Lead Principle Investigator*</Box>
      <div>
        <button
          className={clsx(
            classes.selectPrincipleInvestigatorButton,
            !isLeadInvestigatorDropdownOpen &&
              classes.selectPrincipleInvestigatorButtonClosed,
          )}
          onClick={() => {
            setIsLeadInvestigatorDropdownOpen(!isLeadInvestigatorDropdownOpen)
          }}
        >
          {currentInvestigatorSelected || 'Select pricinple investigator'}
          <img src={ChevronDownIcon} alt="chevron-down-logo"></img>
        </button>
        {isLeadInvestigatorDropdownOpen && leadInvestigatorOptions.length > 0 && (
          <ul className={classes.principleInvestigatorDropdown}>
            {leadInvestigatorOptions.map((el, index) => (
              <option
                className={clsx(classes.principleInvestigatorOption)}
                key={index}
                value={el.name}
                onClick={() => {
                  setIsLeadInvestigatorDropdownOpen(false)
                  onChange(el.name)
                }}
              >
                {el.name}
              </option>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default LeadInvestigatorDropdown
