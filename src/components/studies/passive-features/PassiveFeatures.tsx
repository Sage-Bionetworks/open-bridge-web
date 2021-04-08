import { Box, Divider, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ThemeType } from '../../../style/theme'
import {
  BackgroundRecorders,
  Study,
  StudyBuilderComponentProps
} from '../../../types/types'
import { MTBHeadingH1, MTBHeadingH3, MTBHeadingH5 } from '../../widgets/Headings'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    backgroundColor: '#fff',

    padding: theme.spacing(6, 20, 12, 9),
    textAlign: 'left',
  },
  divider: {
    marginLeft: theme.spacing(9),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(4),
  },
  intro: {
    width: '350px',
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(9),
  },
  row: {
    display: 'flex',

    alignItems: 'center',
  },
  toggle: {
    width: theme.spacing(5),
    marginRight: theme.spacing(4),
  },
  feature: {
    width: '40%',
    marginRight: theme.spacing(7),
    '& strong': {
      fontSize: '21px',
      display: 'block',
    },
  },
  activation: {},
}))

export interface PassiveFeaturesProps {
  study: Study
}

const PassiveFeatures: React.FunctionComponent<
  PassiveFeaturesProps & StudyBuilderComponentProps
> = ({
  study,
  onUpdate,

  children,
}: PassiveFeaturesProps & StudyBuilderComponentProps) => {
  const classes = useStyles()
  const [features, setFeatures] = React.useState<
    BackgroundRecorders | undefined
  >(study.clientData.backgroundRecorders)

  return (
    <>
      <div className={classes.root}>
        <MTBHeadingH3 className={classes.intro}>
          The Mobile Toolbox App offers the additionally following passive
          collection features.
        </MTBHeadingH3>
        <MTBHeadingH3 className={classes.intro}>
          Please switch on the features you would like to use during your study.{' '}
        </MTBHeadingH3>

        <Box mt={9}>
          <div className={classes.row}>
            <div className={classes.toggle}></div>
            <div className={classes.feature}>
              <MTBHeadingH5>Feature</MTBHeadingH5>
            </div>
            <div className={classes.activation}>
              <MTBHeadingH5>Activation</MTBHeadingH5>
            </div>
          </div>

          <Divider className={classes.divider}></Divider>

          <div className={classes.row}>
            <div className={classes.toggle}>
              <Switch
                color="primary"
                value={features?.accelGyro == false}
                onChange={e => {
                  onUpdate({ ...features, accelGyro: e.target.checked })
                }}
              ></Switch>
            </div>
            <div className={classes.feature}>
              <strong>Accel &amp; Gyro</strong>
              Description about this measure goes here.{' '}
            </div>
            <div className={classes.activation}>
              During measure administration
            </div>
          </div>
          <br/>    <br/>    <br/>    <br/>
         <MTBHeadingH1>[TODO - other measures as determined]</MTBHeadingH1> 
        </Box>
      </div>
      {children}
    </>
  )
}

export default PassiveFeatures
