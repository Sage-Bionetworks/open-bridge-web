import { Box, Switch } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import motion from '../../../assets/passive-features/recorders_motion.svg'
import noise from '../../../assets/passive-features/recorders_noise.svg'
import weather from '../../../assets/passive-features/recorders_weather.svg'
import { latoFont, ThemeType } from '../../../style/theme'
import {
  BackgroundRecorders,
  Study,
  StudyBuilderComponentProps
} from '../../../types/types'
import { MTBHeadingH3 } from '../../widgets/Headings'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    backgroundColor: '#fff',

    padding: theme.spacing(6, 6, 7, 6),
    textAlign: 'left',
  },

  intro: {
    marginBottom: theme.spacing(2),
  },
  featureHeading: {
    fontFamily: latoFont,
    fontSize: '21px',
    fontWeight: 700,
  },

  section: {
    backgroundColor: '#F6F6F6',
    borderRadius: '10px',
    marginTop: theme.spacing(2),
    padding: theme.spacing(3, 6, 5, 6),
  },
  featureTable: {
    borderSpacing: theme.spacing(8, 0),
    margin: theme.spacing(0, -8, 0, -8),
    borderCollapse: 'separate',

    '& th': {
      fontFamily: latoFont,
      fontSize: '15px',
      height: theme.spacing(5),
      verticalAlign: 'top',
      fontWeight: 'bold',
    },
  },

  toggle: {
    marginLeft: theme.spacing(1.5),
  },
}))

type recorderTypeKeys = keyof BackgroundRecorders
export type RecorderInfo = {
  [K in recorderTypeKeys]: {
    value: boolean
    title: string
    description: string
    burden: string
    frequency: string
    img: string
  }
}

const sensors: Partial<RecorderInfo> = {
  motion: {
    description:
      'Motion Sensors Description about this background recorder and its use of accelerameter and gyro',
    title: 'Motion Sensors',
    frequency:
      'Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',
    img: motion,
    burden:
      'Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',
    value: false,
  },
  backgroundNoise: {
    description:
      'Background Noise Description about this background recorder and its use of accelerameter and gyro',
    frequency:
      'Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',

    title: 'Background Noise',
    img: noise,
    burden:
      'Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',

    value: false,
  },
  weatherPollution: {
    description:
      'Weather and Air Pollution Description about this background recorder and its use of accelerameter and gyro',
    frequency:
      'Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',

    title: 'Weather and Air Pollution',
    img: weather,
    burden:
      'Lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor lorem ipsum dolor',

    value: false,
  },
}

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

  const PFSection = ({
    recorderType,
    value = false,
    callbackFn,
  }: {
    recorderType: keyof BackgroundRecorders
    value?: boolean
    callbackFn: Function
  }): JSX.Element => {
    if (!recorderType) {
      return <></>
    }

    return (
      <div className={classes.section}>
        <Box display="flex" mb={5}>
          <img
            src={sensors[recorderType]!.img}
            alt={sensors[recorderType]!.title}
            style={{ marginRight: 'auto' }}
          />

          <span className={classes.featureHeading}>
            {sensors[recorderType]!.title}
          </span>
          <div className={classes.toggle}>
            <Switch
              color="primary"
              value={value == false /*features?[recorderType] == false*/}
              onChange={
                e =>
                  callbackFn(
                    e.target.checked,
                  ) /*{
            onUpdate({ ...features, motion: e.target.checked })
          }*/
              }
            ></Switch>
          </div>
        </Box>
        <table className={classes.featureTable}>
          <thead>
            <tr>
              <th>Description</th>
              <th>Frequency</th>
              <th>User Burden</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{sensors[recorderType]!.description}</td>
              <td>{sensors[recorderType]!.frequency}</td>
              <td>{sensors[recorderType]!.burden}</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <>
      <div className={classes.root}>
        <MTBHeadingH3 className={classes.intro}>
          The Mobile Toolbox App offers the additionally following passive
          collection features.
        </MTBHeadingH3>
        <MTBHeadingH3 className={classes.intro}>
          Please switch on the features you would like to use during your study.
        </MTBHeadingH3>
        <MTBHeadingH3 className={classes.intro}>
          Participants will always have the ability to turn off these
          permissions at any time.
        </MTBHeadingH3>
        <PFSection
          recorderType={'motion'}
          value={features?.motion}
          callbackFn={(e: boolean) => {
            onUpdate({ ...features, motion: e })
          }}
        ></PFSection>
        <PFSection
          recorderType={'backgroundNoise'}
          value={features?.backgroundNoise}
          callbackFn={(e: boolean) => {
            onUpdate({ ...features, backgroundNoise: e })
          }}
        ></PFSection>
        <PFSection
          recorderType={'weatherPollution'}
          value={features?.weatherPollution}
          callbackFn={(e: boolean) => {
            onUpdate({ ...features, weatherPollution: e })
          }}
        ></PFSection>
      </div>
      {children}
    </>
  )
}

export default PassiveFeatures
