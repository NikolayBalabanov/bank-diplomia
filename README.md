# bank-diplomia
## Stack: JavaScript, SASS, cypress

## Приложение онлайн банка Coin

### В данном приложении реализован следующий функционал:
1. Авторизация
2. Управление счетами пользователя: сдание нового счёта, отображение списка
счетов, отображение баланса, просмтр истории транзакций
3. Переводы на счета или карты других пользователей
4. Возможность производить валютные обмены
5. Отображение банкоматов на карте
6. Автокомплит по уже известным счетам/картам
7. Индикация логотипов платежных систем (Visa, Mastercard и другие.)
8. Адаптивный интерфейс 320px-1440px
9. Скилетная индикация загрузки контента

### Разделы приложения:
1. Форма входа пользователя
2. Список счетов пользователя
3. Просмотр информации о существующей карте
4. Форма для перевода средств
5. Подробная история баланса по карт
6. Мониторинг курса валют и валютные переводы
6. Страница отображения точек банкоматов на карте


## ЗАПУСК ПРИЛОЖЕНИЯ:
1. Скачать файлы текущего репозитория
2. Выполнить npm i для папок backend и frontend
3. В терминале ввести команду: npm run dev
4. Для создания билда команда: npm run build
5. Приложение в dev режиме запускается на http://localhost:8080.

## ТЕСТИРОВАНИЕ:

Для тестирование написаны e2e тесты c использованием фреймворка cypress, запустить данные тесты можно командой: npx cypress open
Далее в открывшимся окна выбрать  bank-app-tests
Данные тесты проходят по базовому функционалу приложения (создание нового счета, авторизация, перевод и получение денег)

Авторизация
На данный момент доступен вход в следующий аккаунт:  
* Логин: `developer`  
* Пароль: `skillbox