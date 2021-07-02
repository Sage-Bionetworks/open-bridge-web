import {
  Button,
  Container,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core'
import React, {FunctionComponent, useState} from 'react'
import UserService from '../../services/user.service'

type PasswordResetProps = {
  username: string
  callbackFn: Function
}

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '400px',
  },

  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}))

const PasswordReset: FunctionComponent<PasswordResetProps> = ({
  username: _username,
  callbackFn,
}) => {
  const classes = useStyles()
  const [username, setUsername] = useState(_username)

  const requestResetPassword = async (username: string) => {
    console.log(username)
    const response = await UserService.requestResetPassword(username)
    const success = response.status === 200 || response.status === 202
    callbackFn(
      success,
      success ? 'Password has been sent' : 'Password reset error'
    )
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Forgot Password
      </Typography>
      <div className={classes.paper}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          value={username}
          onChange={event => setUsername(event.target.value)}
          autoFocus
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={!username}
          onClick={() => requestResetPassword(username)}>
          Send Email
        </Button>
        <Grid container>
          <Grid item xs>
            <Button onClick={() => callbackFn('')} variant="text">
              Cancel
            </Button>
          </Grid>
        </Grid>
      </div>
    </Container>
  )
}

export default PasswordReset
