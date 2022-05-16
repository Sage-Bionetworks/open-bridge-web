import Loader from '@components/widgets/Loader'
import { Box, Container, Divider, Paper, Typography } from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import { useAssessmentWithResources } from '@services/assessmentHooks'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps, useParams } from 'react-router-dom'
import ClockIcon from '../../assets/clock.svg'
import OfficialMobileToolboxVersion from '../../assets/official_mobile_toolbox_icon.svg'
import ScientificallyValidatedIcon from '../../assets/validated.svg'
import { playfairDisplayFont, poppinsFont } from '../../style/theme'
import BreadCrumb from '../widgets/BreadCrumb'
import AssessmentImage from './AssessmentImage'

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
      marginBottom: theme.spacing(2),
    },
    informationText: {
      fontSize: '14px',
      lineHeight: '18px',
      marginTop: theme.spacing(2.5),
      marginBottom: theme.spacing(2.5),
      fontFamily: poppinsFont,
    },
    titleText: {
      fontFamily: 'Lato',
      fontSize: '32px',
      fontWeight: 'bold',
      lineHeight: '27px',
      marginBottom: theme.spacing(4),
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
    },
    overallContainer: {
      backgroundColor: '#F8F8F8',
      minHeight: '100vh',
    },
    informationTextInContainer: {
      fontSize: '14px',
      lineHeight: '18px',
      fontFamily: poppinsFont,
    },
    imageTextRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      //  marginLeft: theme.spacing(-3.5),
      marginTop: theme.spacing(2.5),
      marginBottom: theme.spacing(2.5),
    },
    icon: {
      marginRight: theme.spacing(1),
      width: '20px',
      height: '20px',
    },
    divider: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2.5),
      width: '100%',
    },
    informationBox: {
      padding: theme.spacing(7.5),
      borderRadius: '0px',
    },
    overallBackground: {
      textAlign: 'center',
      backgroundColor: '#F8F8F8',
    },
    validatedIcon: {
      marginRight: theme.spacing(1),
      width: '24px',
      height: '24px',
    },
    imageTextRowValidatedIcon: {
      //marginLeft: theme.spacing(-3.9),
    },
  })
)

type AssessmentDetailOwnProps = {}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = () => {

  const classes = useStyles()
  const links = [{ url: '/assessments', text: 'Assessments' }]
  let { id } = useParams<{ id: string }>()
  const handleError = useErrorHandler()

  const { data, isError, error, isLoading } = useAssessmentWithResources(id)

  if (isError) {
    handleError(error!)
  }
  if (isLoading || !data) {
    return <Loader reqStatusLoading={true} />
  }

  const correctResource = data?.resources?.find(
    resource => resource.category === 'website'
  )

  return (
    <div className={classes.overallContainer}>
      <Paper className={classes.breadCrumbs}>
        <BreadCrumb links={links} currentItem={data.title}></BreadCrumb>
      </Paper>
      <Container maxWidth="lg" className={classes.overallBackground}>
        <Paper className="classes.container">
          <Box display="flex" className={classes.informationBox}>
            <Box width="530px" marginRight="32px" style={{ textAlign: 'left' }}>
              <AssessmentImage
                name={`${data.title}_img`}
                resources={data.resources}
                variant="detail"></AssessmentImage>
            </Box>
            <Box textAlign="left">
              <Typography variant="subtitle2" className={classes.categories}>
                {data.tags.join(', ')}
              </Typography>
              <div className={classes.titleText}>{data.title}</div>
              <Box>{data.summary}</Box>
              <Divider className={classes.divider} />
              <div
                className={clsx(
                  classes.imageTextRow,
                  classes.imageTextRowValidatedIcon
                )}>
                <img
                  className={classes.validatedIcon}
                  src={ScientificallyValidatedIcon}
                  alt="scientifically_validated_icon"></img>
                <div className={classes.informationTextInContainer}>
                  Scientifically Validated
                </div>
              </div>
              <div className={classes.imageTextRow}>
                <img
                  className={classes.icon}
                  src={OfficialMobileToolboxVersion}
                  alt="official_mobile_toolbox_icon"></img>
                <div className={classes.informationTextInContainer}>
                  Official Mobile Toolbox version
                </div>
              </div>
              <div className={classes.imageTextRow}>
                <img
                  className={classes.icon}
                  src={ClockIcon}
                  alt="clock_icon"></img>
                <div className={classes.informationTextInContainer}>
                  {data.minutesToComplete} min
                </div>
              </div>
              {/*<div className={classes.informationText}>[Age: 18 +]</div>*/}
              <div className={clsx(classes.informationText, classes.row)}>
                <div style={{ width: '100px' }}>Designed By:</div>
                <div>
                  {correctResource && correctResource.creators
                    ? correctResource.creators.join(', ')
                    : ''}
                </div>
              </div>
              {/* <div className={classes.informationText}>
                  [Used in <u>15 published studies</u>]
                </div>
                <div className={classes.informationText}>
                  [2840 participants]
                    </div>*/}
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  )

}

export default AssessmentDetail
