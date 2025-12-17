import { setupNavigation } from './navigation.js';

export function initializeApp() {
    console.log('Зелёный календарь загружен!');
    
    setupNavigation();
    setupGlobalListeners();
}

function setupGlobalListeners() {
    window.addEventListener('resize', handleResize);
}

