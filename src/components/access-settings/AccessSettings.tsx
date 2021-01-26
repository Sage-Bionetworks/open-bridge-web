import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  makeStyles,

  TextField
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
import { useSessionDataState } from '../../helpers/AuthContext'
import AccessService from '../../services/access.service'
import StudyTopNav from '../studies/StudyTopNav'
import Loader from '../widgets/Loader'
import AccessGrid, { Access } from './AccessGrid'

const useStyles = makeStyles(theme => ({
  root: {
    border: '1px solid black',
    marginTop: theme.spacing(12),
    display: 'flex',
    padding: `${theme.spacing(3)}px, ${theme.spacing(5)}px, ${theme.spacing(
      3,
    )}px, ${theme.spacing(5)}px`,
  },
}))

//export const AccessRestriction = ['NO_ACCESS', 'VIEWER', 'EDITOR']

type AccessSettingsOwnProps = {
  title?: string
  paragraph?: string
}
/*
export type AccessLabel = {
  [key: string]: string
}

export type Access = {
  STUDY_BUILDER: typeof AccessRestriction[number]
  PARTICIPANT_MANAGER: typeof AccessRestriction[number]
  ADHERENCE_DATA: typeof AccessRestriction[number]
}


const roles: AccessLabel[] = [
  { STUDY_BUILDER: 'STUDY BUILDER' },
  { PARTICIPANT_MANAGER: 'PARTICIPANT MANAGER' },
  { ADHERENCE_DATA: 'ADHERENCE DATA' },*/
//]
type AccessSettingsProps = AccessSettingsOwnProps & RouteComponentProps

const NameDisplay: FunctionComponent<any> = ({
  firstName,
  lastName,
  email,
}): JSX.Element => {
  const firstLine =
    firstName || lastName ? (
      <strong>
        {[firstName, lastName].join(' ')} <br />
      </strong>
    ) : (
      <></>
    )
  return (
    <li>
      {firstLine} <span>{email}</span>
    </li>
  )
}

const AccessSettings: FunctionComponent<AccessSettingsProps> = ({
  title = 'something',
  paragraph,
}) => {
  const classes = useStyles()
  let { id } = useParams<{ id: string }>()
  const [access, setAccess] = React.useState<Access>({
    STUDY_BUILDER: 'NO_ACCESS',
    PARTICIPANT_MANAGER: 'NO_ACCESS',
    ADHERENCE_DATA: 'NO_ACCESS',
  })
  const [isOpenInvite, setIsOpenInvite] = React.useState(false)

  const { token, orgMembership } = useSessionDataState()

  const handleError = useErrorHandler()

  const { data: members, status, error, run, setData } = useAsync<any>({
    status: 'PENDING',
    data: [],
  })

  React.useEffect(() => {
    ///your async call

    return run(
      (async function (orgMembership, token) {
        const members = await AccessService.getAccountsForOrg(
          token!,
          orgMembership!,
        )
        return members
      })(orgMembership, token),
    )
  }, [run])

  React.useEffect(() => {}, [orgMembership])

  const synapseAliasToUserId = async (
    alias: string = 'agendel_test@synapse.org',
  ) => {
    const {
      principalId,
      firstName,
      lastName,
    } = await AccessService.getAliasFromSynapseByEmail(alias)

    const isSuccess = await AccessService.createAccount(
      token!,
      alias,
      principalId,
      firstName,
      lastName,
      orgMembership!,
    )
    console.log(isSuccess)
  }

  if (status === 'PENDING') {
    return <Loader reqStatusLoading={true}></Loader>
  }
  if (status === 'REJECTED') {
    handleError(error!)
  }

  /*const updateAccess = (restriction: string, accessObject: AccessLabel) => {
    const accessKey = Object.keys(accessObject)[0]
    setAccess({ ...access, [accessKey]: restriction })
  }*/

  return (
    <>
      <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>
      <Container maxWidth="lg" className={classes.root}>
        <Box marginRight="40px">
          <h3>Team Members</h3>
          <ul>
            {members.map((member: any) => (
              <NameDisplay {...member}></NameDisplay>
            ))}{' '}
          </ul>
          <Divider />
          <Button onClick={() => setIsOpenInvite(true)} variant="contained">
            Invite member
          </Button>
        </Box>
      <AccessGrid access={access} onUpdate={((_access: Access)=> setAccess(_access))} isEdit={true}></AccessGrid>
       
      </Container>
      {status === 'RESOLVED' && (
        <Dialog
          open={isOpenInvite}
          maxWidth="lg"
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            Invite Team Members
            <IconButton
              aria-label="close"
              className={'' /*classes.closeButton*/}
              onClick={() => setIsOpenInvite(false)}
              style={{ position: 'absolute', top: '16px', right: '16px' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField multiline={true} label="Email:" fullWidth></TextField>
          </DialogContent>
          <Button onClick={() => synapseAliasToUserId()}>Next</Button>
        </Dialog>
      )}
    </>
  )
}

export default AccessSettings
