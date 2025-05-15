function initializeFields() {
    const fields = ['firstName', 'lastName', 'gender', 'dob', 'age', 'email', 'phone', 'reservationDate', 'reservationDuration', 'carType', 'carBrand', 'extras'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.classList.add('error');
            field.addEventListener('input', function () {
                validateField(id);
            });
        }
    });
    calculateAge(); // Вызов для расчета возраста при загрузке
}

function validateField(id) {
    const field = document.getElementById(id);

    if (id === 'dob') {
        validateDate();
    } else if (id === 'age') {
        validateAge();
    } else if (id === 'email') {
        validateEmailField();
    } else if (id === 'phone') {
        validatePhoneField();
    } else if (id === 'reservationDate') {
        validateReservationDate();
    } else if (id === 'reservationDuration' || id === 'carType' || id === 'carBrand' || id === 'extras') {
        validateSelectField(id);
    } else {
        if (field.value.trim() === "") {
            field.classList.add('error');
            field.classList.remove('valid');
        } else {
            field.classList.add('valid');
            field.classList.remove('error');
        }
    }
}


// Обработчики событий для подсветки
document.getElementById('dob').addEventListener('input', validateDate);
document.getElementById('age').addEventListener('input', validateAge);
document.getElementById('email').addEventListener('input', validateEmailField);
document.getElementById('phone').addEventListener('input', validatePhoneField);
document.getElementById('dob').addEventListener('change', calculateAge);

function validateAge() {
    document.getElementById('age').addEventListener('input', function() {
        if (this.value.length > 3) {
            this.value = this.value.slice(0, 3); // Ограничиваем ввод до 3 символов
        }
    });
    const dobStr = document.getElementById('dob').value; // Получаем дату рождения
    const ageInput = parseInt(document.getElementById('age').value); // Получаем возраст из поля ввода
    const dob = new Date(dobStr); // Преобразуем строку даты в объект Date
    const today = new Date(); // Получаем сегодняшнюю дату
    const ageErrorMsg = document.getElementById('ageErrorMsg'); // Элемент для сообщения об ошибке

    // Проверяем, действительна ли дата рождения
    if (isNaN(dob.getTime())) { // Если дата невалидная
        document.getElementById('dob').classList.add('error'); // Подсвечиваем дату красным
        document.getElementById('age').classList.add('error'); // Подсвечиваем век красным
        document.getElementById('age').classList.remove('valid'); // Убираем зеленую подсветку
        return; // Выход из функции
    } else {
        document.getElementById('dob').classList.remove('error'); // Убираем красную подсветку
    }

    // Рассчитываем возраст
    let calculatedAge = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        calculatedAge--; // Корректируем возраст, если день рождения еще не был в этом году
    }

    // Проверяем совпадение введенного возраста с рассчитанным
    if (calculatedAge === ageInput && ageInput <= 120) { // Проверяем на возраст до 120 лет
        document.getElementById('age').classList.add('valid'); // Подсвечиваем возраст зеленым
        document.getElementById('age').classList.remove('error'); // Убираем красную подсветку
        ageErrorMsg.textContent = ''; // Очистка сообщения об ошибке
    } else {
        document.getElementById('age').classList.add('error'); // Подсвечиваем век красным
        document.getElementById('age').classList.remove('valid'); // Убираем зеленую подсветку
        ageErrorMsg.textContent = 'Dátum narodenia a vek sa nezhodujú.'; // Сообщение об ошибке
    }
}


function calculateAge() {

    const dobStr = document.getElementById('dob').value; // Получаем значение из поля даты
    const dob = new Date(dobStr); // Преобразуем строку в объект Date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Устанавливаем время на полночь

    // Проверка, является ли дата рождения будущей
    if (dob > today) {
        showError('Dátum narodenia nemôže byť v budúcnosti.'); // Ошибка для будущей даты
        document.getElementById('age').value = ''; // Очистка поля возраста
        document.getElementById('dob').classList.add('error'); // Подсветка даты красным
        document.getElementById('age').classList.add('error'); // Подсветка поля возраста красным
        document.getElementById('dob').classList.remove('valid'); // Убираем зелёную подсветку
        document.getElementById('age').classList.remove('valid'); // Убираем зелёную подсветку
        return; // Завершение функции
    }

    // Проверка на слишком старую дату рождения (120 лет назад)
    const maxDob = new Date();
    maxDob.setFullYear(today.getFullYear() - 120);
    if (dob < maxDob) {
        showError('Zadajte platný dátum narodenia.'); // Ошибка для слишком старой даты
        document.getElementById('age').value = ''; // Очистка поля возраста
        document.getElementById('dob').classList.add('error'); // Подсветка даты красным
        document.getElementById('age').classList.add('error'); // Подсветка поля возраста красным
        document.getElementById('dob').classList.remove('valid'); // Убираем зелёную подсветку
        document.getElementById('age').classList.remove('valid'); // Убираем зелёную подсветку
        return; // Завершение функции
    }

    // Проверка действительности даты
    if (!isNaN(dob.getTime())) { // Если дата действительна
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--; // Если день рождения в текущем году ещё не прошёл
        }

        // Если возраст меньше 18 лет
        if (age < 18) {
            showError('Vek musí byť aspoň 18 rokov.'); // Сообщение об ошибке
            document.getElementById('dob').classList.add('error'); // Подсветка даты красным
            document.getElementById('age').classList.add('error'); // Подсветка возраста красным
            document.getElementById('dob').classList.remove('valid'); // Убираем зелёную подсветку
            document.getElementById('age').classList.remove('valid'); // Убираем зелёную подсветку
        } else {
            // Если возраст больше 18
            document.getElementById('age').value = age; // Установка рассчитанного возраста
            document.getElementById('dob').classList.remove('error'); // Удаление красной подсветки
            document.getElementById('age').classList.remove('error'); // Удаление красной подсветки
            document.getElementById('dob').classList.add('valid'); // Подсветка даты зелёным
            document.getElementById('age').classList.add('valid'); // Подсветка возраста зелёным
            document.getElementById('dobErrorMsg').textContent = ''; // Очистка сообщений об ошибке
        }
    } else {
        document.getElementById('dob').classList.add('error'); // Подсветка даты красным
        document.getElementById('age').classList.add('error'); // Подсветка возраста красным
        document.getElementById('dob').classList.remove('valid'); // Убираем зелёную подсветку
        document.getElementById('age').classList.remove('valid'); // Убираем зелёную подсветку
    }
}

// Функция для проверки даты рождения
function validateDate() {
    const dobInput = document.getElementById('dob');
    const isValid = parseDate(dobInput.value);

    if (isValid) {
        dobInput.classList.add('valid');
        dobInput.classList.remove('error');
    } else {
        dobInput.classList.remove('valid');
        dobInput.classList.add('error');
    }
    calculateAge();
}

// Пример использования функции validateDate
document.getElementById('dob').addEventListener('input', validateDate);

document.getElementById('dob').addEventListener('input', function (event) {
    const value = event.target.value;
    const year = value.split('-')[0];
    if (year.length > 4) {
        event.target.value = value.slice(0, -1);
    }
});

function validateEmailField() {
    const email = document.getElementById('email').value;
    const emailErrorMsg = document.getElementById('emailErrorMsg');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Простой шаблон для проверки email

    if (!emailPattern.test(email)) {
        emailErrorMsg.textContent = 'Zadajte platný email.'; // Сообщение об ошибке
        document.getElementById('email').classList.add('error'); // Подсветка поля красным
        document.getElementById('email').classList.remove('valid'); // Удаление зеленой подсветки
    } else {
        emailErrorMsg.textContent = ''; // Очистка сообщения об ошибке
        document.getElementById('email').classList.remove('error'); // Удаление подсветки
        document.getElementById('email').classList.add('valid'); // Подсветка поля зеленым
    }
}

function validatePhoneField() {
    const phone = document.getElementById('phone').value.replace(/\s+/g, ''); // Удаляем все пробелы
    const phoneErrorMsg = document.getElementById('phoneErrorMsg');
    const phonePattern = /^\+421\d{9}$/; // Шаблон для проверки формата телефона без пробелов

    if (!phonePattern.test(phone)) {
        phoneErrorMsg.textContent = 'Zadajte platné telefónne číslo v formáte: +421123456789 alebo +421 --- --- ---'; // Сообщение об ошибке
        document.getElementById('phone').classList.add('error'); // Подсветка поля красным
        document.getElementById('phone').classList.remove('valid'); // Удаление зеленой подсветки
    } else {
        phoneErrorMsg.textContent = '';
        document.getElementById('phone').classList.remove('error'); // Удаление подсветки
        document.getElementById('phone').classList.add('valid'); // Подсветка поля зеленым
    }
}

// Обработчики событий для валидации
document.getElementById('email').addEventListener('input', validateEmailField);
document.getElementById('phone').addEventListener('input', validatePhoneField);

function toggleOtherService() {
    const otherServiceCheckbox = document.getElementById('otherService');
    const otherServiceField = document.getElementById('otherServiceField');
    if (otherServiceCheckbox.checked) {
        otherServiceField.style.display = 'block';
    } else {
        otherServiceField.style.display = 'none';
    }
}


function calculatePrice() {
    const durationSelect = document.getElementById('reservationDuration');
    const carSelect = document.getElementById('carType');
    const carBrandSelect = document.getElementById('carBrand');
    const extrasSelect = document.getElementById('extras');
    const carTypePrice = parseFloat(carSelect.options[carSelect.selectedIndex].getAttribute('data-price')) || 0;
    const carPrice = parseFloat(carBrandSelect.options[carBrandSelect.selectedIndex].getAttribute('data-price')) || 0;
    const durationMultiplier = parseFloat(durationSelect.options[durationSelect.selectedIndex].getAttribute('value')) || 1;
    const extrasPrice = parseFloat(extrasSelect.options[extrasSelect.selectedIndex].getAttribute('data-price')) || 0;
    let transmissionPrice = 0;
    if (document.getElementById('automatic').checked) {
        transmissionPrice = 10; // Цена для автоматической трансмиссии
    } else if (document.getElementById('manual').checked) {
        transmissionPrice = 5; // Цена для механической трансмиссии
    } else if (document.getElementById('sequential').checked) {
        transmissionPrice = 7; // Цена для последовательной трансмиссии
    }
    let totalPrice = (carTypePrice + carPrice + extrasPrice+transmissionPrice) * durationMultiplier;
    totalPrice += addExtraServicesPrice();
    document.getElementById('totalPrice').textContent = `Celková cena: ${totalPrice}€`;
}

function validateSelectField(id) {
    const field = document.getElementById(id);
    if (field.value === "" || field.value === null) {
        field.classList.add('error');
        field.classList.remove('valid');
    } else {
        field.classList.add('valid');
        field.classList.remove('error');
    }
}


function validateReservationDate() {
    const reservationDateField = document.getElementById('reservationDate');
    const selectedDate = new Date(reservationDateField.value);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
        reservationDateField.classList.add('error');
        reservationDateField.classList.remove('valid');
    } else {
        dateErrorMsg.textContent = "";
        reservationDateField.classList.add('valid');
        reservationDateField.classList.remove('error');
    }
}


// Функция для добавления/убирания цен за дополнительные услуги
function addExtraServicesPrice() {
    const prices = {
        'gps': 5,
        'childSeat': 7,
        'additionalDriver': 8
    };

    let extraPrice = 0;
    // Пересчитываем только выбранные дополнительные услуги (для чекбоксов и радиокнопов)
    const extraElements = document.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');

    extraElements.forEach((element) => {
        const serviceId = element.id;
        if (prices[serviceId]) {
            extraPrice += prices[serviceId]; // Добавляем цену за услугу
        }
    });

    return extraPrice;
}

// Обработчик для чекбоксов и радиокнопов (добавление/удаление опций)
const extraElements = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
extraElements.forEach(element => {
    element.addEventListener('change', calculatePrice);  // При изменении любого элемента пересчитываем цену
});

// Инициализация при загрузке страницы
calculatePrice();

// Функция для показа ошибки
function showError(message) {
    const errorMsgElement = document.getElementById('dobErrorMsg');
    errorMsgElement.textContent = message; // Устанавливаем текст сообщения
    errorMsgElement.style.display = 'block'; // Показываем сообщение
}

// Устанавливаем минимальную дату для поля "Дата аренды"


// Устанавливаем минимальную дату при загрузке страницы

function setMinReservationDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');

    const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('reservationDate').setAttribute('min', minDateTime);
}

window.onload = function () {
    initializeFields();
    setMinReservationDate();
};


const carOptions = {
    sedan: {
        brands: [
            {
                name: 'Toyota (2€/day)', price: 2, insurance: [
                    {name: "Toyota Standard Insurance (10€/day)", price: 10},
                    {name: "Toyota No Insurance", price: 0}
                ]
            },
            {
                name: 'Honda (3€/day)', price: 3, insurance: [
                    {name: "Honda Standard Insurance (12€/day)", price: 12},
                    {name: "Honda No Insurance", price: 0}
                ]
            },
            {
                name: 'Hyundai (5€/day)', price: 5, insurance: [
                    {name: "Hyundai Standard Insurance (15€/day)", price: 15},
                    {name: "Hyundai No Insurance", price: 0}
                ]
            }
        ]
    },
    universalne: {
        brands: [
            {
                name: 'Ford (1€/day)', price: 1, insurance: [
                    {name: "Ford Premium Insurance (15€/day)", price: 15},
                    {name: "Ford No Insurance", price: 0}
                ]
            },
            {
                name: 'Chevrolet (2€/day)', price: 2, insurance: [
                    {name: "Chevrolet Premium Insurance (14€/day)", price: 14},
                    {name: "Chevrolet No Insurance", price: 0}
                ]
            },
            {
                name: 'Kia (3€/day)', price: 3, insurance: [
                    {name: "Kia Premium Insurance (18€/day)", price: 18},
                    {name: "Kia No Insurance", price: 0}
                ]
            }
        ]
    },
    hatchback: {
        brands: [
            {
                name: 'Volkswagen (2€/day)', price: 2, insurance: [
                    {name: "Volkswagen Basic Insurance (20€/day)", price: 20},
                    {name: "Volkswagen No Insurance", price: 0}
                ]
            },
            {
                name: 'Fiat (5€/day)', price: 5, insurance: [
                    {name: "Fiat Basic Insurance (22€/day)", price: 22},
                    {name: "Fiat No Insurance", price: 0}
                ]
            },
            {
                name: 'Peugeot (6€/day)', price: 6, insurance: [
                    {name: "Peugeot Basic Insurance (25€/day)", price: 25},
                    {name: "Peugeot No Insurance", price: 0}
                ]
            }
        ]
    },
    minivan: {
        brands: [
            {
                name: 'Mercedes (3€/day)', price: 3, insurance: [
                    {name: "Mercedes Family Insurance (25€/day)", price: 25},
                    {name: "Mercedes No Insurance", price: 0}
                ]
            },
            {
                name: 'Nissan (5€/day)', price: 5, insurance: [
                    {name: "Nissan Family Insurance (30€/day)", price: 30},
                    {name: "Nissan No Insurance", price: 0}
                ]
            },
            {
                name: 'Mazda (8€/day)', price: 8, insurance: [
                    {name: "Mazda Family Insurance (35€/day)", price: 35},
                    {name: "Mazda No Insurance", price: 0}
                ]
            }
        ]
    },
};

function updateCarBrand() {
    const carType = document.getElementById('carType').value;
    const carBrandSelect = document.getElementById('carBrand');
    const extrasSelect = document.getElementById('extras');

    // Очистка текущих опций
    carBrandSelect.innerHTML = '<option value="" disabled selected>----</option>';

    // Добавление новых марок на основе выбранного типа автомобиля
    if (carType && carOptions[carType]) {
        carOptions[carType].brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand.name; // Используем название марки в качестве значения
            option.textContent = brand.name; // Отображаемое имя марки
            option.setAttribute('data-price', brand.price); // Установите цену как атрибут данных
            carBrandSelect.appendChild(option);
        });
    }

    // Деактивируем выбор страховки
    extrasSelect.innerHTML = '<option value="" disabled selected>----</option>';
    extrasSelect.disabled = true; // Деактивируем выбор страховки

    // Пересчитываем цену
    calculatePrice();
}


function updateInsuranceOptions() {
    const carType = document.getElementById('carType').value;
    const carBrand = document.getElementById('carBrand').value;
    const extrasSelect = document.getElementById('extras');

    // Очистка текущих опций страховки
    extrasSelect.innerHTML = '<option value="" disabled selected>----</option>';

    // Добавление опций страховки на основе выбранного типа автомобиля и марки
    if (carType && carBrand && carOptions[carType]) {
        const brand = carOptions[carType].brands.find(b => b.name === carBrand);
        if (brand && brand.insurance) {
            brand.insurance.forEach(ins => {
                const option = document.createElement('option');
                option.value = ins.name;
                option.setAttribute('data-price', ins.price);
                option.textContent = ins.name;
                extrasSelect.appendChild(option);
            });
        }

        // Активируем выбор страховки
        extrasSelect.disabled = false;
    } else {
        // Деактивируем выбор страховки, если марка не выбрана
        extrasSelect.disabled = true;
    }

    // Пересчитываем цену
    calculatePrice();
}


// Добавьте вызов updateInsuranceOptions в updateCarBrand
document.getElementById('carBrand').addEventListener('change', function () {
    updateInsuranceOptions();
    calculatePrice(); // Пересчитываем цену сразу после выбора марки
});

document.getElementById('showNameButton').addEventListener('click', function() {
    var nameField = document.getElementById('hiddenNameField');
    if (nameField.style.display === 'none') {
        nameField.style.display = 'block'; // Показываем имя
    } else {
        nameField.style.display = 'none'; // Скрываем имя, если уже отображено
    }
});


function showSummary() {
    if (!validateForm()) {
        alert("Prosím, vyplňte všetky povinné polia správne.");
        return;
    }

    // Получаем значения полей формы
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.querySelector('input[name="gender"]:checked') ? document.querySelector('input[name="gender"]:checked').value : "Neznáme";
    const dobStr = document.getElementById('dob').value;
    const age = document.getElementById('age').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const reservationDate = document.getElementById('reservationDate').value;
    const reservationDuration = document.getElementById('reservationDuration').value;
    const carType = document.getElementById('carType').options[document.getElementById('carType').selectedIndex].text;
    const carBrand = document.getElementById('carBrand').value;
    const transmission = document.querySelector('input[name="transmission"]:checked') ? document.querySelector('input[name="transmission"]:checked').value : "Neznáme";
    const insurance = document.getElementById('extras').value ? document.getElementById('extras').value : "Nie";

    const extraServices = [];
    if (document.getElementById('gps').checked) extraServices.push("GPS (5€)");
    if (document.getElementById('childSeat').checked) extraServices.push("Detská sedačka (7€)");
    if (document.getElementById('additionalDriver').checked) extraServices.push("Additional Driver (8€)");

    const otherServiceInput = document.getElementById('otherServiceInput').value;
    if (document.getElementById('otherService').checked && otherServiceInput) {
        extraServices.push(otherServiceInput);

        const otherServiceHidden = document.createElement('input');
        otherServiceHidden.type = 'hidden';
        otherServiceHidden.name = 'otherServiceDetails'; // Имя для сервера
        otherServiceHidden.value = otherServiceInput; // Значение, которое ввел пользователь
        document.forms[0].appendChild(otherServiceHidden);
    }
    const fuelType = document.querySelector('select[name="fuelType"]') ? document.querySelector('select[name="fuelType"]').value : "Neurčené";
    const tripDestination = document.querySelector('input[name="tripDestination"]') ? document.querySelector('input[name="tripDestination"]').value : "Neurčené";
    const comments = document.getElementById('userComments').value;


    // Обновляем данные в модальном окне
    document.getElementById('summaryFirstName').innerText = firstName;
    document.getElementById('summaryLastName').innerText = lastName;
    document.getElementById('summaryGender').innerText = gender;
    document.getElementById('summaryDob').innerText = dobStr;
    document.getElementById('summaryAge').innerText = age;
    document.getElementById('summaryEmail').innerText = email;
    document.getElementById('summaryPhone').innerText = phone;
    document.getElementById('summaryReservationDate').innerText = reservationDate;
    document.getElementById('summaryReservationDuration').innerText = reservationDuration;
    document.getElementById('summaryCarType').innerText = carType;
    document.getElementById('summaryCarBrand').innerText = carBrand;
    document.getElementById('summaryInsurance').innerText = insurance; // Страховка
    document.getElementById('summaryTransmission').innerText = transmission; // Добавляем отображение типа трансмиссии
    document.getElementById('summaryFuelType').innerText = fuelType; // Тип топлива
    document.getElementById('summaryTripDestination').innerText = tripDestination; // Место назначения

    document.getElementById('summaryExtras').innerText = extraServices.length ? extraServices.join(', ') : "Žiadne služby";
    document.getElementById('summaryComments').textContent = comments ? comments : 'Žiadne';

    document.getElementById('summaryTotalPrice').innerText = document.getElementById('totalPrice').innerText;

    document.getElementById('summaryModal').style.display = "block";
}




const inputs = document.querySelectorAll("#firstName, #lastName, #email, #phone, #dob #age");

inputs.forEach(input => {
    input.addEventListener("input", function () {
        validateSingleField(this);
    });
});


function validateSingleField(input) {
    let isValid = true;
    const today = new Date();

    switch (input.id) {
        case "email":
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(input.value);
            break;
        case "phone":
            const phoneValue = input.value.replace(/\s+/g, ''); // Удаляем все пробелы
            const phoneRegex = /^\+421\d{9}$/; // Регулярное выражение для проверки номера телефона без пробелов
            isValid = phoneRegex.test(phoneValue); // Проверяем очищенное значение
            break;

        case "dob":
            const dobDate = new Date(input.value);
            // Проверка: если дата пустая или больше сегодняшнего дня - не валидна
            isValid = input.value !== "" && !isNaN(dobDate.getTime()) && dobDate <= today;
            if (isValid) {
                let age = today.getFullYear() - dobDate.getFullYear();
                const birthdayThisYear = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
                if (today < birthdayThisYear) age--; // Учитываем, был ли день рождения в этом году

                // Проверяем, что возраст не меньше 18
                isValid = age >= 18;
            }
            break;
        default:
            isValid = input.value !== ""; // Простая проверка на пустое значение
            break;
    }

    // Устанавливаем цвет границы в зависимости от результата валидации
    input.style.borderColor = isValid ? "green" : "red";
    return isValid; // Возвращаем результат валидации
}


function checkEmptyField(inputElement, errorMsgElement, errorMessage) {
    if (inputElement.value === "") {
        inputElement.style.borderColor = "red";
        errorMsgElement.textContent = errorMessage;
        return false; // Поле пустое
    } else {
        inputElement.style.borderColor = "green";
        errorMsgElement.textContent = "";
        return true; // Поле заполнено
    }
}

function validateForm() {
    let isValid = true;

    // Проверка имени
    const firstNameInput = document.getElementById("firstName");
    const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
    isValid &= checkEmptyField(firstNameInput, firstNameErrorMsg, "Zadajte meno");

    // Проверка фамилии
    const lastNameInput = document.getElementById("lastName");
    const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
    isValid &= checkEmptyField(lastNameInput, lastNameErrorMsg, "Zadajte priezvisko");

    // Проверка пола
    const gender = document.querySelector('input[name="gender"]:checked');
    const genderErrorMsg = document.getElementById("genderErrorMsg");
    const genderRadios = document.querySelectorAll('input[name="gender"]');

    if (!gender) {
        isValid = false;
        genderRadios.forEach(radio => {
            radio.style.outline = "2px solid red"; // Подсветить красным все радио-кнопки
        });
        genderErrorMsg.textContent = "Zadajte pohlavie";
    } else {
        genderRadios.forEach(radio => {
            radio.style.outline = ""; // Убрать подсветку
        });
        genderErrorMsg.textContent = "";
    }


    // Проверка email, телефона и даты рождения
    const emailValid = validateSingleField(document.getElementById("email"));
    const phoneValid = validateSingleField(document.getElementById("phone"));
    const dobValid = validateSingleField(document.getElementById("dob"));

    // Получаем значение возраста
    const ageInput = document.getElementById("age").value;
    const dobValue = document.getElementById("dob").value;

    if (dobValid) {
        const dobDate = new Date(dobValue);
        const today = new Date();
        let age = today.getFullYear() - dobDate.getFullYear();
        const birthdayThisYear = new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate());
        if (today < birthdayThisYear) age--; // Учитываем, был ли день рождения в этом году

        // Проверка, что введенный возраст совпадает с вычисленным
        if (ageInput != age) {
            isValid = false;
            document.getElementById("age").style.borderColor = "red"; // Подсветить красным, если возраст не совпадает
        } else {
            document.getElementById("age").style.borderColor = "green"; // Подсветить зеленым, если возраст совпадает
        }
    }

    // Обновляем общий статус валидности
    isValid = isValid && emailValid && phoneValid && dobValid;

    return isValid;
}
// Проверка имени
document.getElementById("firstName").addEventListener("input", function () {
    checkEmptyField(this, document.getElementById("firstNameErrorMsg"), "Zadajte meno");
});

// Проверка фамилии
document.getElementById("lastName").addEventListener("input", function () {
    checkEmptyField(this, document.getElementById("lastNameErrorMsg"), "Zadajte priezvisko");
});

// Проверка пола
const genderRadios = document.querySelectorAll('input[name="gender"]');
genderRadios.forEach(radio => {
    radio.addEventListener("input", function () {
        checkGenderSelected(genderRadios, document.getElementById("genderErrorMsg"), "Zadajte pohlavie");
    });
});



function checkGenderSelected(radios, errorMsgElement, errorMessage) {
    const selected = Array.from(radios).some(radio => radio.checked);

    if (!selected) {
        errorMsgElement.textContent = errorMessage;
        radios.forEach(radio => {
            radio.style.outline = "2px solid red"; // Подсветить красным все радио-кнопки
        });
    } else {
        errorMsgElement.textContent = "";
        radios.forEach(radio => {
            radio.style.outline = ""; // Убрать подсветку
        });
    }
}

function addFields() {
    // Получаем контейнер для вопросов
    const container = document.getElementById("questionsContainer");

    // Очищаем контейнер перед добавлением новых полей
    container.innerHTML = "";

    // Создаем контейнер с flexbox для выравнивания
    const flexContainer = document.createElement("div");
    flexContainer.classList.add("flex-container");

    // Первый вопрос — выбор типа топлива (выпадающий список)
    const fuelContainer = document.createElement("div");
    fuelContainer.classList.add("field-container"); // Новый контейнер для поля

    const fuelLabel = document.createElement("label");
    fuelLabel.innerText = "Vyberte typ paliva:";
    fuelContainer.appendChild(fuelLabel);

    const fuelSelect = document.createElement("select");
    fuelSelect.name = "fuelType";
    fuelSelect.style.border = "1px solid red"; // Изначально красная обводка

    // Добавляем пустой вариант "---"
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerText = "---"; // Текст для отображения по умолчанию
    defaultOption.disabled = true; // Отключаем выбор этого варианта
    defaultOption.selected = true; // Устанавливаем как выбранный по умолчанию
    fuelSelect.appendChild(defaultOption);

    // Добавляем остальные варианты
    const fuelOptions = ["Benzín", "Nafta", "Elektromobil", "Hybrid"];
    fuelOptions.forEach(optionText => {
        const option = document.createElement("option");
        option.value = optionText;
        option.innerText = optionText;
        fuelSelect.appendChild(option);
    });

    // Добавляем обработчик события для изменения цвета
    fuelSelect.addEventListener("change", function() {
        fuelSelect.style.borderColor = fuelSelect.value ? "green" : "red"; // Зеленый, если выбран
    });

    fuelContainer.appendChild(fuelSelect);
    flexContainer.appendChild(fuelContainer); // Добавляем первый вопрос в общий контейнер

    // Второй вопрос — куда едете (открытое текстовое поле)
    const tripContainer = document.createElement("div");
    tripContainer.classList.add("field-container"); // Новый контейнер для поля

    const tripLabel = document.createElement("label");
    tripLabel.innerText = "Kde cestujete:";
    tripContainer.appendChild(tripLabel);

    const tripInput = document.createElement("input");
    tripInput.type = "text";
    tripInput.name = "tripDestination";
    tripInput.style.border = "1px solid red"; // Изначально красная обводка

    // Добавляем обработчик события для изменения цвета
    tripInput.addEventListener("input", function() {
        tripInput.style.borderColor = tripInput.value ? "green" : "red"; // Зеленый, если заполнено
    });

    tripContainer.appendChild(tripInput);
    flexContainer.appendChild(tripContainer); // Добавляем второй вопрос в общий контейнер

    // Добавляем flex-контейнер в основное поле
    container.appendChild(flexContainer);
}





// Функция закрытия модального окна
function closeSummary() {
    document.getElementById('summaryModal').style.display = 'none'; // Закрываем модальное окно
    validateForm();
}