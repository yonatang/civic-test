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
    }
}