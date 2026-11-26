class NewUser {
  constructor(_email, _password, _userName) {
    this.email = _email;
    this.password = _password;
    this.userName = _userName;
  }
}

const registerForm = document.querySelector("form");
const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userPass = document.querySelector("#userPass");
const regMessage = document.querySelector("#regMessage");

registerForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const newUser = new NewUser(userEmail.value, userPass.value, userName.value);
  try {
    const response = await fetch(
      "https://ttz342bj-3001.eun1.devtunnels.ms/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      },
    );
    const data = await response.json();
    if (!response.ok) throw new Error(data);
    registerForm.style.display = "none";
    regMessage.textContent =
      "Registrazione completata, reindirizzamento al login...";
    setTimeout(() => window.location.replace("login.html"), 1500);
    console.log(response.status, data);
  } catch (err) {
    regMessage.textContent = err;
    registerForm.reset();
  }
});
