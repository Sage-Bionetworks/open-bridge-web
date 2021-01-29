import { Box, makeStyles, Theme } from '@material-ui/core'
import React, { FunctionComponent, ReactNode } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import AccessService from '../../services/access.service'
import { globals } from '../../style/theme'
import { OrgUser } from '../../types/types'
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
    paddingTop: theme.spacing(4),
    paddingRight: 0,
    paddingLeft: theme.spacing(3.5),
    paddingBottom: theme.spacing(3)

  },
  list: {...globals.listReset, marginLeft: -theme.spacing(3.5)},
}))

type AccountListingProps = {
  token: string
  children?: ReactNode
  members: OrgUser[]
}

const NameDisplay: FunctionComponent<any> = ({
  firstName,
  lastName,
  email,
  id,
  synapseUserId,
  ...rest
}: OrgUser): JSX.Element => {
  const firstLine =
    firstName || lastName ? (
      <strong>
        {[firstName, lastName].join(' ')} <br />
      </strong>
    ) : (
      <strong>{synapseUserId}</strong>
    )

  return (
    <>
      {firstLine} <span>{email}</span>
    </>
  )
}

const AccountListing: FunctionComponent<AccountListingProps> = ({
  token,
  members,
  children,
}: AccountListingProps) => {
  const classes = useStyles()
  console.log('MEML:' + members.length)

  const handleError = useErrorHandler()

  const [currentMemberId, setCurrentMemberId] = React.useState(members[0].id)
  const [currentMemberAccess, setCurrentMemberAccess] = React.useState<
    { access: Access; member: OrgUser } | undefined
  >()
  const [isAccessLoading, setIsAccessLoading] = React.useState(true)

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
        <ul className={classes.list} style={{maxHeight: '400px', overflow: 'scroll', marginBottom: '16px'}}>
          {[...members, ...members].map((member: any, index: number) => (
            <SideBarListItem
              itemKey={member.id}
              variant={'dark'}
              isOpen={true}
              isActive={member.id === currentMemberId}
              onClick={() => setCurrentMemberId(member.id)}
            >
              <div style={{ paddingLeft: '8px', textAlign: 'left' }}>
                <NameDisplay {...member}></NameDisplay>
              </div>
            </SideBarListItem>
          ))}
        </ul>
  <Box textAlign="center" paddingRight={"24px"}>
        {children}
        </Box>
      </Box>
      <Loader
        reqStatusLoading={!currentMemberAccess?.member || isAccessLoading}
      >
        {currentMemberAccess && (
          <div>
            <h3 style={{marginBottom: "80px", marginTop: "100px"}}>
              {' '}
              <NameDisplay {...currentMemberAccess!.member}></NameDisplay>
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
          </div>
        )}
      </Loader>
    </Box>
  )
}

export default AccountListing
