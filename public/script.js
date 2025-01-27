document.getElementById('input1').addEventListener('input', async function() {
    const inputText = this.value;
    
    // Отправка запроса на сервер
    const response = await fetch('http://localhost:3000/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: inputText })
    });
    
    const result = await response.json();
    document.getElementById('input2').value = result.data;
});
