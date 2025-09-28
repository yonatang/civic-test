import {useDispatch, useSelector} from "react-redux";
import {actions, selectors} from "../redux/flashcardsSlice.js";
import "./CurrentCard.css";
import {List, ListItem} from "@mui/material"; // Import the CSS file for custom styles

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
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="16" cy="16" r="15" fill="#fff" stroke="#1976d2" strokeWidth="2"/>
                    <polygon
                        points="16,7 18.09,13.26 24.82,13.27 19.36,17.14 21.45,23.4 16,19.53 10.55,23.4 12.64,17.14 7.18,13.27 13.91,13.26"
                        fill={isStarred ? "#b71c1c" : "#fff"} stroke="#1976d2" strokeWidth="2"/>
                </svg>
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