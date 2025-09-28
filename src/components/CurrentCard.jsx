import {useDispatch, useSelector} from "react-redux";
import {actions, selectors} from "../redux/flashcardsSlice.js";
import "./CurrentCard.css";
import {List, ListItem} from "@mui/material"; // Import the CSS file for custom styles
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export function CurrentCard() {
    const questions = useSelector(selectors.questions)
    const currentQuestion = useSelector(selectors.currentQuestion)
    const showAnswer = useSelector(selectors.showAnswer)
    const dispatch = useDispatch()
    const {toggleShowAnswer, prevQuestion, nextQuestion, startQuestion} = actions

    const handlePrev = () => dispatch(prevQuestion())
    const handleNext = () => dispatch(nextQuestion())
    const handleShow = () => dispatch(toggleShowAnswer())
    const handleStar = () => dispatch(startQuestion())

    const isStarred = currentQuestion?.starred
    const section = currentQuestion?.section || ''
    const subsection = currentQuestion?.subsection || ''
    const answers = currentQuestion?.answer?.map((item, index) => <ListItem key={index}>{item}</ListItem>)

    return <>
        <div className="card">
            <div className="card-star" onClick={handleStar} title={isStarred ? "Unstar" : "Star"}>
                {isStarred ?
                    <StarIcon color="error"/> :
                    <StarBorderIcon/>
                }
            </div>
            {(section || subsection) && (
                <div className="card-meta">
                    <span className="card-section">{section}</span>
                    {section && subsection && <span className="card-meta-sep"> &middot; </span>}
                    <span className="card-subsection">{subsection}</span>
                </div>
            )}
            <div className="card-header">
                <span role="img" aria-label="USA">🇺🇸</span> Question #{currentQuestion.idx} / {questions.length}
            </div>
            <div className="card-question">
                {currentQuestion?.question}
            </div>
            {showAnswer &&
                <div className="card-answer">
                    <List>
                        {answers}
                    </List>
                </div>
            }
            <div className="card-actions">
                <div className="left">
                    <button className="button" onClick={handlePrev}>Prev</button>
                </div>
                <div className="center">
                    <button className="button" onClick={handleShow}>Show</button>
                </div>
                <div className="right">
                    <button className="button" onClick={handleNext}>Next</button>
                </div>
            </div>
        </div>
    </>
}