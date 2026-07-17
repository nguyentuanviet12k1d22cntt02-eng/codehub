export const getInitialTheme = (): 'light' | 'dark' => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    
    // Mặc định ban đầu là 'light' để giao diện sáng sủa dễ đọc theo yêu cầu của học viên
    return 'light'; 
};

export const applyTheme = (theme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
    } else {
        root.classList.add('light');
        root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
};
