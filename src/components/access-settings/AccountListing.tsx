import {Alert, Box, Button, Theme} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import ParticipantService from '@services/participants.service'
import React, {FunctionComponent, ReactNode} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {ReactComponent as Delete} from '../../assets/trash.svg'
import {useAsync} from '../../helpers/AsyncHook'
import Utility from '../../helpers/utility'
import AccessService from '../../services/access.service'
import {globals, poppinsFont} from '../../style/theme'
import {
  LoggedInUserClientData,
  OrgUser,
  Study,
  UserSessionData,
} from '../../types/types'
import ConfirmationDialog from '../widgets/ConfirmationDialog'
import {MTBHeadingH1, MTBHeadingH6} from '../widgets/Headings'
import Loader from '../widgets/Loader'
import SideBarListItem from '../widgets/SideBarListItem'
import AccessGrid, {
  Access,
  getAccessFromRoles,
  getRolesFromAccess,
} from './AccessGrid'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  listing: {
    width: theme.spacing(39),
    // marginRight: theme.spacing(15),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: theme.spacing(4, 0, 3, 3.5),
  },
  list: {
    ...globals.listReset,
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
    marginBottom: theme.spacing(2),
  },
  buttons: {
    display: 'flex',
    marginTop: theme.spacing(6),
    justifyContent: 'space-between',
    bottom: theme.spacing(4),
  },
  studyInfoNameText: {
    fontFamily: poppinsFont,
    lineHeight: '27px',
    fontSize: '18px',
  },
}))

type AccountListingProps = {
  children?: ReactNode
  study: Study
  updateToggle: boolean
  sessionData: UserSessionData
}

function getNameDisplay({
  firstName,
  lastName,

  synapseUserId,
}: OrgUser): string {
  const name =
    firstName || lastName ? [firstName, lastName].join(' ') : synapseUserId
  return name
}

const NameDisplay: FunctionComponent<any> = ({member, index}): JSX.Element => {
  let name = getNameDisplay(member)
  let admin = <></>

  if (index === 0) {
    name = name + ' (You)'
  }
  admin = Utility.isInAdminRole(member.roles) ? <div>Study Admin</div> : <></>

  const firstLine = (
    <Box display="flex" justifyContent="space-between">
      <div style={{maxWidth: '90%', wordWrap: 'break-word'}}>
        <strong>{name}</strong>
      </div>
      {admin}
    </Box>
  )

  return (
    <Box style={{textTransform: 'none'}}>
      {firstLine}
      <span style={{wordWrap: 'break-word'}}>{member.email}</span>
    </Box>
  )
}

const NameDisplayDetail: React.FunctionComponent<{member: OrgUser}> = ({
  member,
}) => {
  const classes = useStyles()
  return (
    <Box style={{marginBottom: '40px', marginTop: '80px'}}>
      <Box display="flex" alignItems="center">
        <Box className={classes.studyInfoNameText} fontWeight="bold">
          {getNameDisplay(member)}
        </Box>
        {Utility.isInAdminRole(member.roles) && (
          <Box className={classes.studyInfoNameText} fontWeight="normal">
            &#8287;{'| Study Admin'}
          </Box>
        )}
      </Box>
      <Box fontFamily={poppinsFont} fontSize="14px" mt={0.5}>
        {member.email}
      </Box>
    </Box>
  )
}

const AccountListing: FunctionComponent<AccountListingProps> = ({
  updateToggle,
  sessionData,
  study,
  children,
}: AccountListingProps) => {
  const classes = useStyles()
  const {token, id, orgMembership} = sessionData

  const handleError = useErrorHandler()

  const [currentMemberAccess, setCurrentMemberAccess] = React.useState<
    {access: Access; member: OrgUser} | undefined
  >()
  const [isAccessLoading, setIsAccessLoading] = React.useState(true)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)
  const [updateError, setUpdateError] = React.useState('')

  const {
    data: members,
    status,
    error,
    run,
    setData,
  } = useAsync<any>({
    status: 'PENDING',
    data: [],
  })

  const getMembers = React.useCallback(
    async (orgMembership: string, token: string) => {
      const members = await AccessService.getAccountsForOrg(
        token!,
        orgMembership!
      )
      const meIndex = members.findIndex(m => m.id === id)
      const result = [
        members[meIndex],
        ...members.slice(0, meIndex),
        ...members.slice(meIndex + 1, members.length),
      ]
      return result
    },
    [id]
  )

  React.useEffect(() => {
    return run(
      (async function (orgMembership, token) {
        const result = getMembers(orgMembership!, token!)

        return result
      })(orgMembership, token)
    )
  }, [run, orgMembership, token, updateToggle, getMembers])

  const deleteExistingAccount = async (member: OrgUser) => {
    setUpdateError('')
    try {
      await AccessService.deleteIndividualAccount(token!, member.id)
      const result = await getMembers(orgMembership!, token!)
      setData(result)
    } catch (e) {
      setUpdateError((e as Error).message)
    }
  }

  const updateRolesForExistingAccount = async ({
    member,
    access,
  }: {
    member: OrgUser
    access: Access
  }) => {
    try {
      setUpdateError('')
      const roles = getRolesFromAccess(access)
      // this is patch for existing users
      let demoExternalId = member.clientData?.demoExternalId
      if (!demoExternalId) {
        demoExternalId = await ParticipantService.signUpForAssessmentDemoStudy(
          token!
        )
      }

      const clientData: LoggedInUserClientData = {
        demoExternalId,
      }
      await AccessService.updateIndividualAccountRoles(
        token!,
        member.id,
        roles,
        clientData
      )
      const result = await getMembers(orgMembership!, token!)
      setData(result)
    } catch (e) {
      setUpdateError((e as Error).message)
    }
  }

  const updateAccess = React.useCallback(
    async (member: OrgUser) => {
      setIsAccessLoading(true)
      const access = getAccessFromRoles(member.roles)
      setCurrentMemberAccess({access, member})
      setIsAccessLoading(false)
    },
    [token]
  )

  React.useEffect(() => {
    ;(async function (member) {
      if (!member) {
        return
      }
      updateAccess(member)
    })(members ? members[0] : undefined)
  }, [members, updateAccess])

  if (status === 'REJECTED') {
    handleError(error!)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.listing}>
        <MTBHeadingH6>
          Study ID: {Utility.formatStudyId(study.identifier)}{' '}
        </MTBHeadingH6>
        <MTBHeadingH1 style={{color: ' #FCFCFC'}}>{study.name}</MTBHeadingH1>
        {status === 'PENDING' && <Loader reqStatusLoading={true}></Loader>}{' '}
        <ul className={classes.list}>
          {members &&
            members.map((member: any, index: number) => (
              <SideBarListItem
                key={member.id}
                variant={'dark'}
                isOpen={true}
                isActive={
                  member.id ===
                  /*currentMemberId*/ currentMemberAccess?.member.id
                }
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
        </ul>
        <Box textAlign="center" pr={3}>
          {children}
        </Box>
      </Box>
      <Loader
        reqStatusLoading={!currentMemberAccess?.member || isAccessLoading}
        style={{width: 'auto', margin: '0 auto'}}>
        {currentMemberAccess && (
          <>
            <Box pl={10} position="relative" pb={10}>
              {updateError && (
                <Alert
                  variant="outlined"
                  color="error"
                  style={{marginTop: '8px'}}>
                  {updateError}
                </Alert>
              )}
              <NameDisplayDetail member={currentMemberAccess!.member} />
              <AccessGrid
                access={currentMemberAccess!.access!}
                onUpdate={(_access: Access) =>
                  setCurrentMemberAccess({
                    member: currentMemberAccess!.member,
                    access: _access,
                  })
                }
                isThisMe={currentMemberAccess.member.id === id}
                currentUserIsAdmin={Utility.isInAdminRole()}></AccessGrid>
              {Utility.isInAdminRole() && (
                <Box className={classes.buttons}>
                  <Button
                    aria-label="delete"
                    onClick={() => {
                      setIsConfirmDeleteOpen(true)
                    }}
                    startIcon={<Delete />}>
                    Remove from study
                  </Button>
                  <Button
                    aria-label="save changes"
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      updateRolesForExistingAccount(currentMemberAccess!)
                    }>
                    Save changes
                  </Button>
                </Box>
              )}

              <ConfirmationDialog
                isOpen={isConfirmDeleteOpen}
                title={'Delete Study'}
                type={'DELETE'}
                onCancel={() => setIsConfirmDeleteOpen(false)}
                onConfirm={() => {
                  const member = {...currentMemberAccess!.member}
                  // setCurrentMemberId(members[0].id)
                  deleteExistingAccount(member)

                  setIsConfirmDeleteOpen(false)
                }}>
                <div>
                  <strong>
                    Are you sure you would like to permanently delete{' '}
                    {getNameDisplay(currentMemberAccess!.member)}
                  </strong>
                </div>
              </ConfirmationDialog>
            </Box>
          </>
        )}
      </Loader>
    </Box>
  )
}

export default AccountListing
