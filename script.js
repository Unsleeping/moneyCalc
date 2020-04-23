const totalBalance = document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses = document.querySelector('.total__money-expenses'),
    historyList = document.querySelector('.history__list'),
    form = document.getElementById('form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount = document.querySelector('.operation__amount');

let dbOperation = JSON.parse(localStorage.getItem('calc')) || [];

localStorage.clear();

const generateId = () => `Unsleeping${Math.round(Math.random() * 1e8).toString(16)}`

const renderOperation = (operation) => {
    const className = operation.amount < 0 ? 'history__item-minus' : 'history__item-plus';

    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.innerHTML = `${operation.description}
        <span class="history__money">${operation.amount + ' ₽'}</span>
        <button class="history_delete" data-id="${operation.id}">x</button>
    `;
    listItem.classList.add(className);

    historyList.append(listItem);
};

const updateBalance = () => {
    const resultIncome = dbOperation
        .filter((item) => item.amount > 0)
        .reduce((result, item) => result + item.amount, 0);

    const resultExpenses = dbOperation
        .filter((item) => item.amount < 0)
        .reduce((result, item) => result + item.amount, 0);

    totalMoneyIncome.textContent = resultIncome + ' ₽';
    totalMoneyExpenses.textContent = resultExpenses + ' ₽';
    totalBalance.textContent = resultIncome + resultExpenses + ' ₽';
};

const deleteOperation = (event) => {
    if (event.target.classList.contains('history_delete')) {
        dbOperation = dbOperation
            .filter(operation => operation.id !== event.target.dataset.id);

        init();
    }
};

const init = () => {
    historyList.textContent = '';

    dbOperation.forEach(renderOperation);
    updateBalance();
    localStorage.setItem('calc', JSON.stringify(dbOperation));
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;
    operationName.style.borderColor = '';
    operationAmount.style.borderColor = '';

    if (operationNameValue && operationAmountValue) {
        const operation = {
            id: generateId(),
            description: operationNameValue,
            amount: +operationAmountValue,
        };

        dbOperation.push(operation);
        init();
        console.log(dbOperation);

    } else {
        if (!operationNameValue) operationName.style.borderColor = 'red';
        if (!operationAmountValue) operationAmount.style.borderColor = 'red';
    };

    operationName.value = '';
    operationAmount.value = '';
});

historyList.addEventListener('click', deleteOperation);


init();