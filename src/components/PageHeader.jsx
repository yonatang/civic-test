export function PageHeader() {
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
                <span role="img" aria-label="USA">🇺🇸</span>
                <span style={{marginRight: '0.5rem', marginLeft: '0.5rem'}}>Test Flashcards</span>
                <span role="img" aria-label="USA">🇺🇸</span>
            </div>
        </div>
    )
}