import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import Loader from '@components/widgets/Loader'
import SideBarListItem from '@components/widgets/SideBarListItem'
import {useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import Delete from '@mui/icons-material/DeleteTwoTone'
import {Alert, Avatar, Backdrop, Box, Button, CircularProgress, Theme, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AccessService from '@services/access.service'
import ParticipantService from '@services/participants.service'
import UserService from '@services/user.service'
import {theme} from '@style/theme'
import {LoggedInUserClientData, LoggedInUserData, Study} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent, useRef} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import AccessGrid, {Access, NO_ACCESS, getAccessFromRoles, getRolesFromAccess, userHasCoadminAccess} from './AccessGrid'
import MemberInvite, {NewOrgAccount} from './MemberInvite'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  listing: {
    width: theme.spacing(52),
    marginLeft: theme.spacing(-7),

    padding: theme.spacing(0),
    borderRight: '2px solid #EAECEE',
  },
  list: {
    // ...globals.listReset,
    marginLeft: theme.spacing(-3.5),
    marginTop: theme.spacing(3),
    '&::-webkit-scrollbar': {
      width: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#C4C4C4',
      borderRadius: '4px',
    },
    overflowY: 'scroll',
    maxHeight: '500px',
    marginBottom: theme.spacing(3),
  },

  newOrgAccount: {
    position: 'relative',
    marginBottom: theme.spacing(2),
    padding: theme.spacing(6, 5, 8, 7),
    width: '100%',

    '&$error': {
      border: `1px solid ${theme.palette.error.main}`,
    },
  },
  error: {},
}))

function getNameDisplay({firstName, lastName, email, synapseUserId}: LoggedInUserData): string {
  const name = firstName || lastName ? [firstName, lastName].join(' ') : synapseUserId || email
  return name || ''
}

function CreateNewOrgAccountTemplate() {
  const newOrgAccount: NewOrgAccount = {
    id: new Date().getTime() + ' ' + Math.random,
    access: NO_ACCESS,
    isAdded: false,
  }
  return newOrgAccount
}

const NameDisplay: FunctionComponent<any> = ({member, index}): JSX.Element => {
  let name = getNameDisplay(member)
  let admin = <></>

  if (index === 0) {
    name = name + ' (You)'
  }
  admin = Utility.isInAdminRole(member.roles) ? (
    <Typography
      sx={{fontWeight: 400, fontStyle: 'italic', marginTop: theme.spacing(0.5), color: theme.palette.grey[700]}}>
      Administrator
    </Typography>
  ) : (
    <></>
  )

  return (
    <Box style={{textTransform: 'none'}}>
      <strong>{name}</strong>
      <br />
      <span style={{wordWrap: 'break-word'}}>{member.email}</span>
      {admin}
    </Box>
  )
}

const NameDisplayDetail: React.FunctionComponent<{member: LoggedInUserData; access: Access}> = ({member, access}) => {
  const adminText = (
    <>
      Administrator<span style={{color: '#EAECEE'}}>&nbsp;&#124;&nbsp;</span>
    </>
  )

  return (
    <Box style={{margin: theme.spacing(3, 0)}}>
      <Typography variant="h3">{getNameDisplay(member)}</Typography>
      <Box
        sx={{
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '18px',
          color: '#4A5056',
        }}>
        {userHasCoadminAccess(access) && adminText}

        {member.email}
      </Box>
    </Box>
  )
}

const AccessSettings: FunctionComponent<{study: Study}> = ({study}) => {
  const classes = useStyles()
  const sessionData = useUserSessionDataState()

  const {token, id, orgMembership} = sessionData
  const [updateToggle, setUpdateToggle] = React.useState(false)
  const handleError = useErrorHandler()
  const scollToRef = useRef<HTMLDivElement | null>(null)

  const [currentMemberAccess, setCurrentMemberAccess] = React.useState<
    {access: Access; member: LoggedInUserData} | undefined
  >()
  const [isAccessLoading, setIsAccessLoading] = React.useState(true)
  const [isUpdating, setIsUpdating] = React.useState(false)
  const [isCreatingNewMember, setIsCreatingNewMember] = React.useState(false)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)
  const [updateError, setUpdateError] = React.useState('')
  const [members, setMembers] = React.useState<LoggedInUserData[]>([])
  const [isAddingNewMember, setIsAddingNewMember] = React.useState(false)
  const [newOrgAccount, setNewOrgAccount] = React.useState<NewOrgAccount>(CreateNewOrgAccountTemplate())

  const getMembers = React.useCallback(
    async (orgMembership: string, token: string) => {
      const members = await AccessService.getAccountsForOrg(token!, orgMembership!)
      const meIndex = members.findIndex(m => m.id === id)
      const result = [members[meIndex], ...members.slice(0, meIndex), ...members.slice(meIndex + 1, members.length)]
      return result
    },
    [id]
  )

  async function createNewAccount(
    email: string,
    firstName: string | undefined,
    lastName: string | undefined,
    access: Access,
    token: string,
    currentUserOrg: string
  ) {
    try {
      let principalId: string | null = null
      let synapseFirstName: string | null = null
      let synapseLastName: string | null = null

      if (AccessService.isSynapseEmail(email)) {
        const synapseAlias = await AccessService.getAliasFromSynapseByEmail(email)
        principalId = synapseAlias.principalId
        synapseFirstName = synapseAlias.firstName
        synapseLastName = synapseAlias.lastName
      }

      const demoExternalId = await ParticipantService.signUpForAssessmentDemoStudy(token!)

      const {identifier: userId} = await AccessService.createIndividualAccount(
        token!,
        email,
        principalId,
        firstName || synapseFirstName,
        lastName || synapseLastName,
        currentUserOrg,
        {demoExternalId},
        getRolesFromAccess(access)
      )

      if (!AccessService.isSynapseEmail(email)) {
        await UserService.sendRequestResetPassword(userId, token!)
      }

      return [true]
    } catch (error) {
      return [false, error]
    }
  }

  React.useEffect(() => {
    let isSubscribed = true
    const fetchData = async () => {
      setIsAccessLoading(true)
      const result = await getMembers(orgMembership!, token!)
      if (isSubscribed) {
        setMembers(result)
      }
      setIsAccessLoading(false)
    }
    fetchData()
      .catch(error => handleError(error))
      .finally(() => setIsAccessLoading(false))
    return () => {
      isSubscribed = false
    }
  }, [orgMembership, token, updateToggle, getMembers, handleError])

  const deleteExistingAccount = async (member: LoggedInUserData) => {
    setUpdateError('')
    try {
      await AccessService.deleteIndividualAccount(token!, member.id)
      const result = await getMembers(orgMembership!, token!)
      setMembers(result)
    } catch (e) {
      setUpdateError((e as Error).message)
      throw e
    }
  }

  const updateRolesForExistingAccount = async ({member, access}: {member: LoggedInUserData; access: Access}) => {
    try {
      setUpdateError('')
      setIsUpdating(true)
      const roles = getRolesFromAccess(access)
      // this is patch for existing users
      let demoExternalId = member.clientData?.demoExternalId
      if (!demoExternalId) {
        demoExternalId = await ParticipantService.signUpForAssessmentDemoStudy(token!)
      }

      const clientData: LoggedInUserClientData = {
        demoExternalId,
      }
      await AccessService.updateIndividualAccountRoles(token!, member.id, roles, clientData)
      const result = await getMembers(orgMembership!, token!)
      setMembers(result)
    } catch (e) {
      setUpdateError((e as Error).message)
    } finally {
      setIsUpdating(false)
    }
  }

  const updateAccess = React.useCallback(async (member: LoggedInUserData) => {
    setIsAddingNewMember(false)
    setIsAccessLoading(true)
    const access = getAccessFromRoles(member.roles)
    setCurrentMemberAccess({access, member})
    setIsAccessLoading(false)
  }, [])

  React.useEffect(() => {
    ;(async function (member) {
      if (!member) {
        return
      }
      updateAccess(member)
    })(members ? members[0] : undefined)
  }, [members, updateAccess])

  const isSelf = (): boolean => {
    return currentMemberAccess?.member.id === id
  }

  const inviteUser = async (account: NewOrgAccount) => {
    setIsCreatingNewMember(true)
    if (!account.email) {
      setNewOrgAccount({...account, error: 'No email provided'})
      setIsCreatingNewMember(false)
      return
    }
    const [success, error] = await createNewAccount(
      account.email,
      account.firstName,
      account.lastName,
      account.access,
      token!,
      orgMembership!
    )
    if (success) {
      setNewOrgAccount({...account, isAdded: true})
      setUpdateToggle(prev => !prev)
    } else {
      const errorString = error.message || error.reason
      setNewOrgAccount({...account, error: errorString})
    }
    setIsCreatingNewMember(false)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.listing}>
        {/* hide for now since access is not per study 
        <Typography sx={{color: '#878E95', fontSize: '14px', fontWeight: 700}}>
          Study ID: {Utility.formatStudyId(study.identifier)}{' '}
        </Typography>
        <Typography sx={{color: '#22252A', fontSize: '20px', fontWeight: 700, fontStyle: 'italic'}}>
          {study.name}
        </Typography>*/}

        <ul className={classes.list}>
          {members &&
            members.map((member: any, index: number) => (
              <SideBarListItem
                key={member.id}
                variant={'dark'}
                isOpen={true}
                isActive={member.id === /*currentMemberId*/ currentMemberAccess?.member.id}
                onClick={() => updateAccess(member)}>
                <div
                  style={{
                    paddingLeft: '8px',
                    textAlign: 'left',
                    width: '100%',
                  }}>
                  <NameDisplay member={member} index={index}></NameDisplay>
                </div>
              </SideBarListItem>
            ))}
          <div ref={scollToRef}></div>
          {isAddingNewMember && (
            <SideBarListItem key={'new'} variant={'dark'} isOpen={true} isActive={true} onClick={() => {}}>
              <div
                style={{
                  paddingLeft: '8px',
                  textAlign: 'left',
                  width: '100%',
                }}>
                New Member
              </div>
            </SideBarListItem>
          )}
        </ul>
        <Box textAlign="center" pr={3}>
          {Utility.isInAdminRole() && (
            <Button
              onClick={() => setIsAddingNewMember(true)}
              variant="contained"
              color="primary"
              disabled={isAddingNewMember || isAccessLoading}>
              Add New Member
            </Button>
          )}
        </Box>
      </Box>
      <Loader
        reqStatusLoading={(!currentMemberAccess?.member && !isAddingNewMember) || isAccessLoading}
        style={{width: 'auto', margin: '0 auto'}}>
        {currentMemberAccess && !isAddingNewMember && (
          <>
            <Box pl={10} position="relative" pb={10} pr={5} width="100%">
              {updateError && (
                <Alert variant="outlined" color="error" style={{marginTop: '8px'}}>
                  {updateError}
                </Alert>
              )}
              {isUpdating && (
                <Box textAlign="center" mt={1}>
                  {' '}
                  <CircularProgress />
                </Box>
              )}
              <NameDisplayDetail member={currentMemberAccess!.member} access={currentMemberAccess!.access!} />
              <AccessGrid
                access={currentMemberAccess!.access!}
                onUpdate={(_access: Access) =>
                  setCurrentMemberAccess({
                    member: currentMemberAccess!.member,
                    access: _access,
                  })
                }
                isThisMe={isSelf()}
                currentUserIsAdmin={Utility.isInAdminRole()}></AccessGrid>
              {Utility.isInAdminRole() && !isSelf() && (
                <>
                  <Box textAlign="right">
                    <Button
                      sx={{
                        marginRight: 0,
                        marginLeft: 'auto',
                        marginBottom: theme.spacing(5),
                        fontSize: '14px',
                        fontWeight: 900,
                      }}
                      color="error"
                      variant="text"
                      aria-label="delete"
                      onClick={() => {
                        setUpdateError('')
                        setIsConfirmDeleteOpen(true)
                      }}
                      startIcon={
                        <Avatar sx={{background: 'rgba(255, 65, 100, 0.15)', width: '25px', height: '25px'}}>
                          <Delete sx={{color: '#FF4164'}} />
                        </Avatar>
                      }>
                      Remove from study
                    </Button>
                  </Box>
                  <Box textAlign="right">
                    <Button
                      aria-label="save changes"
                      color="primary"
                      variant="contained"
                      onClick={() => updateRolesForExistingAccount(currentMemberAccess!)}>
                      Save changes
                    </Button>
                  </Box>
                </>
              )}

              <ConfirmationDialog
                isOpen={isConfirmDeleteOpen}
                title={'Delete Member'}
                type={'DELETE'}
                onCancel={() => setIsConfirmDeleteOpen(false)}
                onConfirm={() => {
                  const member = {...currentMemberAccess!.member}
                  deleteExistingAccount(member)
                    .then(() => setIsConfirmDeleteOpen(false))
                    .catch(e => setUpdateError(e.message))
                }}>
                <div>
                  {updateError && (
                    <Alert variant="outlined" color="error" style={{marginBottom: '8px'}}>
                      {updateError}
                    </Alert>
                  )}

                  <strong>
                    Are you sure you would like to permanently delete {getNameDisplay(currentMemberAccess!.member)}
                  </strong>
                </div>
              </ConfirmationDialog>
            </Box>
          </>
        )}
        {isAddingNewMember && (
          <Box className={clsx(classes.newOrgAccount, newOrgAccount.error && classes.error)}>
            <MemberInvite
              newOrgAccount={newOrgAccount}
              onUpdate={(newOrgAccount: NewOrgAccount) => setNewOrgAccount(newOrgAccount)}
            />

            <Button
              disabled={isCreatingNewMember}
              sx={{marginLeft: 'auto', marginTop: theme.spacing(5), float: 'right'}}
              onClick={() => {
                scollToRef.current?.scrollIntoView()
                setCurrentMemberAccess(undefined)
                inviteUser(newOrgAccount)
              }}
              color="primary"
              variant="contained">
              {isCreatingNewMember ? 'Saving...' : 'Save Changes'}
            </Button>
            <Backdrop open={isCreatingNewMember} sx={{zIndex: theme => theme.zIndex.drawer + 1}}>
              <CircularProgress />
            </Backdrop>
          </Box>
        )}
      </Loader>
    </Box>
  )
}

export default AccessSettings
