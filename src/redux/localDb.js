export const localDb = {
    storeStarred: (starred, mode) => {
        localStorage.setItem(`starredQuestions-${mode}`, JSON.stringify(starred))
    },
    loadStarred: (mode) => {
        let starred = localStorage.getItem(`starredQuestions-${mode}`)
        if (starred) {
            try {
                return JSON.parse(starred)
            } catch (e) {
            }
        }
        return []
    },
    loadIndex: (mode, maxIndex) => {
        let idx = localStorage.getItem(`currentQuestionIdx-${mode}`)
        if (idx) {
            idx = parseInt(idx)
            if (!isNaN(idx) && idx >= 0 && idx < maxIndex) {
                return idx
            }
        }
        return 0
    },
    storeIndex: (index, mode) => {
        localStorage.setItem(`currentQuestionIdx-${mode}`, index.toString())
    },
    storeMode: (mode) => {
        localStorage.setItem('questionMode', mode)
    },
    loadMode: () => {
        const mode = localStorage.getItem('questionMode')
        if (mode === 'q100' || mode === 'q128') {
            return mode
        }
        return 'q100' // default fallback
    }
}