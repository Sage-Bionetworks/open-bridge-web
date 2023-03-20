import Utility from '@helpers/utility'
import {Box, TextField, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, theme} from '@style/theme'
import React, {FunctionComponent} from 'react'
import ErrorDisplay from '../widgets/ErrorDisplay'
import AccessGrid, {Access} from './AccessGrid'

const useStyles = makeStyles(theme => ({
  root: {},
}))

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
  const [access, setAccess] = React.useState(newOrgAccount.access)

  return (
    <Box width="100%">
      <Typography sx={{fontWeight: 700, mb: 0.75}}>Email Address*</Typography>
      <TextField
        fullWidth
        variant="outlined"
        sx={{marginBottom: theme.spacing(6)}}
        onChange={e => setEmail(e.target.value)}
        onBlur={e => onUpdate({...newOrgAccount, email: email})}
        value={email || ''}
        placeholder="email@synapse.org"
        style={{fontFamily: latoFont}}></TextField>
      {newOrgAccount.error && <ErrorDisplay>{newOrgAccount.error.toString()}</ErrorDisplay>}

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
