import { fetchPlantsData } from '../utils/api.js';
import { PLANTS_PER_PAGE } from '../utils/constants.js';
import { initializeFilters } from './filters.js';
import { initializeSearch } from './search.js';
import { initializePagination, updatePagination } from './pagination.js'; // Добавлено
import { renderPlants } from './render.js';

let plantsData = [];
let currentPlants = [];
let currentPage = 1;

export function initializeCatalog() {
    console.log('Инициализация каталога...');
    
    if (!document.getElementById('plantsGrid')) {
        console.log('Каталог не найден на этой странице');
        return;
    }
    
    loadCatalogData();
}

async function loadCatalogData() {
    try {
        plantsData = await fetchPlantsData();
        currentPlants = [...plantsData];
        
        setupCatalog();
    } catch (error) {
        showCatalogError();
    }
}

function setupCatalog() {
    // Передаем колбэки для обновления
    initializeFilters(plantsData, handleFiltersUpdate);
    initializeSearch(handleSearch);
    initializePagination(handlePagination, () => currentPlants.length); // Добавлен второй параметр
    
    updateCatalog();
}

function handleFiltersUpdate(filteredPlants) {
    currentPlants = filteredPlants;
    currentPage = 1;
    updateCatalog();
    updatePagination(currentPlants.length); // Добавлено
}

function handleSearch(searchTerm) {
    if (!searchTerm) {
        currentPlants = [...plantsData];
    } else {
        currentPlants = plantsData.filter(plant =>
            plant.name.toLowerCase().includes(searchTerm) ||
            (plant.latin && plant.latin.toLowerCase().includes(searchTerm))
        );
    }
    
    currentPage = 1;
    updateCatalog();
    updatePagination(currentPlants.length); // Добавлено
}

function handlePagination(page) {
    currentPage = page;
    updateCatalog();
    
    document.querySelector('.catalog-grid')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start' 
    });
}

function updateCatalog() {
    const plantsToShow = getCurrentPagePlants();
    renderPlants(plantsToShow);
    updatePlantCount();
}

function getCurrentPagePlants() {
    const startIndex = (currentPage - 1) * PLANTS_PER_PAGE;
    const endIndex = startIndex + PLANTS_PER_PAGE;
    return currentPlants.slice(startIndex, endIndex);
}

function updatePlantCount() {
    const countElement = document.querySelector('.plants-count') || createCountElement();
    if (countElement) {
        countElement.innerHTML = `
            <i class="bi bi-flower1 me-1"></i>
            Найдено растений: <span class="fw-bold">${currentPlants.length}</span>
        `;
    }
}

function createCountElement() {
    const header = document.querySelector('.catalog-header .lead');
    if (!header) return null;
    
    const countDiv = document.createElement('div');
    countDiv.className = 'plants-count mt-2';
    header.after(countDiv);
    return countDiv;
}

function showCatalogError() {
    const plantsGrid = document.getElementById('plantsGrid');
    if (plantsGrid) {
        plantsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-emoji-frown display-1 text-muted mb-3"></i>
                <h3 class="mb-3">Ошибка загрузки данных</h3>
                <p class="text-muted">Попробуйте обновить страницу</p>
            </div>
        `;
    }
}

export { getCurrentPagePlants, updateCatalog };