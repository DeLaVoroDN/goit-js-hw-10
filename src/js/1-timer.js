// Импорт необходимых библиотек и ресурсов
import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import icon from '../img/icon.svg';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

// Выбор кнопки и инициализация ее с отключенным состоянием
const btn = document.querySelector('button');
btn.disabled = true;

// Опции для выбора даты с помощью flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  // Функция обратного вызова при закрытии выбора даты
  onClose(selectedDates) {
    const date = Date.now();
    if (selectedDates[0] < date) {
      // Отключить кнопку и показать сообщение при выборе прошедшей даты
      btn.disabled = true;
      iziToast.show({
        iconUrl: icon,
        message: 'Пожалуйста, выберите дату в будущем',
        messageColor: '#ffffff',
        color: '#ef4040',
        close: false,
        position: 'topRight',
      });
    } else {
      // Включить кнопку, если выбранная дата находится в будущем
      btn.disabled = false;
      timer;
    }
  },
};

// Выбор элемента ввода и инициализация выбора даты с помощью flatpickr
const input = document.querySelector('#datetime-picker');
flatpickr(input, options);

// Класс таймера для функциональности обратного отсчета
class Timer {
  constructor({ onTick }) {
    this.onTick = onTick;
    this.interval = null;
  }
  start() {
    // Отключить кнопку и ввод при запуске таймера
    btn.disabled = true;
    input.disabled = true;
    const startTime = new Date(input.value).getTime();
    // Обновление таймера каждую секунду
    this.interval = setInterval(() => {
      const currentTime = Date.now();
      const delta = startTime - currentTime;
      // Преобразование миллисекунд в дни, часы, минуты и секунды
      const time = this.convertMs(delta);
      if (delta <= 0) {
        // Остановить таймер по завершении обратного отсчета
        this.stop();
        return;
      }
      // Обновление отображения таймера
      this.onTick(time);
    }, 1000);
  }
  stop() {
    // Очистить интервал и включить кнопку и ввод при остановке таймера
    clearInterval(this.interval);
    btn.disabled = false;
    input.disabled = false;
  }

  // Преобразование миллисекунд в дни, часы, минуты и секунды
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = this.pad(Math.floor(ms / day));
    const hours = this.pad(Math.floor((ms % day) / hour));
    const minutes = this.pad(Math.floor(((ms % day) % hour) / minute));
    const seconds = this.pad(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  // Вспомогательная функция для добавления ведущего нуля к числам < 10
  pad(value) {
    return String(value).padStart(2, '0');
  }
}

// Выбор элементов отображения таймера
const dataDay = document.querySelector('.value[data-days]');
const dataHour = document.querySelector('.value[data-hours]');
const dataMinute = document.querySelector('.value[data-minutes]');
const dataSecond = document.querySelector('.value[data-seconds]');

// Функция для обновления отображения таймера
function updateTimer({ days, hours, minutes, seconds }) {
  dataDay.textContent = `${days}`;
  dataHour.textContent = `${hours}`;
  dataMinute.textContent = `${minutes}`;
  dataSecond.textContent = `${seconds}`;
}

// Создание нового экземпляра таймера
const timer = new Timer({
  onTick: updateTimer,
});

// Слушатель события клика кнопки для запуска таймера
btn.addEventListener('click', timer.start.bind(timer));
