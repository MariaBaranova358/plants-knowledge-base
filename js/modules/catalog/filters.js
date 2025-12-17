import { getTypeDisplayName, matchPlantType, capitalizeFirst } from '../utils/helpers.js';

let selectedTypes = ['all'];
let selectedDifficulties = ['easy', 'medium', 'hard'];
let plantsData = [];
let updateCallback = null;

export function initializeFilters(data, callback) {
    plantsData = data;
    updateCallback = callback;
    
    setupTypeFilters();
    setupDifficultyFilters();
    setupFilterButtons();
}

function setupTypeFilters() {
    const typeItems = document.querySelectorAll('.dropdown-item[data-type]');
    const typeDropdown = document.getElementById('plantTypeDropdown');
    
    typeItems.forEach(item => {
        item.addEventListener('click', handleTypeClick);
    });
}

function handleTypeClick(e) {
    e.preventDefault();
    const type = e.currentTarget.getAttribute('data-type');
    
    if (type === 'all') {
        selectedTypes = ['all'];
        updateTypeDropdownText('Все типы');
    } else {
        if (selectedTypes.includes('all')) selectedTypes = [];
        
        if (selectedTypes.includes(type)) {
            selectedTypes = selectedTypes.filter(t => t !== type);
        } else {
            selectedTypes.push(type);
        }
        
        if (selectedTypes.length === 0) {
            selectedTypes = ['all'];
            updateTypeDropdownText('Все типы');
        } else {
            updateTypeDropdownText();
        }
    }
    
    updateSelectedTypesDisplay();
    applyFilters();
}

function updateTypeDropdownText(text = null) {
    const dropdown = document.getElementById('plantTypeDropdown');
    if (!dropdown) return;
    
    if (text) {
        dropdown.textContent = text;
    } else if (selectedTypes.length === 1) {
        dropdown.textContent = getTypeDisplayName(selectedTypes[0]);
    } else {
        dropdown.textContent = `Выбрано: ${selectedTypes.length}`;
    }
}

function setupDifficultyFilters() {
    ['easy', 'medium', 'hard'].forEach(difficulty => {
        const checkbox = document.getElementById(`filter${capitalizeFirst(difficulty)}`);
        if (checkbox) {
            checkbox.addEventListener('change', () => {
                updateDifficultyFilter(difficulty, checkbox.checked);
                applyFilters();
            });
        }
    });
}

function updateDifficultyFilter(difficulty, isChecked) {
    if (isChecked) {
        if (!selectedDifficulties.includes(difficulty)) {
            selectedDifficulties.push(difficulty);
        }
    } else {
        selectedDifficulties = selectedDifficulties.filter(d => d !== difficulty);
    }
    
    // Если ничего не выбрано - выбираем всё
    if (selectedDifficulties.length === 0) {
        selectedDifficulties = ['easy', 'medium', 'hard'];
        document.getElementById('filterEasy').checked = true;
        document.getElementById('filterMedium').checked = true;
        document.getElementById('filterHard').checked = true;
    }
}

function setupFilterButtons() {
    const applyBtn = document.getElementById('applyFilters');
    const resetBtn = document.getElementById('resetFilters');
    
    if (applyBtn) applyBtn.addEventListener('click', () => {
        applyFilters();
        closeFilterOffcanvas();
    });
    
    if (resetBtn) resetBtn.addEventListener('click', resetAllFilters);
}

function applyFilters() {
    if (!updateCallback) return;
    
    let filtered = [...plantsData];
    
    // Фильтрация по типу
    if (!selectedTypes.includes('all')) {
        filtered = filtered.filter(plant => {
            const plantType = plant.type || plant.category || '';
            return selectedTypes.some(type => 
                matchPlantType(plantType, type)
            );
        });
    }
    
    // Фильтрация по сложности
    filtered = filtered.filter(plant => 
        selectedDifficulties.includes(plant.difficulty)
    );
    
    updateCallback(filtered);
}

function updateSelectedTypesDisplay() {
    const container = document.getElementById('selectedTypes');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (selectedTypes.length > 0 && !selectedTypes.includes('all')) {
        selectedTypes.forEach(type => {
            const badge = document.createElement('span');
            badge.className = 'badge bg-light text-dark me-1 mb-1';
            badge.innerHTML = `${getTypeDisplayName(type)} <i class="bi bi-x ms-1" data-type="${type}"></i>`;
            container.appendChild(badge);
        });
        
        // Обработчики удаления типов
        container.querySelectorAll('.bi-x').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const typeToRemove = e.target.getAttribute('data-type');
                selectedTypes = selectedTypes.filter(t => t !== typeToRemove);
                
                updateTypeDropdownText();
                updateSelectedTypesDisplay();
                applyFilters();
            });
        });
    }
}

function resetAllFilters() {
    selectedTypes = ['all'];
    selectedDifficulties = ['easy', 'medium', 'hard'];
    
    // Сброс UI
    updateTypeDropdownText('Все типы');
    
    const container = document.getElementById('selectedTypes');
    if (container) container.innerHTML = '';
    
    // Сброс чекбоксов
    ['easy', 'medium', 'hard'].forEach(difficulty => {
        const checkbox = document.getElementById(`filter${capitalizeFirst(difficulty)}`);
        if (checkbox) checkbox.checked = true;
    });
    
    applyFilters();
    closeFilterOffcanvas();
}

function closeFilterOffcanvas() {
    const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('filterOffcanvas'));
    if (offcanvas) offcanvas.hide();
}