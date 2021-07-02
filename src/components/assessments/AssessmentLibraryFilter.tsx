import {Checkbox, FormControlLabel, makeStyles, Paper} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {Assessment, StringDictionary} from '../../types/types'

type AssessmentLibraryFilterProps = {
  assessments: Assessment[]
  tags: StringDictionary<number>
  //selectedTags: string[]
  // onChangeDuration: Function
  onChangeTags: Function
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(5),
  },
}))

const AssessmentLibraryFilter: FunctionComponent<AssessmentLibraryFilterProps> = ({
  assessments,
  tags,
  onChangeTags,
}: //selectedTags
AssessmentLibraryFilterProps) => {
  const classes = useStyles()

  const getTotalCount = (tags: object): number =>
    Object.values(tags).reduce((a, c) => a + c, 0)

  /*const getAssessmentDurations = (): number[] =>
    assessments.map(a => a.duration || 0)*/
  const [selectedTags, setSelectedTags] = React.useState<string[]>([])

  const hasAnyTags = (assessment: Assessment, tags: string[]) => {
    const intersection = assessment.tags.filter(tag => tags.includes(tag))
    return intersection.length > 0
  }

  const getFilteredAssessments = (
    assessments: Assessment[],
    tags: string[]
  ) => {
    if (!tags.length) {
      return assessments
    } else {
      return assessments.filter(a => hasAnyTags(a, tags))
    }
  }

  const changeTags = (isChecked: boolean, tag: string) => {
    const result = isChecked
      ? [...selectedTags, tag]
      : selectedTags.filter(item => item !== tag)
    setSelectedTags(result)
    onChangeTags(getFilteredAssessments(assessments, result))
  }

  return (
    <Paper className={classes.root}>
      <FormControlLabel
        key="allConstructs"
        control={
          <Checkbox
            checked={selectedTags.length === 0}
            onChange={event => {
              if (event.target.checked) {
                setSelectedTags([])
                onChangeTags(getFilteredAssessments(assessments, []))
              }
            }}
            name="checkedB"
            color="primary"
          />
        }
        label={`All Construct Domains (${getTotalCount(tags)})`}
      />
      {Object.keys(tags).map(tag => (
        <FormControlLabel
          key={tag}
          control={
            <Checkbox
              checked={selectedTags.indexOf(tag) !== -1}
              onChange={event => changeTags(event.target.checked, tag)}
              name="checkedB"
              color="primary"
            />
          }
          //@ts-ignore
          label={`${tag} (${tags[tag]})`}
        />
      ))}
    </Paper>
  )
}

export default AssessmentLibraryFilter
