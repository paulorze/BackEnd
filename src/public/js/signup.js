const form = document.getElementById('signupForm');

form.addEventListener('submit', e=>{
    e.preventDefault();
    console.log('hola');
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/signup', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 201) {
            window.location.replace('/');
        };
    });
});