import { initializeApp } from './modules/app/app.js';
import { initializeCatalog } from './modules/catalog/catalog.js';
import { initializePlantPage } from './modules/plant-page/plant-page.js';
import { initializeSlider } from './modules/features/slider.js';

// Точка входа приложения
document.addEventListener('DOMContentLoaded', function () {


    initializeApp();

    const currentPage = window.location.pathname;

    // Запускаем модули в зависимости от страницы
    if (currentPage.includes('catalog.html') ||
        currentPage === '/' ||
        currentPage.includes('index.html') ||
        currentPage.endsWith('/')) {
        initializeCatalog();
    }

    if (currentPage.includes('plant.html')) {
        initializePlantPage();
    }

    if (document.querySelector('.plant-slider')) {
        initializeSlider();
    }

    console.log('Все модули инициализированы');
});