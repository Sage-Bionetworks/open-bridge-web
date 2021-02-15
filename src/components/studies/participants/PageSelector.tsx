import React from 'react'
import NextPageIcon from '../../../assets/ParticipantManagerPageSelector/next_page_icon.svg'
import PreviousPageIcon from '../../../assets/ParticipantManagerPageSelector/previous_page_icon.svg'
import BackToBeginningIcon from '../../../assets/ParticipantManagerPageSelector/back_to_beginning_icon.svg'
import ForwardToEndIcon from '../../../assets/ParticipantManagerPageSelector/forward_to_end_icon.svg'
import PageBox from './PageBox'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    color: 'black',
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5),
  },
}))

const PageSelector: React.FC<{
  onPageSelected: Function
  currentPageSelected: number
  numberOfPages: number
  handlePageNavigationArrowPressed: Function
}> = props => {
  const classes = useStyles()
  const pageNumbers = []
  for (let i = 1; i <= props.numberOfPages; i++) {
    pageNumbers.push(i)
  }
  return (
    <div className={classes.container}>
      <img
        onClick={() => props.handlePageNavigationArrowPressed('BB')}
        src={
          props.currentPageSelected == 1
            ? BackToBeginningIcon
            : ForwardToEndIcon
        }
        className={classes.image}
        alt="back_to_beginning_icon"
        style={{
          transform: props.currentPageSelected == 1 ? '' : 'rotate(180deg)',
        }}
      ></img>
      <img
        onClick={() => props.handlePageNavigationArrowPressed('B')}
        src={props.currentPageSelected == 1 ? PreviousPageIcon : NextPageIcon}
        className={classes.image}
        alt="back_icon"
        style={{
          transform: props.currentPageSelected == 1 ? '' : 'rotate(180deg)',
        }}
      ></img>
      {pageNumbers.map((element, index) => {
        return (
          <PageBox
            key={index}
            isSelected={element == props.currentPageSelected}
            pageNumber={element}
            onPageSelected={props.onPageSelected}
          />
        )
      })}
      <img
        onClick={() => props.handlePageNavigationArrowPressed('F')}
        src={
          props.currentPageSelected == props.numberOfPages
            ? PreviousPageIcon
            : NextPageIcon
        }
        className={classes.image}
        style={{
          transform:
            props.currentPageSelected == props.numberOfPages
              ? 'rotate(180deg)'
              : '',
        }}
      ></img>
      <img
        onClick={() => props.handlePageNavigationArrowPressed('FF')}
        src={
          props.currentPageSelected == props.numberOfPages
            ? BackToBeginningIcon
            : ForwardToEndIcon
        }
        className={classes.image}
        alt="forward_to_end_icon"
        style={{
          transform:
            props.currentPageSelected == props.numberOfPages
              ? 'rotate(180deg)'
              : '',
        }}
      ></img>
    </div>
  )
}

export default PageSelector
