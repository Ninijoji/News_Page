document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    if (newsId) {
        document.querySelector('h1').textContent = 'Update News';
        fetchNewsData(newsId);
    }
});


function validateForm() {
    const requiredFields = ['title', 'description', 'category', 'editorFirstName', 'editorLastName'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const errorSpan = document.getElementById(`${field}-error`);
        
        if (!element.value.trim()) {
            element.classList.add('invalid');
            if (errorSpan) {
                errorSpan.textContent = 'This field is required';
            } else {
                const span = document.createElement('span');
                span.id = `${field}-error`;
                span.className = 'error-message';
                span.textContent = 'This field is required';
                element.parentNode.appendChild(span);
            }
            isValid = false;
        } else {
            element.classList.remove('invalid');
            if (errorSpan) {
                errorSpan.textContent = '';
            }
        }
    });
    
    return isValid;
}

async function fetchNewsData(id) {
    try {
        const response = await fetch(`https://btu-ex-2025-0bf797fecbae.herokuapp.com/news/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const news = await response.json();
        
        
        document.getElementById('title').value = news.title;
        document.getElementById('description').value = news.description;
        document.getElementById('category').value = news.category;
        document.getElementById('editorFirstName').value = news.editorFirstName;
        document.getElementById('editorLastName').value = news.editorLastName;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function handleSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        category: document.getElementById('category').value,
        editorFirstName: document.getElementById('editorFirstName').value.trim(),
        editorLastName: document.getElementById('editorLastName').value.trim(),
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString()
    };
    
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');
    
    try {
        const url = 'https://btu-ex-2025-0bf797fecbae.herokuapp.com/news' + (newsId ? `/${newsId}` : '');
        const method = newsId ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error(`Failed to ${newsId ? 'update' : 'create'} news (Status: ${response.status})`);
        }
        
        const result = await response.json();
        console.log('Server response:', result);  
        
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error:', error);
        alert(`Failed to ${newsId ? 'update' : 'create'} news item. Please check your input and try again.`);
    }
}