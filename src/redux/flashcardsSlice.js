import {createSlice} from '@reduxjs/toolkit'
import {questions as q100} from "../data/q100.js";
import {localDb} from "./localDb.js";

const initialMode = "q100"
const initialStarred = localDb.loadStarred(initialMode)
const isZeroStarred = initialStarred.indexOf(0) !== -1
const initialState = {
    questions: q100,
    questionMode: initialMode,
    currentQuestionIdx: 0,
    currentQuestion: {...q100[0], idx: 1, starred: isZeroStarred},
    starredQuestions: initialStarred,
    showStarredOnly: false,
    showAnswer: false
}

export const flashcardsSlice = createSlice({
    name: 'flashcardsSlice',
    initialState,
    reducers: {
        prevQuestion: (state, action) => {
            let currentIdx = state.currentQuestionIdx
            if (currentIdx === 0) {
                currentIdx = state.questions.length - 1
            } else {
                currentIdx--
            }
            state.showAnswer = false
            state.currentQuestionIdx = currentIdx
            let starred = state.starredQuestions.indexOf(currentIdx) !== -1
            state.currentQuestion = {...state.questions[currentIdx], idx: currentIdx + 1, starred}
        },
        nextQuestion: (state, action) => {
            let currentIdx = state.currentQuestionIdx
            if (currentIdx === state.questions.length - 1) {
                currentIdx = 0
            } else {
                currentIdx++
            }
            state.showAnswer = false
            state.currentQuestionIdx = currentIdx
            let starred = state.starredQuestions.indexOf(currentIdx) !== -1
            state.currentQuestion = {...state.questions[currentIdx], idx: currentIdx + 1, starred}
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

