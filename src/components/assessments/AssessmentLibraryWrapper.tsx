import {ReactComponent as DemoPhone} from '@assets/preview/demo_phone.svg'
import {WhiteButton} from '@components/widgets/StyledComponents'
import { Box, Container } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import {Assessment, StringDictionary} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent, ReactNode} from 'react'
import {NavLink} from 'react-router-dom'

type AssessmentLibraryWrapperProps = {
  assessments: Assessment[]
  tags: StringDictionary<number>
  children: ReactNode[]
  onChangeTags: Function
  isAssessmentLibrary?: boolean
  token?: string
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    '&$blue': {
      backgroundColor: '#BCD5E4',
    },
    /*paddingTop: theme.spacing(4),*/
    // margin: `0 ${theme.spacing(4)}`,
    minWidth: '1000px',
    [theme.breakpoints.down('lg')]: {
      minWidth: '750px',
    },
    [theme.breakpoints.down('md')]: {
      maxWidth: '400px',
    },
    paddingTop: theme.spacing(1),
  },
  blue: {},
  assessmentContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3),
      justifyContent: 'center',
      gridRowGap: theme.spacing(4),
    },
    //   style={{ maxWidth: `${(300 + 8) * 5}px`, margin: '0 auto' }}
  },
}))

const AssessmentLibraryWrapper: FunctionComponent<AssessmentLibraryWrapperProps> =
  ({
    children,
    isAssessmentLibrary = true,
    tags,
    assessments,
    onChangeTags,
    token,
  }: AssessmentLibraryWrapperProps) => {
    const classes = useStyles()

    return (
      <Box
        className={clsx(
          classes.root,
          !token && isAssessmentLibrary && classes.blue
        )}>
        {/* Filtering will not be present in the october release */}
        {/* <AssessmentLibraryFilter
        tags={tags}
        assessments={assessments}
        onChangeTags={(tags: string[]) => onChangeTags(tags)}
      /> */}
        <Container className={classes.assessmentContainer} maxWidth="xl">
          {isAssessmentLibrary && token && (
            <Box textAlign="right" mx={3.5} mb={6}>
              <NavLink
                to={'assessments/preview'}
                style={{textDecoration: 'none'}}>
                <WhiteButton variant="contained" style={{fontSize: '15px'}}>
                  <DemoPhone />
                  Demo all assessments
                </WhiteButton>
              </NavLink>
            </Box>
          )}
          <Box className={classes.cardGrid}>{children}</Box>
        </Container>
      </Box>
    )
  }

export default AssessmentLibraryWrapper
