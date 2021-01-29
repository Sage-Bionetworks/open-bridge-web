import { Box, Button, makeStyles, Theme } from '@material-ui/core'
import React, { FunctionComponent, ReactNode } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { ReactComponent as Delete } from '../../assets/trash.svg'
import AccessService from '../../services/access.service'
import { globals } from '../../style/theme'
import { AdminRoles, OrgUser } from '../../types/types'
import ConfirmationDialog from '../widgets/ConfirmationDialog'
import Loader from '../widgets/Loader'
import SideBarListItem from '../widgets/SideBarListItem'
import AccessGrid, { Access, getAccessFromRoles } from './AccessGrid'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    width: '100%',
  },
  listing: {
    width: theme.spacing(39),
    marginRight: theme.spacing(15),
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: theme.spacing(4, 0, 3, 3.5),
  },
  list: { ...globals.listReset, marginLeft: -theme.spacing(3.5) },
  buttons: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    bottom: theme.spacing(4),
  },
}))

type AccountListingProps = {
  token: string
  children?: ReactNode
  members: OrgUser[]
  myRoles: AdminRoles[]
  onDelete: Function,
  onUpdate: Function
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
  token,
  members,
  children,
  myRoles,
  onDelete,
  onUpdate
}: AccountListingProps) => {
  const classes = useStyles()
  console.log('MEML:' + myRoles.join(','))

  const handleError = useErrorHandler()

  const [currentMemberId, setCurrentMemberId] = React.useState(members[0].id)
  const [currentMemberAccess, setCurrentMemberAccess] = React.useState<
    { access: Access; member: OrgUser } | undefined
  >()
  const [isAccessLoading, setIsAccessLoading] = React.useState(true)
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = React.useState(false)

  const updateAccess = async (memberId: string) => {
    setIsAccessLoading(true)
    const member = await AccessService.getIndividualAccount(token, memberId)
    console.log(member.roles.join(','))
    const access = getAccessFromRoles(member.roles)

    setCurrentMemberAccess({ access, member })
    setIsAccessLoading(false)
  }



  React.useEffect(() => {
    ;(async function (id) {
      updateAccess(id)
    })(currentMemberId)
  }, [currentMemberId])

  return (
    <Box className={classes.root}>
      <Box className={classes.listing}>
        <h3>Team Members</h3>
        <ul
          className={classes.list}
          style={{
            maxHeight: '400px',
            overflow: 'scroll',
            marginBottom: '16px',
          }}
        >
          {members.map((member: any, index: number) => (
            <SideBarListItem
              itemKey={member.id}
              variant={'dark'}
              isOpen={true}
              isActive={member.id === currentMemberId}
              onClick={() => setCurrentMemberId(member.id)}
            >
              <div
                style={{ paddingLeft: '8px', textAlign: 'left', width: '100%' }}
              >
                <NameDisplay
                  member={member}
                  roles={myRoles}
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
      >
        {currentMemberAccess && (
          <div style={{ position: 'relative' }}>
            <h3 style={{ marginBottom: '80px', marginTop: '100px' }}>
              {' '}
              <NameDisplay
                member={currentMemberAccess!.member}
                roles={myRoles}
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

            {myRoles.includes('admin') && (
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
                  onClick={() => {}}
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
                const member = {...currentMemberAccess!.member}
                setCurrentMemberId(members[0].id)
                onDelete(member)
              
                setIsConfirmDeleteOpen(false)
              }}
            >
              <div><strong>
                Are you sure you would like to permanently delete{' '}
                {getNameDisplay(currentMemberAccess!.member)}</strong>
              </div>
            </ConfirmationDialog>
          </div>
        )}
      </Loader>
    </Box>
  )
}

export default AccountListing
