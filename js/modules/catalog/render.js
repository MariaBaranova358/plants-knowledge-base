import { DIFFICULTY_MAP } from '../utils/constants.js';
import { getTypeDisplayName } from '../utils/helpers.js';

export function renderPlants(plants) {
    const plantsGrid = document.getElementById('plantsGrid');
    if (!plantsGrid) return;
    
    plantsGrid.innerHTML = '';
    
    if (plants.length === 0) {
        showNoResults();
        return;
    }
    
    plants.forEach(plant => {
        const plantCard = createPlantCard(plant);
        plantsGrid.appendChild(plantCard);
    });
}

function createPlantCard(plant) {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4 mb-4';
    
    const difficulty = DIFFICULTY_MAP[plant.difficulty] || DIFFICULTY_MAP.easy;
    const imageUrl = plant.images && plant.images[0] 
        ? plant.images[0] 
        : 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    
    const plantType = getTypeDisplayName(plant.type || plant.category || 'Комнатное');
    
    col.innerHTML = `
        <div class="plant-card" data-id="${plant.id}">
            <div class="plant-image-container">
                <img src="${imageUrl}" 
                     alt="${plant.name}" 
                     class="plant-image-main"
                     loading="lazy">
                <div class="plant-overlay"></div>
            </div>
            
            <div class="plant-info-card">
                <h3 class="plant-name">${plant.name}</h3>
                <p class="plant-latin-name">${plant.latin || ''}</p>
                
                <div class="plant-meta">
                    <div class="meta-row">
                        <span class="meta-label">Сложность ухода:</span>
                        <span class="difficulty-badge ${difficulty.class}">
                            ${difficulty.text}
                        </span>
                    </div>
                    
                    <div class="meta-row">
                        <span class="meta-label">Тип растения:</span>
                        <span class="plant-type-badge">
                            ${plantType}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="plant-actions">
                <a href="plant.html?id=${plant.id}&slug=${plant.slug}" 
                   class="btn btn-outline-success view-plant">
                    Подробнее
                </a>
            </div>
        </div>
    `;
    
    return col;
}

function showNoResults() {
    const plantsGrid = document.getElementById('plantsGrid');
    plantsGrid.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="bi bi-emoji-frown display-1 text-muted mb-3"></i>
            <h3 class="mb-3">Растения не найдены</h3>
            <p class="text-muted mb-4">Попробуйте изменить параметры поиска или фильтры</p>
            <button class="btn btn-success" id="resetAllFiltersBtn">
                Сбросить все фильтры
            </button>
        </div>
    `;
    
    document.getElementById('resetAllFiltersBtn')?.addEventListener('click', () => {
        window.location.reload();
    });
}