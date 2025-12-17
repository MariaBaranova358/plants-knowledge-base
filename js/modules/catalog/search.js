import { debounce } from '../utils/helpers.js';

let searchCallback = null;

export function initializeSearch(callback) {
    searchCallback = callback;
    
    const searchInput = document.getElementById('plantSearch');
    if (!searchInput) return;
    
    // задержка 300ms
    const debouncedSearch = debounce(handleSearch, 300);
    searchInput.addEventListener('input', debouncedSearch);
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase().trim();
    if (searchCallback) {
        searchCallback(searchTerm);
    }
}