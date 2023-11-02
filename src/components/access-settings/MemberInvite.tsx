import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {Box, FormControl, Typography} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import React, {FunctionComponent} from 'react'
import ErrorDisplay from '../widgets/ErrorDisplay'
import AccessGrid, {Access} from './AccessGrid'

export type NewOrgAccount = {
  id: string
  access: Access
  email?: string
  principalId?: string
  firstName?: string
  lastName?: string
  isAdded: boolean
  error?: string
}

type MemberInviteProps = {
  newOrgAccount: NewOrgAccount
  onUpdate: Function
}

const MemberInvite: FunctionComponent<MemberInviteProps> = ({newOrgAccount, onUpdate}: MemberInviteProps) => {
  const [email, setEmail] = React.useState(newOrgAccount.email)
  const [firstName, setFirstName] = React.useState(newOrgAccount.firstName)
  const [lastName, setLastName] = React.useState(newOrgAccount.lastName)
  const [access, setAccess] = React.useState(newOrgAccount.access)

  const inputSx = {fontFamily: latoFont, '& input': {height: '28px'}, marginBottom: theme.spacing(2)}

  return (
    <Box width="100%">
      <Typography variant="h3">Account</Typography>
      <FormControl fullWidth>
        <SimpleTextLabel htmlFor="email" required>
          Email Address
        </SimpleTextLabel>
        <SimpleTextInput
          id="email"
          fullWidth
          variant="outlined"
          onChange={e => setEmail(e.target.value)}
          onBlur={e => onUpdate({...newOrgAccount, email: email})}
          value={email || ''}
          placeholder="example@domain.org"
          sx={inputSx}
        />
      </FormControl>
      <Box mb={2} display="flex" gap={1}>
        <FormControl fullWidth>
          <SimpleTextLabel htmlFor="firstName">First Name</SimpleTextLabel>
          <SimpleTextInput
            id="firstName"
            fullWidth
            variant="outlined"
            onChange={e => setFirstName(e.target.value)}
            onBlur={e => onUpdate({...newOrgAccount, firstName: firstName})}
            value={firstName || ''}
            placeholder="First"
            sx={inputSx}
          />
        </FormControl>
        <FormControl fullWidth>
          <SimpleTextLabel htmlFor="lastName">Last Name</SimpleTextLabel>
          <SimpleTextInput
            id="lastName"
            fullWidth
            variant="outlined"
            onChange={e => setLastName(e.target.value)}
            onBlur={e => onUpdate({...newOrgAccount, lastName: lastName})}
            value={lastName || ''}
            placeholder="Last"
            sx={{...inputSx, mb: 4}}
          />
        </FormControl>
      </Box>
      {newOrgAccount.error && <ErrorDisplay>{newOrgAccount.error.toString()}</ErrorDisplay>}

      <Typography variant="h3">Permissions</Typography>
      <AccessGrid
        access={access}
        onUpdate={(_access: Access) => {
          setAccess({..._access})

          onUpdate({...newOrgAccount, access: _access})
        }}
        // isCoadmin={coadmin}
        currentUserIsAdmin={Utility.isInAdminRole()}></AccessGrid>
    </Box>
  )
}

export default MemberInvite
