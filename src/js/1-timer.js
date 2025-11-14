// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const refs = {
  userSelectedDate: document.querySelector("input#datetime-picker"),
  startBtn: document.querySelector("button[data-start]"),
  days: document.querySelector("span[data-days]"),
  hours: document.querySelector("span[data-hours]"),
  minutes: document.querySelector("span[data-minutes]"),
  seconds: document.querySelector("span[data-seconds]"),
};

refs.startBtn.disabled = true;

const timer = {
  intervalId: null,
  setTimer: null,
  isActive: false,
  start() {
    if (this.isActive || !this.setTimer) return;
    this.isActive = true;
    refs.userSelectedDate.disabled = true;
    refs.startBtn.disabled = true;

    const tick = () => {
      const diffMs = this.setTimer.getTime() - Date.now();

      if (diffMs <= 0) {
        this.stop();
        render({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        iziToast.success({ title: "Готово", message: "Відлік завершено!" });
        refs.userSelectedDate.disabled = false;
        return;
      }

      render(convertMs(diffMs));
    };

    // миттєвий перший рендер без очікування 1с
    tick();
    this.intervalId = setInterval(tick, 1000);
  },
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.isActive = false;
  },
};

function addLeadingZero(v) {
  return String(v).padStart(2, "0");
}

function render({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days); // дні можна лишити без падінгу
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

const options = {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const picked = selectedDates[0];
    if (!picked || picked.getTime() <= Date.now()) {
      timer.setTimer = null;
      refs.startBtn.disabled = true;
      iziToast.error({
        title: "Помилка",
        message: "Оберіть дату/час у майбутньому.",
      });
      return;
    }
    timer.setTimer = picked;
    refs.startBtn.disabled = false;
    iziToast.info({
      title: "Готово",
      message: "Натисніть Start для запуску відліку.",
    });
  },
};

// ВАЖЛИВО: передаємо options!
flatpickr(refs.userSelectedDate, options);

// Запуск
refs.startBtn.addEventListener("click", () => {
  timer.start();
});
