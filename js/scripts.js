const TOKEN_BOT = "5965616492:AAH0pBrfAytjO4HtJSqLxHqh8E3yeo64ra4";
const chat_id = "-781957560";

const modalMsg = new bootstrap.Modal(document.querySelector("#exampleModal"));
const modalSucces = new bootstrap.Modal(document.querySelector("#modalSucces"));
const modalError = new bootstrap.Modal(document.querySelector("#modalError"));
const contacts = document.querySelector("#contact");
const contactButton = document.querySelector("#contact-btn");

const bodyModalSucces = modalSucces._element.querySelector(".modal-body");

const handleScrollContact = () => {
  contacts.scrollIntoView({ block: "center", behavior: "smooth" });
};

contactButton.addEventListener("click", handleScrollContact);

const toggleModalMsg = () => {
  modalMsg.toggle();
};

const toggleModalSucces = () => {
  modalSucces.toggle();
};

const toggleModalError = () => {
  modalError.toggle();
};

const changeButton = document.querySelector("#change-data");
changeButton.addEventListener("click", (e) => {
  toggleModalSucces();
  toggleModalMsg();
});

const changeButtonError = document.querySelector("#change-data-error");
changeButtonError.addEventListener("click", (e) => {
  toggleModalError();
  toggleModalMsg();
});

const contactButtonError = document.querySelector("#contact-error");
contactButtonError.addEventListener("click", (e) => {
  toggleModalError();
  handleScrollContact();
});

const buttonMsg = document.querySelectorAll("#modal-msg");
buttonMsg.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    toggleModalMsg();
  });
});

const formMsg = document.querySelector("#form-msg");
formMsg.addEventListener("submit", (event) => {
  event.preventDefault();
  const { target } = event;
  const inputName = target.name.value;
  const inputPhone = target.phone.value;
  const textAreaWork = target.work.value;
  const inputAddress = target.address.value;

  const msg = `<b>Имя:</b> ${inputName}\n<b>Телефон:</b> ${inputPhone}\n<b>Адрес:</b> ${inputAddress}\n<b>Текст:</b> ${textAreaWork}`;
  const encodeMsg = encodeURI(msg);

  const result = fetch(
    `https://api.telegram.org/bot${TOKEN_BOT}/sendMessage?chat_id=1&parse_mode=html&text=${encodeMsg}`
  );
  result
    .then((r) => {
      return r.json();
    })
    .then((res) => {
      console.log();
      if (res.ok) {
        bodyModalSucces.innerHTML = `<p style='font-size: 24px; text-align: center;'>Ваша заявка успешно сформирована.</p><p style='font-size: 18px'>В ближайшее время мы свяжемся для уточнение деталей.</p><p><b>Пожалуйста, проверьте введенные данные</b></p><p><b>Имя:</b> ${inputName}</p><p><b>Телефон:</b> ${inputPhone}</p>`;
        toggleModalMsg();
        toggleModalSucces();
      } else {
        toggleModalMsg();
        toggleModalError();
      }
    });
});
