
function checkForm() {
  if(document.body.querySelector('.form').classList.contains('form__registration')) {
    const registerForm = document.querySelector('.form__registration');
    setRegisterFormListeners(registerForm)
  } else {
    const loginForm = document.querySelector('.form__login');
    setLoginFormListeners(loginForm)
  }
}

checkForm();

function Registration (name, email, password) {
  return fetch('http://localhost:4000/signup', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({name, email, password})
  })
  .then(res => {
    if (res.ok) {
      return res.text();
    }
  })
  .then(message=>{
    console.log(message)
  })
  .catch((err)=>{
    console.log(err)
  })
}

function login(email, password) {
  return fetch('http://localhost:4000/signin', {
    method: "POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({email, password})
  })
  .then(res=> {
    if (res.ok) {
      return res.text();
    }
  })
  .then(token=> {
    localStorage.setItem('token', token)
  })
  .catch(err=>{
    return Promise.reject(err)
  })
}

function setRegisterFormListeners(form) {
  const registerName = form.registerName;
  const registerEmail = form.registerEmail;
  const registerPassword = form.registerPassword;
  const registerFormSubmit = form.registerSubmit;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    Registration(registerName.value, registerEmail.value, registerPassword.value);
    form.reset();
  })
}

function setLoginFormListeners(form) {
  const loginEmail = form.loginEmail;
  const loginPassword = form.loginPassword;
  const loginFormSubmit = form.loginSubmit;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    login(loginEmail.value, loginPassword.value);
    form.reset();
  })
}


