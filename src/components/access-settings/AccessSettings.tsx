import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { ReactComponent as Delete } from '../../assets/trash.svg'
import { useSessionDataState } from '../../helpers/AuthContext'
import AccessService from '../../services/access.service'
import StudyTopNav from '../studies/StudyTopNav'
import { Access, NO_ACCESS } from './AccessGrid'
import AccountListing from './AccountListing'
import MemberInvite, { NewOrgAccount } from './MemberInvite'

const useStyles = makeStyles(theme => ({
  root: {
    //border: '1px solid black',
    marginTop: theme.spacing(12),
    display: 'flex',
    padding: 0,
  },
  yellowButton: {
    marginTop: theme.spacing(2),
    backgroundColor: '#FFE500',
    color: '#000',
  },
  newOrgAccount: {
    position: 'relative',
    marginBottom: theme.spacing(2),

    padding: theme.spacing(6, 12, 8, 12),

    '&$error': {
      border: `1px solid ${theme.palette.error.main}`,
    },
  },
  addNewDialogHeader: {
    color: theme.palette.common.white,
    backgroundColor: theme.palette.common.black,
    textAlign: 'center',
    padding: theme.spacing(10, 6, 4, 6),
  },
  addNewDialogBody: {
    padding: theme.spacing(10, 21, 3, 21),
    backgroundColor: theme.palette.background.default,
  },
  iconButton: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(3),
    padding: 0,
    color: theme.palette.common.white,
  },
  buttons: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',

    '& > *': {
      '&:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
  },
  error: {},
}))

type AccessSettingsOwnProps = {
  title?: string
  paragraph?: string
}

type AccessSettingsProps = AccessSettingsOwnProps & RouteComponentProps

function CreateNewOrgAccountTemplate() {
  const newOrgAccount: NewOrgAccount = {
    id: new Date().getTime() + ' ' + Math.random,
    access: NO_ACCESS,
    isAdded: false,
  }
  return newOrgAccount
}

async function createNewAccount(
  email: string,
  access: Access,
  token: string,
  currentUserOrg: string,
) {
  const mapAccessToRole = (access: Access): string => {
    return 'developer'
  }
  try {
    const {
      principalId,
      firstName,
      lastName,
    } = await AccessService.getAliasFromSynapseByEmail(email)

    const isSuccess = await AccessService.createIndividualAccount(
      token!,
      email,
      principalId,
      firstName,
      lastName,
      currentUserOrg,
      mapAccessToRole(access),
    )
    return [true]
  } catch (error: any) {
    return [false, error]
  }
}
function filterNewAccountsByAdded(
  accounts: NewOrgAccount[],
  isAdded: boolean = true,
) {
  const result = accounts.filter(acct => acct.isAdded === isAdded)
  return result
}

const AccessSettings: FunctionComponent<AccessSettingsProps> = ({}) => {
  const classes = useStyles()
  let { id } = useParams<{ id: string }>()
  const [isOpenInvite, setIsOpenInvite] = React.useState(false)
  const [newOrgAccounts, setNewOrgAccounts] = React.useState<NewOrgAccount[]>([
    CreateNewOrgAccountTemplate(),
  ])

  const sessionData = useSessionDataState()
  const { token, orgMembership, roles, id:loggedInId } = sessionData 
  const [updateToggle, setUpdateToggle] = React.useState(false)

 

  const closeInviteDialog = () => {
    setNewOrgAccounts(_ => [CreateNewOrgAccountTemplate()])
    setIsOpenInvite(false)
  }

  const removeNewOrgAccount = (accountId: string) => {
    const remaining = newOrgAccounts.filter((acct, i) => acct.id !== accountId)
    setNewOrgAccounts(_ => remaining)
  }

  const updateNewOrgAccount = (updatedNewAccount: NewOrgAccount) => {
    setNewOrgAccounts(prev =>
      prev.map(acct => {
        return acct.id !== updatedNewAccount.id ? acct : updatedNewAccount
      }),
    )
  }

  const inviteUsers = async (newAccounts: NewOrgAccount[]) => {
    for (const account of newAccounts.filter(a => !a.isAdded)) {
      if (!account.email) {
        updateNewOrgAccount({ ...account, error: 'No email provided' })
        return
      }
      const [success, error] = await createNewAccount(
        account.email,
        account.access,
        token!,
        orgMembership!,
      )
      if (success) {
        updateNewOrgAccount({ ...account, isAdded: true })
      } else {
        const errorString = error.message || error.reason
        updateNewOrgAccount({ ...account, error: errorString })
      }
    }
    setUpdateToggle(prev=>!prev)
  }

  return (
    <>
      <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>
      <Container maxWidth="md" className={classes.root}>
        <Paper elevation={2} style={{ width: '100%' }}>
          <AccountListing sessionData={sessionData}  updateToggle={updateToggle}>
            <Button
              onClick={() => setIsOpenInvite(true)}
              variant="contained"
              className={classes.yellowButton}
            >
              Invite a Member
            </Button>
          </AccountListing>
        </Paper>
      </Container>
     <Dialog
          open={isOpenInvite}
          maxWidth="md"
          fullWidth
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle className={classes.addNewDialogHeader} disableTypography>
            <MailOutlineIcon style={{ width: '25px' }}></MailOutlineIcon>
            <Typography variant="subtitle2" style={{ fontSize: '25px' }}>
              Invite Team Members
            </Typography>
            <IconButton
              aria-label="close"
              className={classes.iconButton}
              onClick={() => {
                closeInviteDialog()
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.addNewDialogBody}>
            <pre>
              Enter 'sErr' in email address to simulate synapse error. Enter
              'bErr' in email address to simulate bridge error.
            </pre>
            {filterNewAccountsByAdded(newOrgAccounts).length > 0 && (
              <>
                <Paper
                  elevation={2}
                  style={{ margin: '16px 0' }}
                  key={'success'}
                  className={clsx(classes.newOrgAccount)}
                >
                  <strong>Added Succesfully</strong>
                  <br /> <br />
                  {filterNewAccountsByAdded(newOrgAccounts)
                    .map(acct => acct.email)
                    .join(', ')}
                </Paper>
              </>
            )}

            {filterNewAccountsByAdded(newOrgAccounts, false).map(
              (newOrgAccount, index) => (
                <Paper
                  elevation={2}
                  className={clsx(
                    classes.newOrgAccount,
                    newOrgAccount.error && classes.error,
                  )}
                  key={index + new Date().getTime()}
                >
                  {newOrgAccounts.length > 1 && (
                    <IconButton
                      aria-label="delete"
                      className={classes.iconButton}
                      onClick={() => removeNewOrgAccount(newOrgAccount.id)}
                    >
                      <Delete></Delete>
                    </IconButton>
                  )}
                  <MemberInvite
                    newOrgAccount={newOrgAccount}
                    index={index}
                    onUpdate={(newOrgAccount: NewOrgAccount) =>
                      updateNewOrgAccount(newOrgAccount)
                    }
                  />
                </Paper>
              ),
            )}
            <Button
              color="primary"
              variant="contained"
              onClick={() =>
                setNewOrgAccounts(prev => [
                  ...prev,
                  CreateNewOrgAccountTemplate(),
                ])
              }
            >
              + Add Another Member
            </Button>
            <Box className={classes.buttons}>
              <Button
                onClick={() => closeInviteDialog()}
                color="secondary"
                variant="outlined"
                style={{
                  display:
                    filterNewAccountsByAdded(newOrgAccounts, false).length === 0
                      ? 'none'
                      : 'inherit',
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => inviteUsers(newOrgAccounts)}
                color="primary"
                variant="contained"
                style={{
                  display:
                    filterNewAccountsByAdded(newOrgAccounts, false).length === 0
                      ? 'none'
                      : 'inherit',
                }}
              >
                <MailOutlineIcon />
                &nbsp;Invite To Study
              </Button>
              <Button
                onClick={() => closeInviteDialog()}
                color="primary"
                variant="contained"
                style={{
                  display:
                    filterNewAccountsByAdded(newOrgAccounts, false).length === 0
                      ? 'inherit'
                      : 'none',
                }}
              >
                Done
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
   
    </>
  )
}

export default AccessSettings
