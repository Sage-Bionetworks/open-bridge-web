import React, { FunctionComponent, useState, useEffect } from 'react'
import {
  match,
  RouteComponentProps,
  useParams,
  Link,
  Route,
} from 'react-router-dom'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import LoadingComponent from '../widgets/Loader'
import { useAsync } from '../../helpers/AsyncHook'

import {
  Grid,
  Paper,
  makeStyles,
  Hidden,
  Box,
  Container,
  Slider,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'
import clsx from 'clsx'

//import useAssessments from './../../helpers/hooks'
import { useSessionDataState } from '../../helpers/AuthContext'
import { Assessment, StringDictionary } from '../../types/types'
import AssessmentService from '../../services/assessment.service'
import AssessmentCard from './AssessmentCard'
import AssessmentDetail from './AssessmentDetail'
import AssessmentLibraryFilter from './AssessmentLibraryFilter'

type AssessmentLibraryOwnProps = {
  assessments?: Assessment[]
  tags?: string[]
}

const cardWidth = 300

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    /*backgroundColor: '#BCD5E4',
    paddingTop: theme.spacing(4),*/
    // margin: `0 ${theme.spacing(4)}px`,
  },
  cardLink: {
    textDecoration: 'none',
  },
  assessmentContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    // border: '1px solid black',

    [theme.breakpoints.down('sm')]: {
      maxWidth: '600px',
    },
  },
  cardGrid: {
    display: 'grid',
    padding: theme.spacing(0),
    gridTemplateColumns: `repeat(auto-fill,${cardWidth}px)`,
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

type AssessmentLibraryProps = AssessmentLibraryOwnProps & RouteComponentProps

const AssessmentLibrary: FunctionComponent<AssessmentLibraryProps> = ({
  match,
}: AssessmentLibraryProps) => {
  const classes = useStyles()

  const { token } = useSessionDataState()

  const handleError = useErrorHandler()
  const [filterTags, setFilterTags] = useState<string[]>([])

  const { data, status, error, run, setData } = useAsync<{
    assessments: Assessment[]
    tags: StringDictionary<number>
  }>({
    status: 'PENDING',
    data: null,
  })

  const hasAnyTags = (assessment: Assessment, tags: string[]) => {
    const intersection = assessment.tags.filter(tag => tags.includes(tag))
    return intersection.length > 0
  }

  const getFilteredAssessments = (
    assessments: Assessment[],
    tags: string[],
  ) => {
    if (!tags.length) {
      return assessments
    } else {
      return assessments.filter(a => hasAnyTags(a, tags))
    }
  }

  React.useEffect(() => {
    ///your async call
    return run(AssessmentService.getSharedAssessmentsWithResources())
  }, [run])
  if (status === 'PENDING') {
    return <>loading component here</>
  }
  if (status === 'REJECTED') {
    handleError(error!)
  }

  if (!data?.assessments || (!data?.tags && status === 'RESOLVED')) {
    return <>No Data </>
  }

  return (
    <Box className={classes.root}>
      <AssessmentLibraryFilter
        tags={data.tags}
        assessments={data.assessments}
        onChangeTags={(tags: string[]) => setFilterTags(tags)}
      />
      <Container
        className={classes.assessmentContainer}
        maxWidth="xl"
        style={{ textAlign: 'center' }}
      >
        <Box className={clsx(classes.cardGrid)}>
          {getFilteredAssessments(data.assessments, filterTags).map(
            (a, index) => (
              <Link to={`${match.url}/${a.guid}`} className={classes.cardLink}>
                <AssessmentCard
                  index={index}
                  assessment={a}
                  key={a.guid}
                ></AssessmentCard>
              </Link>
            ),
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default AssessmentLibrary
