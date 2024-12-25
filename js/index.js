document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = 'http://localhost:3000/books'
    const bookList = document.getElementById('list')
    const detailsPanel = document.getElementById('show-panel')

    const loggedInUser = { id: 1, username: "pouros" }
    
    fetch(apiUrl)
        .then((response) => response.json())
        .then((books) => {
            books.forEach((book) => { 
                const li = document.createElement('li')
                li.textContent = book.title
                li.addEventListener('click', () => displayBookDetails(book))
                bookList.appendChild(li)
            })
        })

    function displayBookDetails(book) {
        detailsPanel.innerHTML=''
        
        const title = document.createElement('h3')
        title.textContent = book.title 

        const subtitle = document.createElement('h3')
        subtitle.textContent = book.subtitle 

        const author = document.createElement('h3')
        author.textContent = book.author 
        
        const thumbnail = document.createElement('img')
        thumbnail.src = book.img_url || ''

        const description = document.createElement('p')
        description.textContent = book.description || 'No Description Available'

        const userList = document.createElement('ul')
        book.users.forEach((user) => {
            const li = document.createElement('li')
            li.textContent = user.username
            userList.appendChild(li)
        })

        const likeButton = document.createElement('button')
        likeButton.textContent = book.users.some((user) => user.id === loggedInUser.id) ? "Unlike" : "Like"
        likeButton.addEventListener('click', () => toggleLike(book, userList, likeButton))
        
        detailsPanel.append(thumbnail, title, subtitle, author, description, userList, likeButton)
    }

    function toggleLike(book, userList, likeButton) {
        const userIndex = book.users.findIndex((user) => user.id === loggedInUser.id)
        const isLiked = userIndex !== -1

        if (isLiked) {
            book.users.splice(userIndex, 1)
        } else {
            book.users.push(loggedInUser)
        }

        fetch(`${apiUrl}/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: book.users }),
        })
            .then((response) => response.json())
            .then((updatedBook) => {
                userList.innerHTML = ''
                updatedBook.users.forEach((user) => {
                    const li = document.createElement('li')
                    li.textContent = user.username
                    userList.appendChild(li)
                })
                likeButton.textContent = isLiked ? 'Like' : 'Unlike'
            })
    }
});

