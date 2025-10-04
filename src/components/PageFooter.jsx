import {useDispatch, useSelector} from "react-redux";
import {actions, selectors} from "../redux/flashcardsSlice.js";

export function PageFooter() {
    const dispatch = useDispatch()
    const questionMode = useSelector(selectors.questionMode)
    const {toggleShowStarredOnly, switchQuestionMode} = actions
    const showStarredOnly = useSelector(selectors.showStarredOnly)

    const handleToggle = () => dispatch(toggleShowStarredOnly())
    const handleModeSwitch = () => {
        const newMode = questionMode === "q100" ? "q128" : "q100"
        dispatch(switchQuestionMode(newMode))
    }
    return <div style={{
        fontSize: '1.5rem',
        fontWeight: 700,
        color: '#1a237e',
        margin: '1rem 0',
        letterSpacing: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '0.5rem'
    }}>
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem'}}>
            <button
                className="button"
                style={{fontSize: '1rem', padding: '0.3rem 1rem'}}
                onClick={handleModeSwitch}
            >
                {questionMode === "q100" ? "Switch to 128 Questions" : "Switch to 100 Questions"}
            </button>
            <button
                className="button"
                style={{fontSize: '1rem', padding: '0.3rem 1rem'}}
                onClick={handleToggle}
            >
                {showStarredOnly ? "Show All" : "Show Only Starred"}
            </button>
        </div>
    </div>
}
