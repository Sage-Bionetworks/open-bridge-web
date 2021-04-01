import {
  Box,
  Container,
  createStyles,
  Divider,
  makeStyles,
  Paper,
  Typography,
} from '@material-ui/core'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { useAsync } from '../../helpers/AsyncHook'
import { useUserSessionDataState } from '../../helpers/AuthContext'
import AssessmentService from '../../services/assessment.service'
import { Assessment } from '../../types/types'
import BreadCrumb from '../widgets/BreadCrumb'
import ObjectDebug from '../widgets/ObjectDebug'
import AssessmentImage from './AssessmentImage'
import { playfairDisplayFont, poppinsFont } from '../../style/theme'
import clsx from 'clsx'

const useStyles = makeStyles(theme =>
  createStyles({
    breadCrumbs: {
      backgroundColor: '#F8F8F8',
      padding: theme.spacing(5, 5, 8, 3),
      boxShadow: '0 0 0 0',
    },
    container: {
      padding: theme.spacing(6),
    },
    categories: {
      fontFamily: playfairDisplayFont,
      fontStyle: 'italic',
      fontSize: '20px',
      lineHeight: '20px',
      marginBottom: '15px',
    },
    informationText: {
      fontSize: '14px',
      lineHeight: '18px',
      marginTop: '20px',
      marginBottom: '20px',
      fontFamily: poppinsFont,
    },
    titleText: {
      fontFamily: 'Lato',
      fontSize: '32px',
      fontWeight: 'bold',
      lineHeight: '27px',
      marginBottom: '32px',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  }),
)

type AssessmentDetailOwnProps = {}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = () => {
  const { token } = useUserSessionDataState()
  const classes = useStyles()

  const links = [{ url: '/assessments', text: 'Assessments' }]

  let { id } = useParams<{ id: string }>()

  const handleError = useErrorHandler()

  const { data, status, error, run } = useAsync<Assessment>({
    status: 'PENDING',
    data: null,
  })

  console.log('data', data)

  const correctResource = data?.resources?.find(
    resource => resource.category === 'website',
  )
  console.log(correctResource, 'this is the correct resource!')

  React.useEffect(() => {
    ///your async call
    return run(
      (async function (id, token) {
        const {
          assessments,
        } = await AssessmentService.getAssessmentsWithResources(id)
        if (assessments.length === 0) {
          throw new Error('no assessment found')
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
      <div style={{ backgroundColor: '#F8F8F8', minHeight: '100vh' }}>
        <Paper className={classes.breadCrumbs}>
          <BreadCrumb links={links} currentItem={data.title}></BreadCrumb>
        </Paper>
        <Container
          maxWidth="lg"
          style={{ textAlign: 'center', backgroundColor: '#F8F8F8' }}
        >
          <Paper className="classes.container">
            <Box
              display="flex"
              style={{
                padding: '12px',
                paddingTop: '40px',
                borderRadius: '0px',
              }}
            >
              <Box width="530px" marginRight="32px">
                <AssessmentImage
                  name="X"
                  resources={data.resources}
                  isSmall={true}
                  variant={'LANDSCAPE'}
                ></AssessmentImage>
              </Box>
              <Box textAlign="left">
                <Typography variant="subtitle2" className={classes.categories}>
                  {data.tags.join(', ')}
                </Typography>
                <div className={classes.titleText}>{data.title}</div>
                <Box>{data.summary}</Box>
                <Divider
                  style={{
                    marginTop: '16px',
                    marginBottom: '20px',
                    width: '100%',
                  }}
                />
                <div className={classes.informationText}>
                  {data.duration} min
                </div>
                <div className={classes.informationText}>[Age: 18+]</div>
                <div className={clsx(classes.informationText, classes.row)}>
                  <div style={{ width: '100px' }}>Designed By:</div>
                  <div>
                    {correctResource && correctResource.creators
                      ? correctResource.creators.join(', ')
                      : ''}
                  </div>
                </div>
                <div className={classes.informationText}>
                  [Used in <u>15 published studies</u>]
                </div>
                <div className={classes.informationText}>
                  [2840 participants]
                </div>
              </Box>
            </Box>
          </Paper>
        </Container>
      </div>
    )
  }
  return <></>
}

export default AssessmentDetail
