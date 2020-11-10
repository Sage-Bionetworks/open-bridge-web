import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import { RouteComponentProps } from 'react-router-dom'
import StudyService from '../../services/study.service'
import { Study, StudyStatus } from '../../types/types'
import StudyCard from './StudyCard'
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { getRandomId } from '../../helpers/utility'

type StudyListOwnProps = {}

type StudySublistProps = {
  status: StudyStatus
  studies: Study[]
}

const studyCardWidth = '253'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    /*paddingTop: theme.spacing(4),*/
    // margin: `0 ${theme.spacing(4)}px`,
  },
  studyContainer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '600px',
    },
  },

  cardGrid: {
    //const cardWidth = 300
    display: 'grid',
    padding: theme.spacing(0),
    gridTemplateColumns: `repeat(auto-fill,${studyCardWidth}px)`,
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
  divider: {
    margin: `${theme.spacing(1)}px 0 ${theme.spacing(5)}px 0`,
  },

  filters: {
    listStyle: 'none',
    alignSelf: 'flex-end',
    margin: '0',
  },

  filterItem: {
    display: 'inline-block',
  },

  subtitle: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontSize: '1.4rem',
    textAlign: 'left',
  },
}))

const sections = [
  {
    status: 'DRAFT' as StudyStatus,
    title: 'Draft Studies',
    filterTitle: 'Draft',
  },
  {
    status: 'ACTIVE' as StudyStatus,
    title: 'Live Studies',
    filterTitle: 'Live',
  },
  {
    status: 'COMPLETED' as StudyStatus,
    title: 'Completed Studies',
    filterTitle: 'Completed',
  },
]

type StudyListProps = StudyListOwnProps & RouteComponentProps

const StudySublist: FunctionComponent<StudySublistProps> = ({
  studies,
  status,
}: StudySublistProps) => {
  const classes = useStyles()

  const item = sections.find(section => section.status === status)!
  return (
    <>
      <Typography variant="subtitle1" className={classes.subtitle}>
        {item.title}
      </Typography>
      <Box className={classes.cardGrid}>
        {studies
          .filter(study => study.status === status)
          .map(study => (
            <Link
            style={{textDecoration: 'none'}}
              key={study.identifier}
              variant="body2"
              href={`/studies/builder/${study.identifier}/session-creator`}
            >
              <StudyCard study={study}></StudyCard>
            </Link>
          ))}
      </Box>
    </>
  )
}

const StudyList: FunctionComponent<StudyListProps> = () => {
  const [studies, setStudies] = React.useState<Study[]>([])
  const classes = useStyles()
  const [statusFilters, setStatusFilters] = React.useState<StudyStatus[]>(
    sections.map(section => section.status),
  )

  const resetStatusFilters = () =>
    setStatusFilters(sections.map(section => section.status))


   const createStudy = async() => {
     const newStudy: Study = {identifier: getRandomId() ,  status: 'DRAFT' as StudyStatus, name : 'Untitled'}
    setStudies([...studies, newStudy])
   const x = await StudyService.saveStudy(newStudy)
   setStudies(x)
  }

  const isSelectedFilter = (filter: StudyStatus) =>
    statusFilters.indexOf(filter) > -1 && statusFilters.length === 1

  useEffect(() => {
    let isSubscribed = true
    const getInfo = async () => {
      if (isSubscribed) {
        try {
          //setIsLoading(true)

          const studies = await StudyService.getStudies()

          if (isSubscribed) {
            setStudies(studies)
          }
        } catch (e) {
          // isSubscribed && setError(e)
        } finally {
          // isSubscribed && setIsLoading(false)
        }
      }
    }

    getInfo()

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <Container maxWidth="xl" className={classes.studyContainer}>
      <Box display="flex" justifyContent="space-between">
        <ul className={classes.filters} aria-label="filters">
          <li className={classes.filterItem}>View by:</li>
          <li className={classes.filterItem}>
            <Button
              onClick={resetStatusFilters}
              style={{ color: statusFilters.length > 1 ? 'red' : 'inherit' }}
            >
              All
            </Button>
          </li>
          {sections.map(section => (
            <li className={classes.filterItem}>
              <Button
                onClick={() => setStatusFilters([section.status])}
                style={{
                  color: isSelectedFilter(section.status) ? 'red' : 'inherit',
                }}
              >
                {section.filterTitle}
              </Button>
            </li>
          ))}
        </ul>
        <Button variant="contained" onClick={()=>createStudy()}>+ Create a Study</Button>
      </Box>
      <Divider className={classes.divider}></Divider>
      {statusFilters.map((status, index) => (
        <>
          <StudySublist studies={studies} status={status} />
          {index < 2 && <Divider className={classes.divider}></Divider>}
        </>
      ))}
    </Container>
  )
}

export default StudyList
