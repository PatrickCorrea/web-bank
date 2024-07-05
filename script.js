let saldo = 1000.00;
let transactions = [
    { date: '2024-07-03', description: 'Supermercado', amount: -150.00 },
    { date: '2024-07-02', description: 'Depósito', amount: 1000.00 },
    { date: '2024-07-01', description: 'Conta de Luz', amount: -80.00 }
];

let chart;

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    updateTransactionsChart();
}

function showOperation(operation) {
    alert(`Operação selecionada: ${operation}`);
}

function toggleSaldoVisibility() {
    const saldoElement = document.getElementById('saldo');
    saldoElement.style.filter = saldoElement.style.filter === 'blur(5px)' ? 'none' : 'blur(5px)';
}

function openTransferModal() {
    document.getElementById('transfer-modal').style.display = 'block';
}

function openLoanModal() {
    document.getElementById('loan-modal').style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function finishTransfer() {
    const amount = parseFloat(document.getElementById('transfer-amount').value);
    if (isNaN(amount) || amount <= 0 || amount > saldo) {
        alert('Valor inválido ou saldo insuficiente');
        return;
    }

    saldo -= amount;
    updateSaldo();
    transactions.unshift({
        date: new Date().toISOString().split('T')[0],
        description: 'Transferência',
        amount: -amount
    });
    
    closeModal('transfer-modal');
    showSuccessModal();
    updateTransactionsChart();
    displayTransactions();
}

function finishLoan() {
    const amount = parseFloat(document.getElementById('loan-value').value);
    const installments = parseInt(document.getElementById('loan-installments').value);
    
    if (isNaN(amount) || amount <= 0 || isNaN(installments) || installments < 1 || installments > 24) {
        alert('Valores inválidos');
        return;
    }

    const monthlyInterest = 0.79;
    const totalAmount = amount * Math.pow(1 + monthlyInterest, installments);
    
    document.getElementById('total-loan-amount').textContent = totalAmount.toFixed(2);

    saldo += amount;
    updateSaldo();
    transactions.unshift({
        date: new Date().toISOString().split('T')[0],
        description: 'Empréstimo',
        amount: amount
    });

    closeModal('loan-modal');
    showSuccessModal();
    updateTransactionsChart();
    displayTransactions();
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'block';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 3000);
}

function updateSaldo() {
    document.getElementById('saldo').textContent = `Saldo: R$ ${saldo.toFixed(2)}`;
}

function displayTransactions() {
    const list = document.getElementById('transactions-list');
    list.innerHTML = '';
    transactions.slice(0, 5).forEach(trans => {
        const li = document.createElement('li');
        li.textContent = `${trans.date} - ${trans.description}: R$ ${trans.amount.toFixed(2)}`;
        list.appendChild(li);
    });
}

function updateTransactionsChart() {
    const chartData = transactions.slice(0, 5).reverse();
    const options = {
        series: [{
            name: 'Transações',
            data: chartData.map(t => t.amount)
        }],
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            },
            foreColor: document.body.classList.contains('dark-mode') ? '#ffffff' : '#373d3f'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Transações Recentes',
            align: 'left'
        },
        xaxis: {
            categories: chartData.map(t => t.date),
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return `R$ ${val.toFixed(2)}`;
                }
            }
        },
        theme: {
            mode: document.body.classList.contains('dark-mode') ? 'dark' : 'light'
        }
    };

    if (chart) {
        chart.updateOptions(options);
    } else {
        chart = new ApexCharts(document.querySelector("#transactionsChart"), options);
        chart.render();
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copiado para a área de transferência!');
    });
}

// Chat functionality
let chatVisible = false;

function toggleChat() {
    const chatContainer = document.getElementById('chat-container');
    chatVisible = !chatVisible;
    chatContainer.classList.toggle('hidden', !chatVisible);
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (message) {
        appendMessage('Você', message);
        input.value = '';
        setTimeout(() => {
            const response = getAutomaticResponse(message);
            appendMessage('Atendente', response);
        }, 1000);
    }
}

function appendMessage(sender, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('p');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getAutomaticResponse(message) {
    const responses = {
        'olá': 'Olá! Como posso ajudar você hoje?',
        'saldo': 'Para verificar seu saldo, por favor use o botão "Saldo" na tela principal.',
        'transferência': 'Para fazer uma transferência, use o botão "Transferência" na tela principal.',
        'empréstimo': 'Temos opções de empréstimo disponíveis. Use o botão "Empréstimo" para mais informações.',
        'ajuda': 'Estou aqui para ajudar! Que tipo de assistência você precisa?'
    };

    const lowerMessage = message.toLowerCase();
    for (const [key, value] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return value;
        }
    }

    return 'Desculpe, não entendi sua pergunta. Posso ajudar com informações sobre saldo, transferências ou empréstimos.';
}

function clearChat() {
    document.getElementById('chat-messages').innerHTML = '';
}

function updateLoanTotal() {
    const amount = parseFloat(document.getElementById('loan-value').value);
    const installments = parseInt(document.getElementById('loan-installments').value);
    
    if (!isNaN(amount) && !isNaN(installments) && installments >= 1 && installments <= 24) {
        const monthlyInterest = 0.79;
        const totalAmount = amount * Math.pow(1 + monthlyInterest, installments);
        document.getElementById('total-loan-amount').textContent = totalAmount.toFixed(2);
    } else {
        document.getElementById('total-loan-amount').textContent = '0.00';
    }
}

const financialTips = [
    "Economize 20% da sua renda mensal para emergências.",
    "Invista em educação financeira para tomar melhores decisões.",
    "Diversifique seus investimentos para reduzir riscos.",
    "Evite dívidas de cartão de crédito, elas têm juros altos.",
    "Faça um orçamento mensal e siga-o rigorosamente.",
    "Considere investir em fundos indexados de baixo custo.",
    "Negocie suas dívidas para obter melhores taxas de juros.",
    "Automatize suas economias para facilitar o hábito.",
    "Revise seus gastos mensais e corte despesas desnecessárias.",
    "Pense duas vezes antes de fazer compras por impulso."
];

function displayRandomTip() {
    const tipElement = document.getElementById('tip-of-the-day');
    const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
    tipElement.textContent = randomTip;
}

window.onload = function() {
    displayTransactions();
    updateTransactionsChart();
    document.getElementById('loan-value').addEventListener('input', updateLoanTotal);
    document.getElementById('loan-installments').addEventListener('change', updateLoanTotal);
    displayRandomTip();
};