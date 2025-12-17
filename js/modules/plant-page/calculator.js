export function calculateWaterSchedule(category, potSize, season, lighting) {
    // Базовые настройки по категориям 
    const categorySettings = {
        'Декоративнолистные': {
            baseSummer: { min: 5, max: 8 },
            baseWinter: { min: 10, max: 14 },
            volumeBase: 150 // мл для среднего горшка
        },
        'Суккуленты': {
            baseSummer: { min: 12, max: 18 },
            baseWinter: { min: 25, max: 35 },
            volumeBase: 80
        },
        'Цветущие': {
            baseSummer: { min: 4, max: 7 },
            baseWinter: { min: 8, max: 12 },
            volumeBase: 180
        },
        'Лианы': {
            baseSummer: { min: 5, max: 9 },
            baseWinter: { min: 10, max: 15 },
            volumeBase: 160
        },
        'Папоротники': {
            baseSummer: { min: 3, max: 5 },
            baseWinter: { min: 6, max: 9 },
            volumeBase: 200
        },
        'Ампельные': {
            baseSummer: { min: 4, max: 7 },
            baseWinter: { min: 8, max: 12 },
            volumeBase: 140
        },
        'Пальмы и древовидные': {
            baseSummer: { min: 7, max: 10 },
            baseWinter: { min: 14, max: 20 },
            volumeBase: 220
        }
    };

    // Нормализуем категорию (приводим к правильному названию)
    const normalizedCategory = normalizeCategory(category);
    
    // Получаем настройки для категории или декоративнолистные по умолчанию
    const settings = categorySettings[normalizedCategory] || categorySettings['Декоративнолистные'];
    
    // 1. РАСЧЕТ ЧАСТОТЫ ПОЛИВА
    
    // Базовые дни для сезона
    let minDays, maxDays;
    if (season === 'summer' || season === 'spring') {
        minDays = settings.baseSummer.min;
        maxDays = settings.baseSummer.max;
    } else {
        minDays = settings.baseWinter.min;
        maxDays = settings.baseWinter.max;
    }
    
    // Корректировка по освещению
    const lightingMultiplier = {
        'high': 0.75,   // Яркий свет - поливать чаще
        'medium': 1.0,  // Средний - без изменений
        'low': 1.25     // Слабый - поливать реже
    };
    
    const lightMult = lightingMultiplier[lighting] || 1.0;
    minDays = Math.round(minDays * lightMult);
    maxDays = Math.round(maxDays * lightMult);
    
    // Корректировка по размеру горшка
    const potMultiplier = {
        'small': 0.8,   // Маленький - поливать чаще
        'medium': 1.0,  // Средний - без изменений
        'large': 1.2,   // Большой - поливать реже
        'xlarge': 1.4   // Очень большой - еще реже
    };
    
    const potMult = potMultiplier[potSize] || 1.0;
    minDays = Math.round(minDays * potMult);
    maxDays = Math.round(maxDays * potMult);
    
    // Ограничения (не менее 2 дней, не более 60 дней)
    minDays = Math.max(2, minDays);
    maxDays = Math.max(minDays + 1, maxDays);
    maxDays = Math.min(60, maxDays);
    
    // Форматирование частоты
    let frequency;
    if (minDays === maxDays) {
        frequency = `1 раз в ${minDays} дней`;
    } else {
        frequency = `1 раз в ${minDays}-${maxDays} дней`;
    }
    
    // 2. РАСЧЕТ ОБЪЕМА ВОДЫ
    
    // Базовый объем для категории
    let volumeML = settings.volumeBase;
    
    // Корректировка по размеру горшка
    const potVolumeMultiplier = {
        'small': 0.6,
        'medium': 1.0,
        'large': 1.5,
        'xlarge': 2.0
    };
    
    volumeML = Math.round(volumeML * (potVolumeMultiplier[potSize] || 1.0));
    
    // Корректировка по сезону (зимой меньше воды)
    if (season === 'winter') {
        volumeML = Math.round(volumeML * 0.7);
    }
    
    // Корректировка по освещению (яркий свет - больше воды)
    if (lighting === 'high') {
        volumeML = Math.round(volumeML * 1.1);
    } else if (lighting === 'low') {
        volumeML = Math.round(volumeML * 0.9);
    }
    
    // Форматирование объема
    let volume;
    if (volumeML < 100) {
        volume = `${volumeML} мл`;
    } else if (volumeML < 1000) {
        // Округляем до 50 мл
        const rounded = Math.round(volumeML / 50) * 50;
        volume = `${rounded} мл`;
    } else {
        // В литрах для больших объемов
        const liters = (volumeML / 1000).toFixed(1);
        volume = `${liters} л`;
    }
    
    // 3. ВОЗВРАТ РЕЗУЛЬТАТА
    return {
        frequency: frequency,
        volume: volume
    };
}

// Вспомогательная функция для нормализации категории
function normalizeCategory(category) {
    if (!category) return 'Декоративнолистные';
    
    // Приводим к строке и убираем лишние пробелы
    const normalized = String(category).trim();
    
    // Маппинг альтернативных названий категорий
    const categoryMapping = {
        'Декоративно-лиственные': 'Декоративнолистные',
        'Декоративно лиственные': 'Декоративнолистные',
        'Декоративные лиственные': 'Декоративнолистные',
        'Суккулент': 'Суккуленты',
        'Цветущее': 'Цветущие',
        'Цветковые': 'Цветущие',
        'Лиана': 'Лианы',
        'Папоротник': 'Папоротники',
        'Ампельное': 'Ампельные',
        'Пальма': 'Пальмы и древовидные',
        'Древовидное': 'Пальмы и древовидные',
        'Дерево': 'Пальмы и древовидные'
    };
    
    // Проверяем прямое совпадение
    if (categoryMapping[normalized]) {
        return categoryMapping[normalized];
    }
    
    // Проверяем частичное совпадение
    const mainCategories = [
        'Декоративнолистные',
        'Суккуленты', 
        'Цветущие',
        'Лианы',
        'Папоротники',
        'Ампельные',
        'Пальмы и древовидные'
    ];
    
    for (const mainCat of mainCategories) {
        if (normalized.includes(mainCat) || mainCat.includes(normalized)) {
            return mainCat;
        }
    }
    
    return 'Декоративнолистные'; // Категория по умолчанию
}