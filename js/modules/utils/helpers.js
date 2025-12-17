import { TYPE_DISPLAY_NAMES } from './constants.js';

export function getTypeDisplayName(type) {
    if (!type) return 'Не указано';
    const normalizedType = type.toLowerCase();
    return TYPE_DISPLAY_NAMES[normalizedType] || type;
}

export function matchPlantType(plantType, filterType) {
    const typeMapping = {
        'decorative': ['декоративнолистные', 'декоративно-лиственные'],
        'succulent': ['суккулент', 'суккуленты', 'кактус', 'кактусы'],
        'flowering': ['цветущее', 'цветущие', 'цветковые'],
        'liana': ['лианы', 'лиана', 'вьющееся', 'вьющиеся'],
        'fern': ['папоротник', 'папоротники'],
        'ampel': ['ампельные', 'ампельное', 'ампели'],
        'palm': ['пальмы', 'древовидные', 'пальма', 'дерево', 'древесное']
    };
    
    const normalizedPlantType = (plantType || '').toLowerCase();
    const keywords = typeMapping[filterType] || [];
    
    return keywords.some(keyword => normalizedPlantType.includes(keyword));
}

export function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}