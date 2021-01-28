import {
  Container,
  FormControlLabel,
  makeStyles,
  Switch,
  TextField
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import ErrorDisplay from '../widgets/ErrorDisplay'
import AccessGrid, { Access } from './AccessGrid'

const useStyles = makeStyles(theme => ({
  root: {},
}))

export const NO_ACCESS: Access = {
  STUDY_BUILDER: 'NO_ACCESS',
  PARTICIPANT_MANAGER: 'NO_ACCESS',
  ADHERENCE_DATA: 'NO_ACCESS',
  STUDY_DATA: 'NO_ACCESS',
}

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
      setAccess({
        STUDY_BUILDER: 'EDITOR',
        PARTICIPANT_MANAGER: 'EDITOR',
        ADHERENCE_DATA: 'EDITOR',
        STUDY_DATA: 'VIEWER',
      })
    }
  }

  return (
    <Container maxWidth="lg" className={classes.root}>
      <TextField
        label="Email Adderess:"
        fullWidth
        variant="outlined"
        onChange={e => setEmail(e.target.value)}
        onBlur={e => onUpdate({ ...newOrgAccount, email: email })}
        color="secondary"
        value={email || ''}
      ></TextField>
      {newOrgAccount.error && (
        <ErrorDisplay>{newOrgAccount.error.toString()}
        </ErrorDisplay>
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
