// js/modules/catalog/pagination.js
import { PLANTS_PER_PAGE } from '../utils/constants.js';

let currentPage = 1;
let totalPages = 1;
let paginationCallback = null;
let getPlantsCountCallback = null; // Новый колбэк для получения количества

/**
 * Инициализация пагинации
 */
export function initializePagination(callback, plantsCountCallback = null) {
    paginationCallback = callback;
    getPlantsCountCallback = plantsCountCallback;
    
    updatePagination();
}

/**
 * Обновление пагинации
 */
export function updatePagination(plantsCount = null) {
    // Получаем количество растений
    if (plantsCount !== null) {
        totalPages = Math.ceil(plantsCount / PLANTS_PER_PAGE);
    } else if (getPlantsCountCallback) {
        totalPages = Math.ceil(getPlantsCountCallback() / PLANTS_PER_PAGE);
    } else {
        totalPages = 1;
    }
    
    const container = document.querySelector('.pagination');
    if (!container) {
        console.warn('Контейнер пагинации не найден');
        return;
    }
    
    if (totalPages <= 1) {
        container.parentElement.style.display = 'none';
        return;
    }
    
    container.parentElement.style.display = 'flex';
    container.parentElement.style.justifyContent = 'center';
    container.innerHTML = generatePaginationHTML();
    setupPaginationListeners();
}

function generatePaginationHTML() {
    let html = '';
    const maxVisiblePages = 5;
    
    // Кнопка "Назад"
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}" aria-label="Предыдущая">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Определяем диапазон страниц
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Первая страница
    if (startPage > 1) {
        html += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="1">1</a>
            </li>
        `;
        if (startPage > 2) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Основные страницы
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `;
    }
    
    // Последняя страница
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        html += `
            <li class="page-item">
                <a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a>
            </li>
        `;
    }
    
    // Кнопка "Вперед"
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}" aria-label="Следующая">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `;
    
    return html;
}

function setupPaginationListeners() {
    const pageLinks = document.querySelectorAll('.page-link[data-page]');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = parseInt(e.currentTarget.getAttribute('data-page'));
            
            if (page >= 1 && page <= totalPages && page !== currentPage) {
                currentPage = page;
                if (paginationCallback) {
                    paginationCallback(page);
                }
                updatePagination();
            }
        });
    });
}

/**
 * Установить текущую страницу
 */
export function setCurrentPage(page) {
    currentPage = page;
}

/**
 * Получить текущую страницу
 */
export function getCurrentPage() {
    return currentPage;
}