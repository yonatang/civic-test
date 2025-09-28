import {useDispatch, useSelector} from "react-redux";
import {actions, selectors} from "../redux/flashcardsSlice.js";

export function PageHeader(){
    const showStarredOnly = useSelector(selectors.showStarredOnly)
    const dispatch = useDispatch()
    const {toggleShowStarredOnly} = actions

    const handleToggle = () => dispatch(toggleShowStarredOnly())

    return (
        <div style={{
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
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <span style={{marginRight: '0.5rem'}}>Test Flashcards</span>
                <span role="img" aria-label="USA">🇺🇸</span>
            </div>
            <button
                className="button"
                style={{fontSize: '1rem', padding: '0.3rem 1rem', marginTop: '0.5rem'}}
                onClick={handleToggle}
            >
                {showStarredOnly ? "Show All" : "Show Only Starred"}
            </button>
        </div>
    )
}