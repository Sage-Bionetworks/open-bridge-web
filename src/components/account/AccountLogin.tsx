import {ReactComponent as SynapseLogo} from '@assets/synapse_logo_blue.svg'
import useFeatureToggles, {FeatureToggles} from '@helpers/FeatureToggle'
import Utility from '@helpers/utility'
import {Box, BoxProps, Button, Container} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {poppinsFont} from '@style/theme'
import {useSourceApp} from '@typedefs/sourceAppConfig'
import clsx from 'clsx'
import {FunctionComponent} from 'react'
import {UseLoginReturn} from 'useLogin'
import UsernamePasswordForm from './UsernamePasswordForm'

type AccountLoginOwnProps = {
  callbackFn: Function
  submitUsernameAndPassword: UseLoginReturn['submitUsernameAndPassword']
  isLoadingLoginWithUsernameAndPassword: UseLoginReturn['isLoadingLoginWithUsernameAndPassword']
  errorMessageLoginWithUsernameAndPassword: UseLoginReturn['errorMessageLoginWithUsernameAndPassword']
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

const AccountLogin: FunctionComponent<AccountLoginProps> = ({
  isArcSignIn,
  submitUsernameAndPassword,
  isLoadingLoginWithUsernameAndPassword,
  errorMessageLoginWithUsernameAndPassword,
}) => {
  //const [alertMsg, setAlertMsg] = useState<{msg: string; type: AlertProps['severity']} | undefined>()
  const sourceApp = useSourceApp()
  const classes = useStyles()

  const featureToggles = useFeatureToggles<FeatureToggles>()
  const createSignInTextBox = (text: string, sx?: BoxProps['sx']) => {
    return (
      <Box className={clsx(classes.text, !isArcSignIn && classes.mtbText)} sx={sx}>
        {text}
      </Box>
    )
  }

  return (
    <>
      <Container component="main" maxWidth="xs" className={classes.buttonContainer}>
        {createSignInTextBox(`Please sign in to ${sourceApp.longName} with your Synapse account: `)}
        <div className={classes.paper}>
          <Button variant="contained" href={Utility.getRedirectLinkToOneSage()} className={classes.arcSubmitbutton}>
            <SynapseLogo />
          </Button>
        </div>
        {featureToggles['USERNAME PASSWORD LOGIN'] && (
          <>
            {createSignInTextBox('or with your Bridge credentials:', {mt: 4})}
            <UsernamePasswordForm
              onSubmit={submitUsernameAndPassword}
              isLoading={isLoadingLoginWithUsernameAndPassword}
              errorMessage={errorMessageLoginWithUsernameAndPassword}
            />
          </>
        )}
      </Container>
    </>
  )
}

export default AccountLogin
