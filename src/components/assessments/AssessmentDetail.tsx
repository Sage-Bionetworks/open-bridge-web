import {
  Box,
  Container,
  createStyles,
  Divider,
  makeStyles,
  Paper,
  Typography,
  useTheme
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
import { useSessionDataState } from '../../helpers/AuthContext'
import AssessmentService from '../../services/assessment.service'
import { Assessment } from '../../types/types'
import BreadCrumb from '../widgets/BreadCrumb'
import { MTBHeading } from '../widgets/Headings'
import ObjectDebug from '../widgets/ObjectDebug'
import AssessmentImage from './AssessmentImage'

const useStyles = makeStyles(theme =>
  createStyles({
    breadCrumbs: {
      backgroundColor: '#E5E5E5',
      padding: `${theme.spacing(7)}px ${theme.spacing(5)}px  ${theme.spacing(
        5,
      )}px  ${theme.spacing(5)}px`,
    },
    container: {
      padding: theme.spacing(6),
    },
  }),
)

type AssessmentDetailOwnProps = {

}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = (

) => {
  const { token } = useSessionDataState()
  const classes = useStyles()
  const theme = useTheme()

  const links = [{ url: '/assessments', text: 'Assessments' }]

  let { id } = useParams<{ id: string }>()

  const handleError = useErrorHandler()

  const { data, status, error, run, setData } = useAsync<Assessment>({
    status: 'PENDING',
    data: null,
  })

  React.useEffect(() => {
    ///your async call

    return run(
      (async function (guid, token) {
        const {
          assessments,
          tags,
        } = await AssessmentService.getAssessmentsWithResources(id, token)
        if (assessments.length === 0) {
          throw ('no assessment found')
        } else {
          return assessments[0]
        }
      })(id, token),
    )
  }, [run, id, token])
  if (status === 'PENDING' || !data) {
    return <>loading component here</>
  } else if (status === 'REJECTED') {
    handleError(error!)
  } else {
    return (
      <>
        <Paper className={classes.breadCrumbs}>
          <BreadCrumb links={links} currentItem={data.title}></BreadCrumb>
        </Paper>
        <ObjectDebug label="add" data={data}></ObjectDebug>
        <Container maxWidth="lg" style={{ textAlign: 'center' }}>
          <Paper className="classes.container">
            <Box display="flex">
              <Box width="530px" marginRight="32px">
                <AssessmentImage
                  name="X"
                  resources={data.resources}
                  isSmall={true}
                  variant={'LANDSCAPE'}
                ></AssessmentImage>
              </Box>
              <Box textAlign="left">
                <Typography variant="subtitle2">
                  {data.tags.join(', ')}
                </Typography>
                <MTBHeading variant="h1">{data.title}</MTBHeading>
                <Box>{data.summary}</Box>
                <Divider />
                {data.duration} min
              </Box>
            </Box>
          </Paper>
        </Container>
      </>
    )
  }
  return <></>
}

export default AssessmentDetail
