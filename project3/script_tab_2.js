// Веб-компонент для слайдера амплитуды
class AmplitudeSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
                .amplitude-control,
                .slider-container {
                    display: flex;
                    position: relative;
                    flex-direction: column;
                    gap: 10px;
                    width: 250px;
                }
                .slider-container {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    position: relative;
                }
                input[type="range"] {
                    flex-grow: 1;
                    position: relative;
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 8px;
                    background: #ddd;
                    outline: none;
                    border-radius: 5px;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    position: relative;
                    z-index: 2;
                }
                input[type="range"]::-moz-range-thumb {
                    width: 30px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    z-index: 2;
                }
                .box-1 {
                    width: 100%;
                }
                #range-slider {
                    width: 250px;
                }
                .box-1,
                .box-2 {
                    line-height: 26px;
                }
                .hidden {
                    display: none;
                }
                .toggle {
                    text-align: center;
                }
                output {
                    top: 0;
                    left: 111px;
                    min-width: 16px;
                    text-align: center;
                    cursor: pointer;
                    padding: 0 10px;
                    outline: 1px solid #ccc;
                    border-radius: 2px;
                    position: absolute;
                    z-index: 1;
                    background: #fff;
                    box-shadow: 0 0 5px rgba(0,0,0,0.3);
                }
            </style>
            <div class="amplitude-control">
                <div class="slider-container py-2">
                    <span class="box-1">
                        <input type="range" id="range-slider" min="0" max="2" step="0.01" value="1">
                        <output for="range-slider" id="slider-value">1</output>
                    </span>
                    <span class="box-2 hidden">
                        <input type="number" id="text-input" min="0" max="2" step="0.01" value="1">
                    </span>
                </div>
                <div class="toggle py-2">
                    <label>
                        <input type="checkbox" id="toggle-input">
                        Type
                    </label>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.rangeSlider = this.shadowRoot.querySelector('#range-slider');
        this.sliderValue = this.shadowRoot.querySelector('#slider-value');
        this.textInput = this.shadowRoot.querySelector('#text-input');

        // Синхронизация значения слайдера и графика
        this.rangeSlider.addEventListener('input', () => {
            const value = parseFloat(this.rangeSlider.value);
            this.sliderValue.textContent = value;
            updateAmplitude(value);  // Изменение амплитуды на графике
            this.updateOutputPosition();
        });

        // Синхронизация текстового поля и графика
        this.textInput.addEventListener('input', () => {
            const value = parseFloat(this.textInput.value);
            updateAmplitude(value);
        });

        // Переключатель между ползунком и текстовым полем
        const toggleInput = this.shadowRoot.querySelector('#toggle-input');
        toggleInput.addEventListener('change', () => {
            const box1 = this.shadowRoot.querySelector('.box-1');
            const box2 = this.shadowRoot.querySelector('.box-2');
            box1.classList.toggle('hidden', toggleInput.checked);
            box2.classList.toggle('hidden', !toggleInput.checked);
        });

        // Инициализация позиции output
        requestAnimationFrame(() => {
            this.updateOutputPosition();
        });
    }

    updateOutputPosition() {
        const value = this.rangeSlider.value;
        const min = this.rangeSlider.min;
        const max = this.rangeSlider.max;
        const percent = ((value - min) / (max - min)) * 100;
        const sliderWidth = 250;
        const thumbWidth = 16;
        const outputWidth = 36;
        const left = ((percent / 100) * (sliderWidth - thumbWidth) - outputWidth / 2 + thumbWidth / 2) + 1;
        this.sliderValue.style.left = `${left}px`;
    }
}

customElements.define('amplitude-slider', AmplitudeSlider);

// Массивы для значений x, y1 и y2
let data = [];
let xValues = [];
let y1Values = [];
let y2Values = [];
let y1Amplitude = 1;
let y2Amplitude = 1;
let hasNewData = false;
let isComplete = false;  // Флаг для контроля состояния изменения масштаба
let interval;

// Функция для обновления графика
function updateGraph() {
    const y1Checkbox = document.querySelector('#toggle-y1').checked;
    const y2Checkbox = document.querySelector('#toggle-y2').checked;

    const traces = [];

    if (y1Checkbox) {
        const trace1 = {
            x: xValues,
            y: y1Values.map(y => y * y1Amplitude),
            type: 'scatter',
            name: 'y1 (sin)',
            line: { color: 'blue' }
        };
        traces.push(trace1);
    }

    if (y2Checkbox) {
        const trace2 = {
            x: xValues,
            y: y2Values.map(y => y * y2Amplitude),
            type: 'scatter',
            name: 'y2 (cos)',
            line: { color: 'red' }
        };
        traces.push(trace2);
    }

    Plotly.react('graph', traces, {
        title: 'Measurements in y1 and y2 axes',
        xaxis: { title: 'X' },
        yaxis: { title: 'Amplitude' },
        responsive: true
    }, {
        useResizeHandler: true,
        displayModeBar: true
    });
}

// Обработка изменения размера экрана
window.addEventListener('resize', () => {
    Plotly.Plots.resize('graph');
});

// Подключение к SSE
const eventSource = new EventSource('https://old.iolab.sk/evaluation/sse/sse.php');
eventSource.onmessage = function(event) {
    const text = event.data;
    const data = text.match(/"x":\s*"(.*?)",\s*"y1":\s*"(.*?)",\s*"y2":\s*"(.*?)"/);

    if (data) {
        const x = parseFloat(data[1]);
        const y1 = parseFloat(data[2]);
        const y2 = parseFloat(data[3]);

        if (!xValues.includes(x)) {
            xValues.push(x);
            y1Values.push(y1);
            y2Values.push(y2);
            hasNewData = true;
        }
    }
};

// Функция для обновления амплитуды
function updateAmplitude(newAmplitude) {
    if (isComplete) return;  // Прекращаем изменение амплитуды, если график остановлен

    y1Amplitude = newAmplitude;
    y2Amplitude = newAmplitude;
    updateGraph();
}

// Функция для начала обновления графика с установленным интервалом
function startGraphUpdate() {
    interval = setInterval(() => {
        if (hasNewData) {
            updateGraph();
            hasNewData = false;
        }
    }, 2500);
}

// Кнопка для остановки/запуска графика
document.querySelector('#complete-btn').addEventListener('click', () => {
    if (isComplete) {
        // Перезапуск графика
        isComplete = false;
        startGraphUpdate();
        document.querySelector('#complete-btn').textContent = 'Stop';
    } else {
        // Остановка графика
        clearInterval(interval);
        isComplete = true;  // Останавливаем возможность изменения амплитуды
        updateGraph();  // Обновляем график до текущего состояния
        document.querySelector('#complete-btn').textContent = 'Start';
    }
});

// Начальное обновление графика и запуск интервала
updateGraph();
startGraphUpdate();

