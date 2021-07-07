import {Box, Container, makeStyles, TextField} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {useUserSessionDataState} from '../../helpers/AuthContext'
import {isInAdminRole} from '../../helpers/utility'
import {latoFont, poppinsFont} from '../../style/theme'
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
  index: number
  newOrgAccount: NewOrgAccount
  onUpdate: Function
}

const MemberInvite: FunctionComponent<MemberInviteProps> = ({
  index,
  newOrgAccount,
  onUpdate,
}: MemberInviteProps) => {
  const classes = useStyles()
  const [email, setEmail] = React.useState(newOrgAccount.email)
  const [access, setAccess] = React.useState(newOrgAccount.access)
  //const [coadmin, setCoadmin] = React.useState(false)
  const sessionData = useUserSessionDataState()

  /* const updateCoadmin = (isChecked: boolean) => {
    setCoadmin(isChecked)
    debugger
    if (isChecked) {
      debugger
      setAccess(getAccessFromRoles(['org_admin']))
      onUpdate({...newOrgAccount, access: access})
    }
  }*/

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box fontFamily={poppinsFont} fontSize="14px" mb={0.75}>
        Email Address:
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        onChange={e => setEmail(e.target.value)}
        onBlur={e => onUpdate({...newOrgAccount, email: email})}
        color="secondary"
        value={email || ''}
        placeholder="email@synapse.org"
        style={{fontFamily: latoFont}}></TextField>
      {newOrgAccount.error && (
        <ErrorDisplay>{newOrgAccount.error.toString()}</ErrorDisplay>
      )}

      <AccessGrid
        access={access}
        onUpdate={(_access: Access) => {
          setAccess({..._access})

          onUpdate({...newOrgAccount, access: _access})
        }}
        isEdit={true}
        // isCoadmin={coadmin}
        currentUserIsAdmin={isInAdminRole(sessionData.roles)}></AccessGrid>
    </Container>
  )
}

export default MemberInvite
