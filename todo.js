function addTodo(event) {

    const todoMessage = document.querySelector("#addTodoMessage")
    todoMessage.innerHTML = ""
    todoMessage.classList = [""]

    try {
        // debugger
        console.log(event)

        if (event) {
            event.preventDefault()
        }

        const title = document.querySelector("#todoTitle").value
        const description = document.querySelector("#todoDescription").value
        const status = document.querySelector("#todoStatus").value
        const priority = document.querySelector("#todoPriority").value

        console.log({
            title,
            description,
            status,
            priority,
        })

        // call add todo API
        let URL = `${SERVER.HOST}${SERVER.SERVER_BASEURL}:${SERVER.PORT}${TODO.CREATE}`
        let body = {
            title,
            description,
            status,
            priority,
        }

        const token = localStorage.getItem("token");
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        };

        fetch(URL, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(responseData => {
                console.log('Add a Todo Response: ', responseData);
                todoMessage.classList = ["success"]
                todoMessage.innerHTML = "Todo Added"
            })
            .catch(error => {
                console.error('Error in Add a Todo: ', error);
                todoMessage.classList = ["error"]
                todoMessage.innerHTML = "Please try again!!"
            });
        } catch (error) {
            console.error('Error in Add a Todo: ', error);
            todoMessage.classList = ["error"]
        todoMessage.innerHTML = "Please try again!!"
    }
}