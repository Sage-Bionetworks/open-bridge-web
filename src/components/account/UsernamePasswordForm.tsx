import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Alert, Button, FormControl, TextFieldProps} from '@mui/material'
import {ChangeEvent, FunctionComponent, useState} from 'react'
import {UseLoginReturn} from 'useLogin'

type InputFieldProps = {
  id: string
  label: string
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  type?: TextFieldProps['type']
  autoComplete?: TextFieldProps['autoComplete']
  autoFocus?: TextFieldProps['autoFocus']
}

const InputField: FunctionComponent<InputFieldProps> = ({
  id,
  label,
  value,
  onChange,
  type,
  autoComplete,
  autoFocus,
}) => {
  const sx = {'& input': {height: '28px'}}

  return (
    <FormControl fullWidth sx={{mb: 2}}>
      <SimpleTextLabel htmlFor={id}>{label}</SimpleTextLabel>
      <SimpleTextInput
        id={id}
        value={value}
        variant="outlined"
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        onChange={onChange}
        type={type}
        multiline={false}
        fullWidth={true}
        sx={sx}
      />
    </FormControl>
  )
}

type UsernamePasswordFormProps = {
  onSubmit: UseLoginReturn['submitUsernameAndPassword']
  errorMessage: UseLoginReturn['errorMessageLoginWithUsernameAndPassword']
  isLoading: UseLoginReturn['isLoadingLoginWithUsernameAndPassword']
}

const UsernamePasswordForm: FunctionComponent<UsernamePasswordFormProps> = ({onSubmit, errorMessage, isLoading}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    onSubmit(username, password)
  }

  return (
    <form>
      <InputField
        id="username"
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoComplete="username"
        autoFocus={true}
      />
      <InputField
        id="password"
        label="Password"
        value={password}
        type="password"
        onChange={e => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <Button
        fullWidth
        color="primary"
        variant="contained"
        disabled={isLoading || username === '' || password === ''}
        sx={{mb: 2}}
        onClick={e => {
          handleLogin(e)
        }}>
        {isLoading ? 'Logging you in...' : 'Sign In'}
      </Button>
      {errorMessage && (
        <Alert variant="outlined" color="error" sx={{mt: 2, alignItems: 'center'}}>
          {errorMessage}
        </Alert>
      )}
    </form>
  )
}
export default UsernamePasswordForm
