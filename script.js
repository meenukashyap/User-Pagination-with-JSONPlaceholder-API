document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const userList = document.getElementById('user-list');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pageInfo = document.getElementById('page-info');

    let currentPage = 1;
    const usersPerPage = 6;

    async function fetchUsers(page) {
        try {
            const response = await fetch(`${apiUrl}?_page=${page}&_limit=${usersPerPage}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const users = await response.json();
            const totalUsers = response.headers.get('x-total-count');
            return { users, totalUsers };
        } catch (error) {
            console.error('Fetch error:', error);
            return { users: [], totalUsers: 0 };
        }
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.classList.add('user-item');
            userElement.innerHTML = `
                <p><strong>${user.name}</strong></p>
                <p>Email: ${user.email}</p>
                <p>Phone: ${user.phone}</p>
                <p>Website: ${user.website}</p>
            `;
            userList.appendChild(userElement);
        });
    }

    function updatePagination(totalUsers) {
        const totalPages = Math.ceil(totalUsers / usersPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
    }

    async function loadUsers() {
        const { users, totalUsers } = await fetchUsers(currentPage);
        displayUsers(users);
        updatePagination(totalUsers);
    }

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadUsers();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        loadUsers();
    });

    // Initial load
    loadUsers();
});
