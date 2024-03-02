// Импорт библиотеки изображений и стилей для уведомлений
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Выбор формы
const form = document.querySelector('.form');

// Слушатель события отправки формы для создания уведомления
form.addEventListener('submit', handleCreate);

// Функция обработки создания уведомления
function handleCreate(event) {
  event.preventDefault();
  // Получение данных из формы
  const dataDelay = event.target.elements.delay.value;
  const ratioBnt = event.target.elements.state.value;

  // Функция создания уведомления с задержкой
  function createNotification(dataDelay) {
    return new Promise((res, rej) => {
      const delay = Number(dataDelay);
      setTimeout(() => {
        if (ratioBnt === 'fulfilled') {
          res(delay);
        } else {
          rej(delay);
        }
      }, delay);
    });
  }

  // Создание уведомления после выполнения или отклонения обещания
  createNotification(dataDelay)
    .then(value => {
      // Показать уведомление об успешном выполнении обещания
      iziToast.show({
        message: `✅ Обещание выполнено за ${dataDelay} мс`,
        messageColor: '#ffffff',
        color: '#65B741',
        position: 'topRight',
        progressBarColor: '#ffffff',
        close: false,
      });
    })
    .catch(error => {
      // Показать уведомление об отклонении обещания
      iziToast.show({
        message: `❌ Обещание отклонено за ${dataDelay} мс`,
        messageColor: '#ffffff',
        color: '#FF6868',
        position: 'topRight',
        progressBarColor: '#ffffff',
        close: false,
      });
    });
}
