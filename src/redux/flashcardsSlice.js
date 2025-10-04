import {createSlice} from '@reduxjs/toolkit'
import {questions as q100} from "../data/q100.js";
import {questions as q128} from "../data/q128.js";
import {localDb} from "./localDb.js";

const questionSets = {
    q100: q100,
    q128: q128
}

// Utility function to shuffle array with consistent seed
const shuffleArray = (array, seed) => {
    const shuffled = [...array]
    let random = seed
    for (let i = shuffled.length - 1; i > 0; i--) {
        random = (random * 9301 + 49297) % 233280
        const j = Math.floor((random / 233280) * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

// Generate random sequences for both all questions and starred questions
const generateRandomSequences = (mode, questions, starred) => {
    const seed = Date.now() // Use current time as seed for true randomness
    const allIndices = Array.from({length: questions.length}, (_, i) => i)
    const randomAll = shuffleArray(allIndices, seed)
    const randomStarred = starred.length > 0 ? shuffleArray(starred, seed + 1) : []

    localDb.storeRandomSequence(randomAll, mode, 'all')
    localDb.storeRandomSequence(randomStarred, mode, 'starred')

    return { randomAll, randomStarred }
}

const initialMode = localDb.loadMode()
const initialQuestions = questionSets[initialMode]
const initialStarred = localDb.loadStarred(initialMode)
const initialRandomOrder = localDb.loadRandomOrder()
const initialIdx = localDb.loadIndex(initialMode, initialQuestions.length)
const isZeroStarred = initialStarred.indexOf(initialIdx) !== -1

// Load or generate random sequences
let randomAllSequence = localDb.loadRandomSequence(initialMode, 'all')
let randomStarredSequence = localDb.loadRandomSequence(initialMode, 'starred')

if (!randomAllSequence || randomAllSequence.length !== initialQuestions.length) {
    const sequences = generateRandomSequences(initialMode, initialQuestions, initialStarred)
    randomAllSequence = sequences.randomAll
    randomStarredSequence = sequences.randomStarred
}

const initialState = {
    questions: initialQuestions,
    questionMode: initialMode,
    currentQuestionIdx: initialIdx,
    currentQuestion: {...initialQuestions[initialIdx], idx: initialIdx + 1, starred: isZeroStarred},
    starredQuestions: initialStarred,
    showStarredOnly: false,
    showAnswer: false,
    randomOrder: initialRandomOrder,
    randomAllSequence: randomAllSequence,
    randomStarredSequence: randomStarredSequence
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

                // Save the new mode to localStorage
                localDb.storeMode(newMode);

                // Load saved data for new mode
                state.starredQuestions = localDb.loadStarred(newMode);
                state.currentQuestionIdx = localDb.loadIndex(newMode, questionSets[newMode].length);
                state.showStarredOnly = false; // Reset starred filter

                // Load or generate random sequences for new mode
                let randomAll = localDb.loadRandomSequence(newMode, 'all')
                let randomStarred = localDb.loadRandomSequence(newMode, 'starred')

                if (!randomAll || randomAll.length !== state.questions.length) {
                    const sequences = generateRandomSequences(newMode, state.questions, state.starredQuestions)
                    randomAll = sequences.randomAll
                    randomStarred = sequences.randomStarred
                }

                state.randomAllSequence = randomAll
                state.randomStarredSequence = randomStarred

                // Update current question
                const isStarred = state.starredQuestions.indexOf(state.currentQuestionIdx) !== -1;
                state.currentQuestion = {
                    ...state.questions[state.currentQuestionIdx],
                    idx: state.currentQuestionIdx + 1,
                    starred: isStarred
                };

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
            if (state.randomOrder) {
                // Random order navigation
                if (state.showStarredOnly) {
                    const sequence = state.randomStarredSequence;
                    if (sequence.length === 0) return;
                    let idx = sequence.indexOf(state.currentQuestionIdx);
                    idx = idx === 0 ? sequence.length - 1 : idx - 1;
                    const newIdx = sequence[idx];
                    state.currentQuestionIdx = newIdx;
                    state.currentQuestion = {
                        ...state.questions[newIdx],
                        idx: newIdx + 1,
                        starred: true
                    };
                } else {
                    const sequence = state.randomAllSequence;
                    let idx = sequence.indexOf(state.currentQuestionIdx);
                    idx = idx === 0 ? sequence.length - 1 : idx - 1;
                    const newIdx = sequence[idx];
                    state.currentQuestionIdx = newIdx;
                    let starred = state.starredQuestions.indexOf(newIdx) !== -1;
                    state.currentQuestion = {
                        ...state.questions[newIdx],
                        idx: newIdx + 1,
                        starred
                    };
                }
            } else {
                // Sequential order navigation
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
            }
            localDb.storeIndex(state.currentQuestionIdx, state.questionMode)
            state.showAnswer = false;
        },
        nextQuestion: (state, action) => {
            if (state.randomOrder) {
                // Random order navigation
                if (state.showStarredOnly) {
                    const sequence = state.randomStarredSequence;
                    if (sequence.length === 0) return;
                    let idx = sequence.indexOf(state.currentQuestionIdx);
                    idx = idx === sequence.length - 1 ? 0 : idx + 1;
                    const newIdx = sequence[idx];
                    state.currentQuestionIdx = newIdx;
                    state.currentQuestion = {
                        ...state.questions[newIdx],
                        idx: newIdx + 1,
                        starred: true
                    };
                } else {
                    const sequence = state.randomAllSequence;
                    let idx = sequence.indexOf(state.currentQuestionIdx);
                    idx = idx === sequence.length - 1 ? 0 : idx + 1;
                    const newIdx = sequence[idx];
                    state.currentQuestionIdx = newIdx;
                    let starred = state.starredQuestions.indexOf(newIdx) !== -1;
                    state.currentQuestion = {
                        ...state.questions[newIdx],
                        idx: newIdx + 1,
                        starred
                    };
                }
            } else {
                // Sequential order navigation
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

            // Regenerate starred sequence for random order
            if (starred.length > 0) {
                const sequences = generateRandomSequences(state.questionMode, state.questions, starred)
                state.randomStarredSequence = sequences.randomStarred
            } else {
                state.randomStarredSequence = []
                localDb.storeRandomSequence([], state.questionMode, 'starred')
            }
        },
        toggleRandomOrder: (state, action) => {
            state.randomOrder = !state.randomOrder
            localDb.storeRandomOrder(state.randomOrder)

            // Generate new random sequences when enabling random order
            if (state.randomOrder) {
                const sequences = generateRandomSequences(state.questionMode, state.questions, state.starredQuestions)
                state.randomAllSequence = sequences.randomAll
                state.randomStarredSequence = sequences.randomStarred
            }
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
    randomOrder: state => state.flashcards.randomOrder,
}
export default flashcardsSlice.reducer
