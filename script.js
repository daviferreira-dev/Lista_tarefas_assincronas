// Seleciona os elementos do DOM
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const clearAllButton = document.getElementById('clearAllButton');
const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const closeButton = document.querySelector('.close-modal-button');

// Função para exibir o modal de mensagem
function showMessage(message) {
    modalMessage.textContent = message;
    messageModal.style.display = 'flex'; // Manipulação do DOM: Altera o estilo CSS para exibir o modal
}

// Event listener para fechar o modal
closeButton.addEventListener('click', () => {
    messageModal.style.display = 'none'; // Manipulação do DOM: Esconde o modal
});

// Fecha o modal se o utilizador clicar fora do conteúdo
window.addEventListener('click', (event) => {
    if (event.target == messageModal) {
        messageModal.style.display = 'none'; // Manipulação do DOM: Esconde o modal
    }
});

// Carrega as tarefas do LocalStorage
function loadTasks() {
    // localStorage.getItem(): Busca as notas salvas no navegador
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // JSON.parse(): Transforma o texto do localStorage de volta para um array
    tasks.forEach(task => addTaskToDOM(task.text, task.completed));
}

// Salva as tarefas no LocalStorage
function saveTasks() {
    const tasks = [];
    // Manipulação do DOM: Percorre os elementos da lista para obter os dados atuais
    document.querySelectorAll('.task-item').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            completed: li.querySelector('.task-text').classList.contains('completed')
        });
    });
    // localStorage.setItem(): Guarda as notas (array transformado em texto) no navegador
    localStorage.setItem('tasks', JSON.stringify(tasks)); // JSON.stringify(): Transforma o array de notas em texto para guardar no localStorage
}

// Adiciona uma tarefa ao DOM
function addTaskToDOM(taskText, completed = false) {
    // Manipulação do DOM: Cria e configura novos elementos HTML para a tarefa
    const li = document.createElement('li');
    li.className = 'task-item';

    const taskSpan = document.createElement('span');
    taskSpan.textContent = taskText;
    taskSpan.className = 'task-text';

    if (completed) {
        taskSpan.classList.add('completed');
    }

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'task-actions';

    const completeButton = document.createElement('button');
    completeButton.innerHTML = completed ? '&#10003;' : '&#x2713;';
    completeButton.className = `action-button ${completed ? 'complete-task-button' : 'incomplete-task-button'}`;
    completeButton.title = completed ? 'Desmarcar como Concluída' : 'Marcar como Concluída';

    completeButton.addEventListener('click', async () => {
        taskSpan.classList.toggle('completed');
        if (taskSpan.classList.contains('completed')) {
            completeButton.classList.remove('incomplete-task-button');
            completeButton.classList.add('complete-task-button');
            completeButton.title = 'Desmarcar como Concluída';
            completeButton.innerHTML = '&#10003;';
            await fetchAdvice(); // fetch(): Busca um conselho aleatório da API quando a tarefa é concluída
        } else {
            completeButton.classList.remove('complete-task-button');
            completeButton.classList.add('incomplete-task-button');
            completeButton.title = 'Marcar como Concluída';
            completeButton.innerHTML = '&#x2713;';
        }
        saveTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '&times;';
    deleteButton.className = 'action-button delete-task-button';
    deleteButton.title = 'Deletar Tarefa';
    deleteButton.addEventListener('click', () => {
        li.remove(); // Manipulação do DOM: Remove o elemento da lista
        saveTasks();
    });

    actionsDiv.appendChild(completeButton);
    actionsDiv.appendChild(deleteButton);
    li.appendChild(taskSpan);
    li.appendChild(actionsDiv);
    taskList.appendChild(li); // Manipulação do DOM: Adiciona o novo item à lista na tela
}

// Adiciona uma nova tarefa
addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        addTaskToDOM(taskText);
        saveTasks();
        taskInput.value = ''; // Manipulação do DOM: Limpa o campo de entrada
    } else {
        showMessage('Por favor, digite uma tarefa!');
    }
});

// Permite adicionar tarefa pressionando Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskButton.click();
    }
});

// Limpa todas as tarefas
clearAllButton.addEventListener('click', () => {
    if (taskList.children.length > 0) {
        taskList.innerHTML = ''; // Manipulação do DOM: Limpa todos os elementos da lista
        saveTasks();
        showMessage('Todas as tarefas foram limpas com sucesso!');
    } else {
        showMessage('Não há tarefas para limpar!');
    }
});

// Busca um conselho aleatório da API
async function fetchAdvice() {
    try {
        // fetch(): Realiza a requisição à API externa
        const response = await fetch('https://api.adviceslip.com/advice');
        const data = await response.json();
        showMessage(`Conselho: "${data.slip.advice}"`);
    } catch (error) {
        console.error('Erro ao buscar conselho:', error);
        showMessage('Erro ao buscar conselho. Tente novamente mais tarde.');
    }
}

// Carrega as tarefas quando a página é carregada
window.onload = loadTasks;
