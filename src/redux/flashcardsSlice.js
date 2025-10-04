import {createSlice} from '@reduxjs/toolkit'
import {questions as q100} from "../data/q100.js";
import {questions as q128} from "../data/q128.js";
import {localDb} from "./localDb.js";

const questionSets = {
    q100: q100,
    q128: q128
}

const initialMode = "q100"
const initialQuestions = questionSets[initialMode]
const initialStarred = localDb.loadStarred(initialMode)
const initialIdx = localDb.loadIndex(initialMode, initialQuestions.length)
const isZeroStarred = initialStarred.indexOf(initialIdx) !== -1
const initialState = {
    questions: initialQuestions,
    questionMode: initialMode,
    currentQuestionIdx: initialIdx,
    currentQuestion: {...initialQuestions[initialIdx], idx: initialIdx + 1, starred: isZeroStarred},
    starredQuestions: initialStarred,
    showStarredOnly: false,
    showAnswer: false
}

export const flashcardsSlice = createSlice({
    name: 'flashcardsSlice',
    initialState,
    reducers: {
        switchQuestionMode: (state, action) => {
            const newMode = action.payload;
            if (newMode !== state.questionMode) {
                // Switch to new question set
                state.questionMode = newMode;
                state.questions = questionSets[newMode];

                // Load saved data for new mode
                state.starredQuestions = localDb.loadStarred(newMode);
                state.currentQuestionIdx = 0; // Start from first question
                state.showStarredOnly = false; // Reset starred filter

                // Update current question
                const isStarred = state.starredQuestions.indexOf(0) !== -1;
                state.currentQuestion = {
                    ...state.questions[0],
                    idx: 1,
                    starred: isStarred
                };

                // Save the new index
                localDb.storeIndex(0, newMode);
                state.showAnswer = false;
            }
        },
        toggleShowStarredOnly: (state, action) => {
            state.showStarredOnly = !state.showStarredOnly;
            // When toggling, reset to first starred or first question
            if (state.showStarredOnly) {
                if (state.starredQuestions.length > 0) {
                    const idx = state.starredQuestions[0];
                    state.currentQuestionIdx = idx;
                    state.currentQuestion = {
                        ...state.questions[idx],
                        idx: idx + 1,
                        starred: true
                    };
                }
            } else {
                state.currentQuestionIdx = 0;
                let starred = state.starredQuestions.indexOf(0) !== -1;
                state.currentQuestion = {
                    ...state.questions[0],
                    idx: 1,
                    starred
                };
            }
            state.showAnswer = false;
        },
        prevQuestion: (state, action) => {
            if (state.showStarredOnly) {
                const starred = state.starredQuestions;
                if (starred.length === 0) return;
                let idx = starred.indexOf(state.currentQuestionIdx);
                idx = idx === 0 ? starred.length - 1 : idx - 1;
                const newIdx = starred[idx];
                state.currentQuestionIdx = newIdx;
                state.currentQuestion = {
                    ...state.questions[newIdx],
                    idx: newIdx + 1,
                    starred: true
                };
            } else {
                let currentIdx = state.currentQuestionIdx;
                if (currentIdx === 0) {
                    currentIdx = state.questions.length - 1;
                } else {
                    currentIdx--;
                }
                state.currentQuestionIdx = currentIdx;
                let starred = state.starredQuestions.indexOf(currentIdx) !== -1;
                state.currentQuestion = {
                    ...state.questions[currentIdx],
                    idx: currentIdx + 1,
                    starred
                };
            }
            localDb.storeIndex(state.currentQuestionIdx, state.questionMode)
            state.showAnswer = false;
        },
        nextQuestion: (state, action) => {
            if (state.showStarredOnly) {
                const starred = state.starredQuestions;
                if (starred.length === 0) return;
                let idx = starred.indexOf(state.currentQuestionIdx);
                idx = idx === starred.length - 1 ? 0 : idx + 1;
                const newIdx = starred[idx];
                state.currentQuestionIdx = newIdx;
                state.currentQuestion = {
                    ...state.questions[newIdx],
                    idx: newIdx + 1,
                    starred: true
                };
            } else {
                let currentIdx = state.currentQuestionIdx;
                if (currentIdx === state.questions.length - 1) {
                    currentIdx = 0;
                } else {
                    currentIdx++;
                }
                state.currentQuestionIdx = currentIdx;
                let starred = state.starredQuestions.indexOf(currentIdx) !== -1;
                state.currentQuestion = {
                    ...state.questions[currentIdx],
                    idx: currentIdx + 1,
                    starred
                };
            }
            localDb.storeIndex(state.currentQuestionIdx, state.questionMode)
            state.showAnswer = false;
        },
        startQuestion: (state, action) => {
            let currentIdx = state.currentQuestionIdx
            let starred = [...state.starredQuestions]
            let starState
            if (starred.indexOf(currentIdx) !== -1) {
                starred = starred.filter(idx => idx !== currentIdx)
                starState = false
            } else {
                starred = [...starred, currentIdx]
                starred.sort()
                starState = true
            }
            state.starredQuestions = starred
            localDb.storeStarred(starred, state.questionMode)
            state.currentQuestion = {...state.currentQuestion, starred: starState}
        },
        toggleShowAnswer: (state, action) => {
            state.showAnswer = !state.showAnswer
        }
    }
})

export const actions = {
    ...flashcardsSlice.actions
}

export const selectors = {
    questions: state => state.flashcards.questions,
    questionMode: state => state.flashcards.questionMode,
    staredQuestions: state => state.flashcards.staredQuestions,
    currentQuestion: state => state.flashcards.currentQuestion,
    showStarredOnly: state => state.flashcards.showStarredOnly,
    showAnswer: state => state.flashcards.showAnswer,
}
export default flashcardsSlice.reducer
