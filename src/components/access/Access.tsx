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
  Radio,
  TextField
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import React, { FunctionComponent, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
import { useSessionDataState } from '../../helpers/AuthContext'
import AccessService from '../../services/access.service'
import StudyTopNav from '../studies/StudyTopNav'
import Loader from '../widgets/Loader'

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

type AccessOwnProps = {
  title?: string
  paragraph?: string
}

type AccessProps = AccessOwnProps & RouteComponentProps

const Access: FunctionComponent<AccessProps> = ({
  title = 'something',
  paragraph,
}) => {
  const classes = useStyles()
  let { id } = useParams<{ id: string }>()
  const [x, setX] = useState<number[]>([])
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
     
        const members = await AccessService.getAccountsForOrg(token!, orgMembership!)
       return members
      })(orgMembership, token),
    )
  }, [run])

  React.useEffect(() => {}, [orgMembership])

  const invite = () => {}
  const synapseAliasToUserId = async (
    alias: string = 'agendel@synapse.org',
  ) => {
    const synapseId = await AccessService.getAliasFromSynapseByEmail(alias)

    const isSuccess = await AccessService.createAccount(
      token!,
      alias,
      synapseId,
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

  return (
    <>
      <StudyTopNav studyId={id} currentSection={''}></StudyTopNav>
      <Container maxWidth="lg" className={classes.root}>
        <Box marginRight="40px">
          <h3>Team Members</h3>
            <ul>
          {members.map((member: any) => (
           <li>{`${member.firstName} ${member.lastName}${member.email ?  ': '+ member.email: ''}`}</li>))}
           </ul>
          <Divider />
          <Button onClick={() => setIsOpenInvite(true)} variant="contained">Invite member</Button>
        </Box>
        <Box>
          <h3>Access Type</h3>
          <table>
            <tr>
              <th></th>
              <th>No Access</th>
              <th>Viewer</th>
              <th>Editor</th>
            </tr>
            <tr>
              <td>Full Study Administration</td>
              <td>
                <Radio
                  checked={x[0] === 0}
                  onChange={x => setX([0])}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              </td>
              <td>
                {' '}
                <Radio
                  checked={x[0] === 1}
                  onChange={x => setX([1])}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              </td>
              <td>
                {' '}
                <Radio
                  checked={x[0] === 2}
                  onChange={x => setX([2])}
                  value="a"
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'A' }}
                />
              </td>
            </tr>

            <tr>
              <td>Study Builder</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>Participant Manager</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Compliance Dashboard</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>

            <tr>
              <td>Data Access</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </table>
        </Box>
      </Container>
     {status === 'RESOLVED' && <Dialog open={isOpenInvite} maxWidth="lg" aria-labelledby="form-dialog-title">
        <DialogTitle>
          Invite Team Members
          <IconButton
            aria-label="close"
            className={'' /*classes.closeButton*/}
            onClick={() => setIsOpenInvite(false)}
            style={{position: 'absolute', top: '16px', right: '16px' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          Current Team Members
          <ul>
          {members.map((member: any) => (
           <li>{member.email}</li>))}
           </ul>
          <TextField multiline={true} label="Email:"></TextField>
        </DialogContent>
        <Button
          onClick={() => synapseAliasToUserId('agendel_test@synapse.org')}
        >
          Next
        </Button>
      </Dialog>}
    </>
  )
}

export default Access
