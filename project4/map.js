let photosData = [];
let filteredPhotos = [];
let map; // Переменная для карты
let activeGroup; // Переменная для карты
const mapContainer = document.getElementById('map');
	
fetch('data.json')
    .then(response => response.json())
    .then(photos => {
        photosData = photos;
        filteredPhotos = photos; // Изначально показываем все фотографии
        initializeMap(filteredPhotos); // Инициализация карты после загрузки данных
    })
    .catch(err => console.error('Ошибка загрузки JSON:', err));

function initializeMap(photos) {
    const firstCoordinates = photos[0]?.coordinates || [0, 0];
    map = L.map('map').setView(firstCoordinates, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    const groupedPhotos = photos.reduce((groups, photo, index) => {
        const key = photo.coordinates ? photo.coordinates.join(',') : null;
        if (key) {
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push({ ...photo, index });
        }
        return groups;
    }, {});

    Object.entries(groupedPhotos).forEach(([coords, photosAtLocation]) => {
        const coordinates = coords.split(',').map(Number);
        const marker = L.marker(coordinates).addTo(map);

        const indices = photosAtLocation.map(photo => photo.index).join(',');
        const popupContent = `
            <div data-img="${indices}">
                <b>${photosAtLocation[0].title}</b> (${photosAtLocation.length} фото)
            </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('click', (e) => {
            const dataImg = e.target.getPopup().getContent()
                .match(/data-img="([\d,]+)"/)[1];
            const indices = dataImg.split(',').map(Number);
			marker.closePopup(); // Закрыть текущий балун

            if (indices.length === 1) {
                // Если одна фотография, вызываем showModal
				console.log(indices[0]);
                showModal(indices[0]);
            } else {
                // Если несколько фотографий, показываем модальное окно группы
                showGroupedModal(indices);
            }
        });
    });
}

// форма для фильтрации по названию или описанию
document.getElementById('filter').addEventListener('input', event => {
    const query = event.target.value.toLowerCase();
    const groupPhoto = document.getElementById('group-photo');
    let filteredPhotos2 = filteredPhotos;

    // Фильтрация фото
    filteredPhotos2 = activeGroup.filter(photo =>
        photo.title.toLowerCase().includes(query) || photo.description.toLowerCase().includes(query)
    );

    // Очистка галереи перед рендерингом
    groupPhoto.innerHTML = '';

    // Рендеринг отфильтрованных фото
    filteredPhotos2.forEach((photo, index) => {
        const photoElement = document.createElement('div');
        photoElement.classList.add('photo');
        photoElement.innerHTML = `
            <img src="${photo.image_path}" alt="${photo.title}" class="thumbnail" onclick="showModal(${index})">
        `;
        groupPhoto.appendChild(photoElement);
    });
});

function showGroupedModal(indices) {

    const group = indices.map(index => {
        // Копируем объект фотографии и добавляем к нему индекс
        const photo = { ...photosData[index] };
        photo.index = index; // Добавляем индекс
        return photo;
    }); // Используем глобальные данные для фотографий
    const groupContent = document.getElementById('map-gallery');
    const returnMap = document.getElementById('return-map');
    const groupPhoto = document.getElementById('group-photo');

    groupPhoto.innerHTML = ''; // Очистить содержимое модального окна
    group.forEach((photo) => {
        const photoElement = document.createElement('div');
        photoElement.classList.add('photo');
        photoElement.innerHTML = `
            <img src="${photo.image_path}" alt="${photo.title}" class="thumbnail" onclick="showModal(${photo.index})">
        `;
        groupPhoto.appendChild(photoElement);
    });
	
	activeGroup = group;
    // Показать модальное окно
    groupContent.style.display = 'block';
    const mapContainer = document.getElementById('map-container');
    mapContainer.style.display = 'none';

    returnMap.addEventListener('click', () => {
        mapContainer.style.display = 'block';
        groupContent.style.display = 'none';
    });
}

function showModal(index) {
    const photo = filteredPhotos[index]; // Используем индекс из отфильтрованного массива

    document.getElementById('modal-overlay').style.display = 'block';
    document.getElementById('modal-image').src = photo.image_path;
    document.getElementById('modal-title').textContent = photo.title;
    document.getElementById('modal-description').textContent = photo.description;
    document.getElementById('modal-datetime').textContent = `Дата: ${photo.datetime}`;
    document.getElementById('modal-coordinates').textContent = `GPS: ${photo.coordinates}`;
    document.getElementById('photo-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('photo-modal').style.display = 'none';
	document.getElementById('modal-overlay').style.display = 'none';
}

// Слой маршрута и флаг для отображения
let routeControl = null;
let isRouteVisible = false;

// Событие для кнопки "Показать маршрут"
document.getElementById('toggle-route').addEventListener('click', toggleRoute);

function toggleRoute() {
    const routeLengthContainer = document.getElementById('route-length'); // Контейнер для длины маршрута

    if (isRouteVisible) {
        // Если маршрут отображается, удаляем его
        map.removeControl(routeControl);
        routeLengthContainer.innerText = ''; // Очищаем текст длины маршрута
        isRouteVisible = false;
    } else {
        // Если маршрут скрыт, отображаем его
        showRoute(routeLengthContainer);
        isRouteVisible = true;
    }
}

function showRoute(routeLengthContainer) {
    if (!filteredPhotos.length) {
        alert('Нет фотографий для построения маршрута.');
        return;
    }

    // Сортируем фотографии по времени
    const sortedPhotos = filteredPhotos.sort((a, b) =>
        new Date(a.datetime) - new Date(b.datetime)
    );

    // Извлекаем координаты
    const waypoints = sortedPhotos.map(photo => L.latLng(photo.coordinates[0], photo.coordinates[1]));

    // Создаём маршрут с использованием Leaflet Routing Machine
    routeControl = L.Routing.control({
        waypoints: waypoints,
        routeWhileDragging: false, // Отключение изменения маршрута перетаскиванием
        addWaypoints: false, // Отключение добавления точек маршрута
        lineOptions: { styles: [{ color: 'blue', weight: 4 }] }, // Стиль линии маршрута
        createMarker: function() {
            return null; // Отключаем маркеры на точках маршрута
        }
    })
        .on('routesfound', function(e) {
            // После построения маршрута получаем его длину
            const distance = (e.routes[0].summary.totalDistance / 1000).toFixed(2); // Длина в км
            routeLengthContainer.innerText = `Dĺžka trasy: ${distance} km`;
            routeLengthContainer.style.display = 'block'; // Показываем элемент

            // Добавляем класс для обновления стилей
            routeLengthContainer.classList.add('updated');

            // Убираем класс через 1 секунду для восстановления начального стиля
            setTimeout(() => {
                routeLengthContainer.classList.remove('updated');
            }, 1000);
        })
        .addTo(map);
}
