import { fetchPlantById } from '../utils/api.js';
import { calculateWaterSchedule } from './calculator.js';

export function initializePlantPage() {
    console.log('Инициализация страницы растения...');

    const urlParams = new URLSearchParams(window.location.search);
    const plantId = parseInt(urlParams.get('id')) || 1;

    loadPlantData(plantId);
    setupModalListeners();
}

async function loadPlantData(plantId) {
    try {
        const plant = await fetchPlantById(plantId);
        if (plant) {
            renderPlantPage(plant);
        } else {
            showError('Растение не найдено');
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showError('Ошибка загрузки данных');
    }
}

function renderPlantPage(plant) {
    const plantPage = document.getElementById('plantPage');
    if (!plantPage) return;

    plantPage.innerHTML = `
        <div class="container pt-4">
            <button class="back-button" onclick="window.history.back()">
                <i class="bi bi-arrow-left"></i> Назад к каталогу
            </button>
        </div>
        
        <div class="container py-4">
            <div class="row">
                <div class="col-lg-6 mb-4">
                    <img src="${plant.image || plant.images[0]}" 
                         alt="${plant.name}" 
                         class="plant-image">
                </div>
                
                <div class="col-lg-6">
                    <div class="plant-info">
                        <h1 class="plant-name">${plant.name}</h1>
                        <p class="plant-latin">${plant.latin || ''}</p>
                        
                        <div class="plant-description">
                            ${plant.description || 'Описание растения будет добавлено позже.'}
                        </div>
                        
                        <!-- Добавляем отображение категории -->
                        ${plant.category ? `<div class="plant-category">
                            <strong>Категория:</strong> ${plant.category}
                        </div>` : ''}
                        
                        <table class="conditions-table">
                            <tr>
                                <td>Освещение:</td>
                                <td>${plant.conditions?.light || plant.light || 'Яркий рассеянный свет'}</td>
                            </tr>
                            <tr>
                                <td>Грунт:</td>
                                <td>${plant.conditions?.soil || plant.soil || 'Лёгкий, питательный и рыхлый грунт'}</td>
                            </tr>
                            <tr>
                                <td>Влажность:</td>
                                <td>${plant.conditions?.humidity || plant.humidity || 'Высокая'}</td>
                            </tr>
                            <tr>
                                <td>Температура:</td>
                                <td>${plant.conditions?.temperature || plant.temperature || 'Лето-весна: +20...+25°C, Зима: +16...+18°C'}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <div class="care-section">
                        <h3 class="section-title">Рекомендации по уходу</h3>
                        <ul class="care-list">
                            ${generateCareTips(plant)}
                        </ul>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12 text-center">
                    <button class="btn btn-success calculate-btn" 
                            data-bs-toggle="modal" 
                            data-bs-target="#waterModal">
                        Рассчитать график полива
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateCareTips(plant) {
    const tips = plant.careTips || [
        'Не бойтесь воздушных корней. Не обрезайте их! Направляйте их в горшок к земле или к опоре.',
        'Регулярно поворачивайте горшок относительно источника света, чтобы растение развивалось симметрично.',
        'Крупные листья — пылесборники. Регулярное протирание не только для красоты, но и для здоровья растения.',
        'Не допускайте застоя воды в поддоне — это верный путь к корневой гнили.',
        'Не ставьте растение в проходе, где его большие листья могут постоянно задевать и травмировать.'
    ];

    return tips.map(tip => `
        <li class="care-item">
            <i class="bi bi-check-circle"></i>
            <span>${tip}</span>
        </li>
    `).join('');
}

function setupModalListeners() {
    const calculateBtn = document.getElementById('calculateWater');
    if (!calculateBtn) return;

    calculateBtn.addEventListener('click', async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const plantId = parseInt(urlParams.get('id')) || 1;

        // Получаем растение, чтобы извлечь категорию
        try {
            const plant = await fetchPlantById(plantId);
            const category = plant.category || 'Декоративнолистные'; // Убедитесь, что в данных растений есть поле category
            
            const potSize = document.getElementById('potSize')?.value || 'medium';
            const season = document.getElementById('season')?.value || 'summer';
            const lighting = document.getElementById('lighting')?.value || 'medium';

            // Теперь передаем категорию, а не plantId
            const result = calculateWaterSchedule(category, potSize, season, lighting);

            const frequencyResult = document.getElementById('frequencyResult');
            const volumeResult = document.getElementById('volumeResult');
            const resultContainer = document.getElementById('calculationResult');

            if (frequencyResult) frequencyResult.textContent = result.frequency;
            if (volumeResult) volumeResult.textContent = result.volume;

            if (resultContainer) {
                resultContainer.classList.remove('d-none');
                resultContainer.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        } catch (error) {
            console.error('Ошибка при расчете графика полива:', error);
            // В случае ошибки показываем сообщение
            const resultContainer = document.getElementById('calculationResult');
            if (resultContainer) {
                resultContainer.innerHTML = `
                    <div class="alert alert-warning border-0 bg-light">
                        <h6 class="fw-bold mb-2">Ошибка расчета</h6>
                        <p class="mb-0">Не удалось рассчитать график полива. Попробуйте еще раз.</p>
                    </div>
                `;
                resultContainer.classList.remove('d-none');
            }
        }
    });
}

function showError(message) {
    const plantPage = document.getElementById('plantPage');
    if (plantPage) {
        plantPage.innerHTML = `
            <div class="container py-5 mt-5">
                <div class="text-center">
                    <i class="bi bi-emoji-frown display-1 text-muted mb-3"></i>
                    <h2 class="mb-3">${message}</h2>
                    <p class="mb-4">Попробуйте вернуться в каталог и выбрать другое растение</p>
                    <a href="catalog.html" class="btn btn-success">
                        <i class="bi bi-arrow-left me-2"></i>Вернуться в каталог
                    </a>
                </div>
            </div>
        `;
    }
}