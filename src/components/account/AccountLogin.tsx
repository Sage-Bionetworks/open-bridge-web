import {ReactComponent as SynapseLogo} from '@assets/synapse_logo_blue.svg'
import Utility from '@helpers/utility'
import {Box, Button, Container, Snackbar} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import Alert, {AlertProps} from '@mui/material/Alert'
import {poppinsFont} from '@style/theme'
import clsx from 'clsx'
import React, {FunctionComponent, useState} from 'react'

type AccountLoginOwnProps = {
  callbackFn: Function
  isArcSignIn?: boolean
}

type AccountLoginProps = AccountLoginOwnProps

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
  arcSubmitbutton: {
    width: '200px',
    height: '56px',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    },
    fontFamily: poppinsFont,
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
    padding: theme.spacing(2, 3),
  },
  text: {
    fontFamily: poppinsFont,
    fontSize: '19px',
    lineHeight: '27px',
    maxWidth: '275px',
    marginBottom: theme.spacing(3),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  mtbText: {
    maxWidth: '330px',
  },
}))

const AccountLogin: FunctionComponent<AccountLoginProps> = ({isArcSignIn}) => {
  const [alertMsg, setAlertMsg] = useState<
    {msg: string; type: AlertProps['severity']} | undefined
  >()

  const classes = useStyles()

  return (
    <>
      <Snackbar
        open={alertMsg !== undefined}
        autoHideDuration={2000}
        anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        onClose={() => setAlertMsg(undefined)}>
        <Alert onClose={() => setAlertMsg(undefined)} severity={alertMsg?.type}>
          {alertMsg?.msg}
        </Alert>
      </Snackbar>

      <Container
        component="main"
        maxWidth="xs"
        className={classes.buttonContainer}>
        <Box className={clsx(classes.text, !isArcSignIn && classes.mtbText)}>
          {isArcSignIn
            ? 'Please sign in to ARC using your Synapse account.'
            : 'Please sign in to Mobile Toolbox using your Synapse account.'}
        </Box>
        <div className={classes.paper}>
          <Button
            variant="contained"
            onClick={e => Utility.redirectToSynapseLogin()}
            className={classes.arcSubmitbutton}>
            <SynapseLogo />
          </Button>
        </div>
      </Container>
    </>
  )
}

export default AccountLogin
