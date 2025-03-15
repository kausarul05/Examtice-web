
import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContaxt/ThemeContaxt';

const DarkAndLightMode = () => {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const handleToggle = () => {
        toggleTheme();
    };

    return (
        <div className={`dark_light_mode ${isDarkMode ? 'dark' : 'light'}`}>
            <span className='mode-label d-none d-md-block' onClick={handleToggle}>
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </span>
            <div className={`toggle-bar ${isDarkMode ? 'dark' : 'light'}`} onClick={handleToggle}>
                <div className='toggle-button'>
                    {isDarkMode ? '☀️' : '🌙'}
                </div>
            </div>
        </div>
    );
};

export default DarkAndLightMode;







