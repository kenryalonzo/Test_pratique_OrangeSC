

// l'evenement DOMContentLoaded nous permettra de savoir que le DOM est deja chargé
document.addEventListener("DOMContentLoaded", function() {

    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");

    // Fonction de création Dynamique de carte de tâche
    function createTaskCard(task) {

        const taskCard = document.createElement("div");
        taskCard.classList.add("task-card");
        taskCard.dataset.id = task.id;

        taskCard.innerHTML = `
            <h3>${task.title}</h3>
            <p>${task.description || ''}</p>
            <p class="task-date">Date limite : ${task.dueDate || ''}</p>
            <button class="delete-task">Supprimer</button>
        `;

        taskCard.querySelector(".delete-task").addEventListener("click", function() {

            deleteTask(task.id, taskCard);
        });

        // Ajout de la carte dans le HTML
        taskList.appendChild(taskCard);
    }

    // Maintenant passons a la création d'une fonction de récupération des tâches depuis l'API
    function fetchTasks() {

        console.log("Fetching tasks...");
        fetch('https://jsonplaceholder.typicode.com/todos')
            .then(response => {
                console.log('Response status:', response.status);
                return response.json();
            })
            .then(tasks => {
                console.log('Fetched tasks:', tasks);
                tasks.forEach(task => {
                    createTaskCard(task);
                });
            })
            .catch(error => console.error('Erreur:', error));
    }

    // Création d'une fonction d'ajout d'une nouvelle tâche via l'API
    function addTask(task) {

        console.log("Adding task...", task);
        fetch('https://jsonplaceholder.typicode.com/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(newTask => {
            console.log('Added task:', newTask);
            createTaskCard(newTask);
        })
        .catch(error => console.error('Erreur:', error));
    }

    // Creation d'une fonction de suppression d'une tâche via l'API
    function deleteTask(taskId, taskCard) {

        console.log(`Deleting task ${taskId}...`);
        fetch(`https://jsonplaceholder.typicode.com/todos/${taskId}`, {
            method: 'DELETE'
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (response.ok) {
                taskCard.remove();
            } else {
                console.error('Erreur lors de la suppression de la tâche');
            }
        })
        .catch(error => console.error('Erreur:', error));
    }

    /* Écouter l'événement de soumission du formulaire
    *  On bloque egalement le comportement par defaut du formulaire pour le rafraichissement de la page
    *  Grace a la methode preventDefault*/
    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const task = {
            title: document.getElementById("task-name").value,
            description: document.getElementById("task-desc").value,
            dueDate: document.getElementById("task-date").value,
            userId: 1 // JSONPlaceholder exige un userId, nous utilisons un ID fictif
        };

        addTask(task);
        taskForm.reset();
    });

    // Et enfin on charge les tâches existantes à partir de l'API
    fetchTasks();
});

// Finiish.