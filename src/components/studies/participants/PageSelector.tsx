import React from 'react'
import NextPageIcon from '../../../assets/ParticipantManagerPageSelector/next_page_icon.svg'
import PreviousPageIcon from '../../../assets/ParticipantManagerPageSelector/previous_page_icon.svg'
import BackToBeginningIcon from '../../../assets/ParticipantManagerPageSelector/back_to_beginning_icon.svg'
import ForwardToEndIcon from '../../../assets/ParticipantManagerPageSelector/forward_to_end_icon.svg'
import PageBox from './PageBox'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  image: {
    width: '10px',
    height: '10px',
  },
  button: {
    width: '10px',
    minWidth: '5px',
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
      <Button
        onClick={() => props.handlePageNavigationArrowPressed('BB')}
        classes={{ root: classes.button }}
        disabled={props.currentPageSelected == 1}
      >
        <img
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
      </Button>
      <Button
        onClick={() => props.handlePageNavigationArrowPressed('B')}
        classes={{ root: classes.button }}
        disabled={props.currentPageSelected == 1}
      >
        <img
          src={props.currentPageSelected == 1 ? PreviousPageIcon : NextPageIcon}
          className={classes.image}
          alt="back_icon"
          style={{
            transform: props.currentPageSelected == 1 ? '' : 'rotate(180deg)',
          }}
        ></img>
      </Button>
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

      <Button
        onClick={() => props.handlePageNavigationArrowPressed('F')}
        classes={{ root: classes.button }}
        disabled={props.currentPageSelected == props.numberOfPages}
      >
        <img
          src={
            props.currentPageSelected == props.numberOfPages
              ? PreviousPageIcon
              : NextPageIcon
          }
          className={classes.image}
          alt="previous_page_icon"
          style={{
            transform:
              props.currentPageSelected == props.numberOfPages
                ? 'rotate(180deg)'
                : '',
          }}
        ></img>
      </Button>
      <Button
        onClick={() => props.handlePageNavigationArrowPressed('FF')}
        classes={{ root: classes.button }}
        disabled={props.currentPageSelected == props.numberOfPages}
      >
        <img
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
      </Button>
    </div>
  )
}

export default PageSelector
