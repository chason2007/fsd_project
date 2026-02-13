import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const getIcon = () => {
        switch (theme) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'system': return 'System';
            default: return 'Light';
        }
    };

    const getLabel = () => {
        switch (theme) {
            case 'light': return 'Light';
            case 'dark': return 'Dark';
            case 'system': return 'System';
            default: return 'Light';
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            title={`Current theme: ${getLabel()}`}
            style={{
                fontSize: '1.2rem',
                padding: '0.4rem 0.8rem',
                border: '1px solid var(--pk-border)',
                background: 'var(--pk-surface)'
            }}
        >
            {getIcon()}
        </button>
    );
}

export default ThemeToggle;
