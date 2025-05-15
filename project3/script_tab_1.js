// script tab 1
async function loadFile() {
	// Загружаем файл асинхронно
	const response = await fetch('/~xbudu/public_html/z03.xml.txt');
	const text = await response.text();

	// Парсим XML
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(text, "application/xml");

	const records = xmlDoc.getElementsByTagName('zaznam');
	const data = [];

	// Собираем данные по годам
	for (let record of records) {
		const year = record.getElementsByTagName('rok')[0].textContent;
		const A = record.getElementsByTagName('A')[0].textContent;
		const B = record.getElementsByTagName('B')[0].textContent;
		const C = record.getElementsByTagName('C')[0].textContent;
		const D = record.getElementsByTagName('D')[0].textContent;
		const E = record.getElementsByTagName('E')[0].textContent;
		const FX = record.getElementsByTagName('FX')[0].textContent;
		const FN = record.getElementsByTagName('FN')[0].textContent;

		data.push({year, grades: {A, B, C, D, E, FX, FN}});
	}

	// Создаем графики
	createBarChart(data);
	createPieCharts(data);
	createCustomChart(data);
}

function getOrientation() {
	const chartContainer = document.getElementById('bar-chart');
	const width = chartContainer.offsetWidth;
	return width < 767 ? 'h' : 'v';
}

function createBarChart(data) {
	const years = data.map(item => item.year);
	const grades = ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'];

	function updateTraces() {
		// Обновляем ориентацию для каждого трака на основе ширины экрана
		return grades.map(grade => ({
			x: getOrientation() === 'h' ? data.map(item => item.grades[grade]) : years,
			y: getOrientation() === 'h' ? years : data.map(item => item.grades[grade]),
			name: grade,
			orientation: getOrientation(),
			type: 'bar'
		}));
	}

	function updateLayout() {
		// Обновляем разметку на основе ориентации графика
		return {
			title: 'Rozdelenie známok',
			barmode: 'group',
			xaxis: {
				title: {
					text: getOrientation() === 'h' ? 'Počet hodnotení' : 'Rok',
					standoff: 10
				},
				automargin: true
			},
			yaxis: {
				title: getOrientation() === 'h' ? 'Rok' : 'Počet hodnotení'
			},
		};
	}

	// Первоначальная отрисовка графика
	Plotly.newPlot('bar-chart', updateTraces(), updateLayout());

	// Функция для перестройки графика при изменении размера экрана
	window.addEventListener('resize', () => {
		// Обновляем ориентацию и макет при изменении размера
		Plotly.react('bar-chart', updateTraces(), updateLayout());
	});
}


function createPieCharts(data) {
	const years = data.map(item => item.year);
	const gradeNames = ['A', 'B', 'C', 'D', 'E', 'FX', 'FN'];

	const chartData = data.map((item, index) => {
		return {
			series: gradeNames.map(grade => parseInt(item.grades[grade])),
			chart: {
				type: 'pie',
				width: '100%'
			},
			labels: gradeNames,
			title: {
				text: `za ${item.year}`
			}
		};
	});

	// Создаем контейнер для диаграмм
	const chartContainer = document.querySelector("#chart-container");
	while (chartContainer.firstChild) {
		chartContainer.removeChild(chartContainer.firstChild);
	}
	// Создаем диаграмму для каждого года
	chartData.forEach((chartConfig, index) => {
		const chart = new ApexCharts(document.createElement('div'), chartConfig);
		chartContainer.appendChild(chart.el);
		chart.render();
	});
}

// Дополнительный произвольный график
function createCustomChart(data) {
	const years = data.map(item => item.year);
	const totalGrades = data.map(item => {
		return Object.values(item.grades).reduce((a, b) => parseInt(a) + parseInt(b), 0);
	});

	const trace = {
		x: years,
		y: totalGrades,
		mode: 'lines+markers',
		name: 'Celkový počet hodnotení'
	};

	const layout = {
		title: 'Celkový počet hodnotení ',
		xaxis: {title: 'Rok'},
		yaxis: {title: 'Počet hodnotení'}
	};

	Plotly.newPlot('custom-chart', [trace], layout);
}

window.addEventListener('resize', () => {
	requestAnimationFrame(() => {
		loadFile();
		updateButtonPosition
	});
});
loadFile();

document.addEventListener("DOMContentLoaded", function() {
	const navLinks = document.querySelectorAll(".navbar-nav .nav-link");

	navLinks.forEach(link => {
		link.addEventListener("click", function(event) {
			event.preventDefault();

			// Получаем ID целевого элемента из атрибута href ссылки
			const targetId = this.getAttribute("href").substring(1);
			const targetElement = document.getElementById(targetId);

			// Определяем, какую вкладку активировать
			if (targetId === "bar-chart" || targetId === "pie-chart" || targetId === "custom-chart") {
				// Активируем вкладку 1
				document.getElementById("home-tab").click();
			} else if (targetId === "graph") {
				// Активируем вкладку 2
				document.getElementById("profile-tab").click();
			}

			// Ждём немного, чтобы вкладка активировалась, и скроллим к элементу
			setTimeout(() => {
				if (targetElement) {
					targetElement.scrollIntoView({behavior: "smooth", block: "start"});
				}
			}, 300);
		});
	});
});

