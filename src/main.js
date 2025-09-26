// Переключатель темы
document.addEventListener('DOMContentLoaded', function() {
    // Функция переключения темы
    function initThemeToggle() {
        const themeToggleButtons = document.querySelectorAll('.theme-toggle');
        const KEY = 'theme';
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Автовыбор темы
        if (localStorage.getItem(KEY) === 'dark' || (!localStorage.getItem(KEY) && prefersDark)) {
            document.body.classList.add('theme-dark');
            themeToggleButtons.forEach(btn => btn.setAttribute('aria-pressed', 'true'));
        }

        // Обработчики для всех кнопок переключения темы
        themeToggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const isDark = document.body.classList.toggle('theme-dark');
                themeToggleButtons.forEach(button => {
                    button.setAttribute('aria-pressed', String(isDark));
                });
                localStorage.setItem(KEY, isDark ? 'dark' : 'light');
            });
        });
    }

    // Модальное окно
    function initModal() {
        const dialog = document.getElementById('contactDialog');
        const openButton = document.getElementById('openDialog');
        const closeButton = document.getElementById('closeDialog');
        
        if (!dialog || !openButton) return;

        let lastFocusedElement = null;

        openButton.addEventListener('click', () => {
            lastFocusedElement = document.activeElement;
            dialog.showModal();
            
            // Фокус на первый инпут
            const firstInput = dialog.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        });

        closeButton.addEventListener('click', () => {
            dialog.close();
            lastFocusedElement?.focus();
        });

        // Закрытие по клику на бэкдроп
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) {
                dialog.close();
                lastFocusedElement?.focus();
            }
        });

        // Обработка отправки формы
        const form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (validateForm(form)) {
                    // Здесь обработка успешной отправки
                    alert('Форма отправлена!');
                    dialog.close();
                    lastFocusedElement?.focus();
                }
            });
        }
    }

    // Валидация форм
    function initForms() {
        // Форма в модалке
        const modalForm = document.getElementById('contactForm');
        if (modalForm) {
            initFormValidation(modalForm);
        }

        // Форма на странице контактов
        const pageForm = document.getElementById('contactPageForm');
        if (pageForm) {
            initFormValidation(pageForm);
        }
    }

    function initFormValidation(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            // Валидация при изменении
            input.addEventListener('blur', () => validateField(input));
            
            // Сброс ошибки при вводе
            input.addEventListener('input', () => {
                if (input.validity.valid) {
                    clearError(input);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            let isValid = true;
            
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                // Фокус на первое поле с ошибкой
                const firstError = form.querySelector('.form__control--error');
                if (firstError) firstError.focus();
            }
        });
    }

    function validateField(field) {
        const errorElement = field.nextElementSibling;
        
        if (!field.validity.valid) {
            field.classList.add('form__control--error');
            if (errorElement && errorElement.classList.contains('form__error')) {
                errorElement.textContent = getErrorMessage(field);
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            clearError(field);
            return true;
        }
    }

    function clearError(field) {
        field.classList.remove('form__control--error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form__error')) {
            errorElement.style.display = 'none';
        }
    }

    function getErrorMessage(field) {
        if (field.validity.valueMissing) {
            return 'Это поле обязательно для заполнения';
        }
        if (field.validity.typeMismatch) {
            return 'Пожалуйста, введите корректный email';
        }
        if (field.validity.tooShort) {
            return `Минимальная длина: ${field.minLength} символов`;
        }
        if (field.validity.patternMismatch && field.type === 'tel') {
            return 'Формат: +7 (900) 000-00-00';
        }
        return 'Пожалуйста, исправьте ошибку в этом поле';
    }

    // Плавная прокрутка для якорей
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Инициализация всех функций
    initThemeToggle();
    initModal();
    initForms();
    initSmoothScroll();
});