const username = document.getElementById('username');
const password = document.getElementById('password');
const form = document.getElementById('loginForm');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();

        if (username.value === '' || password.value === '') {
            alert('Completa los campos');
            return;
        }

        window.location.href = `login.html?username=${username.value}`;
    });
}

// Captura el username y permite generar un saludo al usuario cuando logea.
const nameSpan = document.getElementById('name');
if (nameSpan) {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('username');
    nameSpan.textContent = user;
}