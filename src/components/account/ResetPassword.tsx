import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'
import {Alert, Button, Container, FormControl, Snackbar, Typography} from '@mui/material'
import UserService from '@services/user.service'
import {poppinsFont} from '@style/theme'
import React from 'react'

type ResetPasswordProps = {}
export const ResetPassword: React.FunctionComponent<ResetPasswordProps> = () => {
  const [email, setEmail] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [showMessage, setShowMessage] = React.useState(false)

  const emailInputId = 'email'

  const handleRequestResetPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    await UserService.requestResetPassword(email)
      .then(result => {
        setMessage(result.data.message)
      })
      .catch((err: Error) => {
        setMessage(err.message)
      })
      .finally(() => {
        setShowMessage(true)
      })
  }

  const handleCloseMessage = () => {
    setShowMessage(false)
  }

  return (
    <Container component="main" maxWidth="xs" sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Typography variant="h3" mb={2} sx={{fontFamily: poppinsFont}}>
        Reset your password
      </Typography>
      <Typography variant="body1" mb={2} sx={{fontFamily: poppinsFont}}>
        Please enter your email address and we'll send you instructions to reset your password.
      </Typography>
      <form onSubmit={e => handleRequestResetPassword(e)}>
        <FormControl fullWidth sx={{mb: 2}}>
          <SimpleTextLabel htmlFor={emailInputId}>Email</SimpleTextLabel>
          <SimpleTextInput
            id={emailInputId}
            value={email}
            variant="outlined"
            autoFocus={true}
            onChange={e => setEmail(e.target.value)}
            multiline={false}
            fullWidth={true}
            sx={{'& input': {height: '28px'}}}
          />
        </FormControl>
        <Button fullWidth type="submit" color="primary" variant="contained" disabled={email === ''} sx={{mb: 2}}>
          Reset My Password
        </Button>
        <Snackbar open={showMessage} autoHideDuration={6_000} onClose={handleCloseMessage}>
          <Alert severity="success" sx={{width: '100%'}}>
            {message}
          </Alert>
        </Snackbar>
      </form>
    </Container>
  )
}
