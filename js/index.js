var cep = document.getElementById("cep");
const cepData = document.getElementById("cepData");
const btnCep = document.getElementById("consultarCep");

// Initial state
btnCep.disabled = true;
cepData.style.display = "none";

// ////////////////////////////////////////////////////////////////////////////
//
//  Input Managment
//
// ////////////////////////////////////////////////////////////////////////////

cep.addEventListener("keyup", (event) => {
  const inputKey = event.key;
  const inputValue = event.target.value;

  behaviorButton();
  cepFactory(inputKey).cepMask().mask;

  function behaviorButton() {
    const isAvailableCep = inputValue?.length > 8;

    if (isAvailableCep) {
      btnCep.disabled = false;

      setTimeout(() => {
        cepData.style.display = "flex";

        cepFactory()
          .fetchDataByCep()
          .then((response) => response.json())
          .then((data) => setCepData(data));
      }, 300);
    } else {
      btnCep.disabled = true;
    }
  }
});

document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();

  setTimeout(() => {
    cepData.style.display = "flex";
  }, 500);

  cepFactory()
    .fetchDataByCep()
    .then((response) => response.json())
    .then((data) => setCepData(data));
});

// ////////////////////////////////////////////////////////////////////////////
//
//  CEP Factory
//
// ////////////////////////////////////////////////////////////////////////////

function cepFactory(inputKey) {
  const isDeleteKey = inputKey === "Backspace" || inputKey === "Delete";

  if (isDeleteKey) cepData.style.display = "none";

  function splitCep() {
    const getFirstEach = cep.value.slice(0, 5);
    const getSecondEach = cep.value.slice(6, 9);

    return { getFirstEach, getSecondEach };
  }

  function cepMask() {
    const firstEach = splitCep().getFirstEach;
    const secondEach = splitCep().getSecondEach;

    if (cep.value.length === 6) {
      const newInput = `${firstEach}-${inputKey}${secondEach}`;

      cep.value = isDeleteKey ? firstEach : newInput;
    }

    return { mask: cep.value, remove: cep.value.replace("-", "") };
  }

  async function fetchDataByCep() {
    const cepUrlService = `https://viacep.com.br/ws/${cepMask().remove}/json`;

    return ({ data } = await fetch(cepUrlService));
  }

  return { cepMask, splitCep, fetchDataByCep };
}

// ////////////////////////////////////////////////////////////////////////////
//
//  Insert data
//
// ////////////////////////////////////////////////////////////////////////////

function setCepData(cepData) {
  document.querySelectorAll(".infoCep").forEach((element) => {
    const getKeyElement = element.querySelector("span");

    const getKeyValue = getKeyElement.textContent.toLocaleLowerCase();
    const keyValueFormated = getKeyValue.replace(":", "").replace(" ", "");

    const getReplacedElement = element.querySelector("div");

    return (getReplacedElement.innerHTML =
      cepData[keyValueFormated] || "Não possui");
  });
}
