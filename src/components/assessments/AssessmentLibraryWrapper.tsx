import {DialogButtonSecondary} from '@components/widgets/StyledComponents'
import {Box, Container, makeStyles} from '@material-ui/core'
import React, {FunctionComponent, ReactNode} from 'react'
import {Assessment, StringDictionary} from '../../types/types'

type AssessmentLibraryWrapperOwnProps = {
  assessments: Assessment[]
  tags: StringDictionary<number>
  children: ReactNode[]
  onChangeTags: Function
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    /*paddingTop: theme.spacing(4),*/
    // margin: `0 ${theme.spacing(4)}px`,
    minWidth: '1000px',
    [theme.breakpoints.down('md')]: {
      minWidth: '750px',
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: '400px',
    },
    paddingTop: theme.spacing(3),
  },
  assessmentContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '600px',
    },
  },
  cardGrid: {
    //const cardWidth = 224
    display: 'grid',
    padding: theme.spacing(0),
    gridTemplateColumns: `repeat(auto-fill,224px)`,
    gridColumnGap: theme.spacing(2),
    justifyContent: 'center',
    gridRowGap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
      justifyContent: 'center',
      gridRowGap: theme.spacing(4),
    },
    //   style={{ maxWidth: `${(300 + 8) * 5}px`, margin: '0 auto' }}
  },
}))

type AssessmentLibraryWrapperProps = AssessmentLibraryWrapperOwnProps

const AssessmentLibraryWrapper: FunctionComponent<AssessmentLibraryWrapperProps> =
  ({
    children,
    tags,
    assessments,
    onChangeTags,
  }: AssessmentLibraryWrapperProps) => {
    const classes = useStyles()

    return (
      <Box className={classes.root}>
        {/* Filtering will not be present in the october release */}
        {/* <AssessmentLibraryFilter
        tags={tags}
        assessments={assessments}
        onChangeTags={(tags: string[]) => onChangeTags(tags)}
      /> */}
        <Container className={classes.assessmentContainer} maxWidth="xl">
          <DialogButtonSecondary variant="contained">
            DENO
          </DialogButtonSecondary>
          <Box className={classes.cardGrid}>{children}</Box>
        </Container>
      </Box>
    )
  }

export default AssessmentLibraryWrapper
