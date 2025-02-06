document.addEventListener('DOMContentLoaded', () => {
    fetchNews();
});

async function fetchNews() {
    try {
        const response = await fetch('https://btu-ex-2025-0bf797fecbae.herokuapp.com/news');
        if (!response.ok) {
            throw new Error('Failed to fetch news');
        }
        const newsItems = await response.json();
        displayNews(newsItems);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayNews(newsItems) {
    const tbody = document.querySelector('#newsTable tbody');
    tbody.innerHTML = '';

    newsItems.forEach(news => {
        const row = document.createElement('tr');
        row.id = `news-${news.id}`;
        
        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'N/A';
            
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric' 
            });
        };
        
        const updatedDate = formatDate(news.dateUpdated);
        const createdDate = formatDate(news.dateCreated);

        row.innerHTML = `
            <td>${news.id}</td>
            <td class="title-col">${news.title}</td>
            <td>${news.category || 'N/A'}</td>
            <td>${news.likes || 0}</td>
            <td>${updatedDate}</td>
            <td>${createdDate}</td>
            <td>
                <button class="action-btn" onclick="deleteNews('${news.id}')">Delete</button>
                <button class="action-btn" onclick="window.location.href='create-news.html?id=${news.id}'">Update</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
async function deleteNews(id) {
    if (!confirm('Are you sure you want to delete this news item?')) {
        return;
    }
    
    try {
        const response = await fetch(`https://btu-ex-2025-0bf797fecbae.herokuapp.com/news/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(id);
        if (!response.ok) {
            throw new Error(`Failed to delete news (Status: ${response.status})`);
        }

        const row = document.getElementById(`news-${id}`);
        if (row) {
            row.classList.add('fade-out');
            setTimeout(() => {
                row.remove();
            }, 500);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to delete news item. Please try again.');
    }
}