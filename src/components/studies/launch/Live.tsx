import { Button, Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import confetti from '../../../assets/launch/confetti.svg'
import {
  StudyInfoData,
  useStudyInfoDataState
} from '../../../helpers/StudyInfoContext'
import { ThemeType } from '../../../style/theme'
import { MTBHeadingH1 } from '../../widgets/Headings'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
    backgroundImage: 'url(' + confetti + ')',
    backgroundColor: 'black',
    backgroundPosition: 'center top',
    width: '1000px',
    height: '1000px',
    margin: '40px auto 0 auto',
    backgroundRepeat: 'no-repeat',
    paddingTop: theme.spacing(29),
    textAlign: 'center',
    //color: '#fff',
  },
}))

const Live: React.FunctionComponent<RouteComponentProps> =
  ({}: RouteComponentProps) => {
    const classes = useStyles()
    const builderInfo: StudyInfoData = useStudyInfoDataState()
    if (!builderInfo.study) {
      return <></>
    }
    return (
      <div className={classes.root}>
        <Container maxWidth="xs">
          <div style={{ marginLeft: '-80px' }}>
            <MTBHeadingH1 style={{ color: '#fff', marginBottom: '40px' }}>
              Congratulations!
            </MTBHeadingH1>
            <MTBHeadingH1
              style={{
                color: '#fff',
                marginBottom: '40px',
                fontWeight: 'normal',
              }}
            >
              {builderInfo.study.name} is officially live!
            </MTBHeadingH1>

            <p>
              You may now enroll <br />
              participants to this study.
            </p>

            {
              <Button
                color="secondary"
                href={'/studies/:id/participant-manager'.replace(
                  ':id',
                  builderInfo.study.identifier,
                )}
                style={{
                  backgroundColor: '#fff',
                  color: '#000',
                  marginTop: '24px',
                  borderRadius: '0',
                }}
              >
                Enroll Participants
              </Button>
            }
          </div>
        </Container>
      </div>
    )
  }

export default Live
