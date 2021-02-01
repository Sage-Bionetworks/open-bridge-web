import { Box, Button, makeStyles, Theme } from '@material-ui/core'
import React, { FunctionComponent, ReactNode } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { ReactComponent as Delete } from '../../assets/trash.svg'
import { useAsync } from '../../helpers/AsyncHook'
import AccessService from '../../services/access.service'
import { globals } from '../../style/theme'
import { OrgUser, SessionData } from '../../types/types'
import ConfirmationDialog from '../widgets/ConfirmationDialog'
import Loader from '../widgets/Loader'
import SideBarListItem from '../widgets/SideBarListItem'
import AccessGrid, {
  Access,
  getAccessFromRoles,
  getRolesFromAccess
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
  list: { ...globals.listReset, marginLeft: -theme.spacing(3.5) },
  buttons: {
    display: 'flex',
    marginTop: theme.spacing(6),
    justifyContent: 'space-between',
    bottom: theme.spacing(4),
  },
}))

type AccountListingProps = {
  children?: ReactNode

  updateToggle: boolean
  sessionData: SessionData
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

const NameDisplay: FunctionComponent<any> = ({
  member,
  roles,
  index,
}): JSX.Element => {
  let name = getNameDisplay(member)

  let admin = <></>

  if (index === 0) {
    name = name + ' (You)'
    admin = roles.includes('admin') ? <div>Study Admin</div> : <></>
  }

  const firstLine = (
    <Box display="flex" justifyContent="space-between">
      <div>
        <strong>{name}</strong>
      </div>
      {admin}
    </Box>
  )

  return (
    <Box style={{ textTransform: 'none' }}>
      {firstLine}
      <span>{member.email}</span>
    </Box>
  )
}

const AccountListing: FunctionComponent<AccountListingProps> = ({
  updateToggle,
  sessionData,
  children,
}: AccountListingProps) => {
  const classes = useStyles()
  const { token, roles, id, orgMembership } = sessionData

  const handleError = useErrorHandler()

  const [currentMemberAccess, setCurrentMemberAccess] = React.useState<
    { access: Access; member: OrgUser } | undefined
  >()
  const [isAccessLoading, setIsAccessLoading] = React.useState(true)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const { data: members, status, error, run, setData } = useAsync<any>({
    status: 'PENDING',
    data: [],
  })

  async function getMembers(orgMembership: string, token: string) {
    const members = await AccessService.getAccountsForOrg(
      token!,
      orgMembership!,
    )
    const meIndex = members.findIndex(m => m.id === id)
    const result = [
      members[meIndex],
      ...members.slice(0, meIndex),
      ...members.slice(meIndex + 1, members.length),
    ]
    return result
  }

  React.useEffect(() => {


    return run(
      (async function (orgMembership, token) {
        console.log(token, orgMembership)
        const result = getMembers(orgMembership!, token!)

        return result
      })(orgMembership, token),
    )
  }, [run, orgMembership!, token!, updateToggle])

  const deleteExistingAccount = async (member: OrgUser) => {
    await AccessService.deleteIndividualAccount(token!, member.id)
    const result = await getMembers(orgMembership!, token!)
    setData(result)

  }

  const updateRolesForExistingAccount = async ({
    member,
    access,
  }: {
    member: OrgUser
    access: Access
  }) => {
    const roles = getRolesFromAccess(access)
    const user = await AccessService.updateIndividualAccountRoles(
      token!,
      member.id,
      roles,
    )
    const result = await getMembers(orgMembership!, token!)
    setData(result)

  }

  const updateAccess = async (memberId: string) => {
    setIsAccessLoading(true)
    const member = await AccessService.getIndividualAccount(token!, memberId)
    console.log(member.roles.join(','))
    const access = getAccessFromRoles(member.roles)

    setCurrentMemberAccess({ access, member })
    setIsAccessLoading(false)
  }

  React.useEffect(() => {
    ;(async function (id) {
      if (!id) {
        return
      }
      updateAccess(id)
    })(members ? members[0]?.id : undefined)
  }, [members])

  if (status === 'REJECTED') {
    handleError(error!)
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.listing}>
        <h3>Team Members</h3>
        {status === 'PENDING' && <Loader reqStatusLoading={true}></Loader>}{' '}
        <ul
          className={classes.list}
          style={{
            maxHeight: '400px',
            overflow: 'scroll',
            marginBottom: '16px',
          }}
        >
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
                onClick={() => updateAccess(member.id)}
              >
                <div
                  style={{
                    paddingLeft: '8px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <NameDisplay
                    member={member}
                    roles={roles}
                    index={index}
                  ></NameDisplay>
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
        style={{ width: 'auto', margin: '0 auto' }}
      >
        {currentMemberAccess && (
          <Box pl={15} position="relative">
            <h3 style={{ marginBottom: '80px', marginTop: '100px' }}>
              {' '}
              <NameDisplay
                member={currentMemberAccess!.member}
                roles={roles}
                index={-1}
              ></NameDisplay>
            </h3>
            <AccessGrid
              access={currentMemberAccess!.access!}
              onUpdate={(_access: Access) =>
                setCurrentMemberAccess({
                  member: currentMemberAccess!.member,
                  access: _access,
                })
              }
              isEdit={true}
            ></AccessGrid>

            {roles.includes('admin') && (
              <Box className={classes.buttons}>
                <Button
                  aria-label="delete"
                  onClick={() => {
                    setIsConfirmDeleteOpen(true)
                  }}
                  startIcon={<Delete />}
                >
                  Remove from study
                </Button>
                <Button
                  aria-label="save changes"
                  color="primary"
                  variant="contained"
                  onClick={() =>
                    updateRolesForExistingAccount(currentMemberAccess!)
                  }
                >
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
                const member = { ...currentMemberAccess!.member }
                // setCurrentMemberId(members[0].id)
                deleteExistingAccount(member)

                setIsConfirmDeleteOpen(false)
              }}
            >
              <div>
                <strong>
                  Are you sure you would like to permanently delete{' '}
                  {getNameDisplay(currentMemberAccess!.member)}
                </strong>
              </div>
            </ConfirmationDialog>
          </Box>
        )}
      </Loader>
    </Box>
  )
}

export default AccountListing
