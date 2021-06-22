import {
  Container,
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
  Box,
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { poppinsFont } from '../../style/theme'
import ErrorDisplay from '../widgets/ErrorDisplay'
import AccessGrid, { Access, getAccessFromRoles } from './AccessGrid'

const useStyles = makeStyles(theme => ({
  root: {
    minWidth: '500px',
    border: "1px solid purple"
  },
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
  const [coadmin, setCoadmin] = React.useState(false)

  const updateCoadmin = (isChecked: boolean) => {
    setCoadmin(isChecked)
    if (isChecked) {
      setAccess(getAccessFromRoles(['admin']))
    }
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <Box
        style={{
          fontFamily: poppinsFont,
          fontSize: '14px',
          marginBottom: '6px',
        }}
      >
        Email Address:
      </Box>
      <TextField
        fullWidth
        variant="outlined"
        onChange={e => setEmail(e.target.value)}
        onBlur={e => onUpdate({ ...newOrgAccount, email: email })}
        color="secondary"
        value={email || ''}
      ></TextField>
      {newOrgAccount.error && (
        <ErrorDisplay>{newOrgAccount.error.toString()}</ErrorDisplay>
      )}
      <FormControlLabel
        control={
          <Switch
            checked={coadmin}
            onChange={e => updateCoadmin(e.target.checked)}
            name="isCoadmin"
            color="primary"
          />
        }
        label="MAKE CO-ADMINISTRATOR OF STUDY"
        style={{ marginBottom: '48px', marginTop: '8px' }}
      />
      <AccessGrid
        access={access}
        onUpdate={(_access: Access) => {
          setAccess({ ..._access })
          setCoadmin(false)
          onUpdate({ ...newOrgAccount, access: _access })
        }}
        isEdit={true}
      ></AccessGrid>
    </Container>
  )
}

export default MemberInvite
