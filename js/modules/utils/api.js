const API_URLS = {
    PLANTS: 'data/plants.json'
};

export async function fetchPlantsData() {
    try {
        const response = await fetch(API_URLS.PLANTS);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.plants || [];
    } catch (error) {
        console.error('Ошибка загрузки данных растений:', error);
        throw error;
    }
}

export async function fetchPlantById(id) {
    try {
        const plants = await fetchPlantsData();
        const plant = plants.find(p => p.id === id);
        if (!plant) throw new Error(`Растение с ID ${id} не найдено`);
        return plant;
    } catch (error) {
        console.error('Ошибка загрузки растения:', error);
        throw error;
    }
}