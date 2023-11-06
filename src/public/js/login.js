const form = document.getElementById('loginForm');

form.addEventListener('submit', e=>{
    e.preventDefault();
    console.log('hola')
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(result => {
        if (result.status === 200) {
                window.location.replace('/user-profile');
        } else {
            console.log('Error al iniciar sesion.');
        }
    });
});