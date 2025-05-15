let photosData = [];
let filteredPhotos = []; // Для отфильтрованных фотографий

// Загрузка данных из JSON
fetch('data.json')
	.then(response => response.json())
	.then(photos => {
		photosData = photos;
		filteredPhotos = photos; // Изначально показываем все фото
		renderGallery(filteredPhotos);
		initLightGallery(); // Инициализация галереи после загрузки
	})
	.catch(err => console.error('Ошибка загрузки JSON:', err));

// Отрисовка галереи
function renderGallery(photos, shouldInitLightGallery = false) {
	const gallery = document.getElementById('gallery');
	gallery.innerHTML = ''; // Очистить галерею перед рендерингом

	photos.forEach((photo, index) => {
		const photoElement = document.createElement('a'); // Меняем на элемент <a>, который LightGallery ожидает
		photoElement.href = photo.image_path; // URL для полноразмерного изображения
		photoElement.dataset.src = photo.image_path; // Полный путь (если используется lazy-loading)
		photoElement.dataset.index = index; // Индекс слайда
		photoElement.dataset.subHtml = `<h4>${photo.title}</h4><p>${photo.description}</p><p>${photo.datetime}</p><p>${photo.coordinates}</p>`; // HTML подписи
		photoElement.classList.add('photo');

		// Вложенное изображение (миниатюра)
		photoElement.innerHTML = `
			<img src="${photo.image_path}" alt="${photo.title}" class="thumbnail">
		`;

		gallery.appendChild(photoElement);
	});
	
	if (shouldInitLightGallery) {
		initLightGallery();
	}

}

// Фильтрация по вводу
document.getElementById('filter').addEventListener('input', event => {
	const query = event.target.value.toLowerCase();
	filteredPhotos = photosData.filter(photo =>
		photo.title.toLowerCase().includes(query) || photo.description.toLowerCase().includes(query)
	);
	renderGallery(filteredPhotos, true); // Перерисовываем галерею
});

// Инициализация LightGallery
function initLightGallery() {
	const galleryContainer = document.getElementById('gallery');
	lightGallery(galleryContainer, {
		plugins: [lgAutoplay, lgThumbnail],
		pause: 3000, 
		download: false,
		thumbnail: true
	});
}