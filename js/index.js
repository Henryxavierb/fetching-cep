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

  cep.value = managerKeyInputed(inputValue);

  behaviorButton();
  cepFactory(inputKey).cepMask().mask;
});

/* 
  Getting the last character instead of input key prevents that a valid input 
  value be deleted one time that user press a key, like 'shift'.
*/
function managerKeyInputed(currentInputValue) {
  const inputValueLength = currentInputValue.length;
  const lastCharacter = currentInputValue.charAt(inputValueLength - 1);

  return !isNaN(lastCharacter)
    ? currentInputValue
    : currentInputValue.substring(0, inputValueLength - 1);
}

function behaviorButton() {
  const isAvailableCep = cep.value?.length > 8;

  if (isAvailableCep) {
    btnCep.disabled = false;

    setTimeout(() => {
      cepFactory()
        .fetchDataByCep()
        .then((response) => response.json())
        .then((data) => setCepData(data));
    }, 500);
  } else {
    btnCep.disabled = true;
  }
}

document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();

  // Miss handle if is a valid cep
  setTimeout(() => {
    cepFactory()
      .fetchDataByCep()
      .then((response) => response.json())
      .then((data) => setCepData(data));
  }, 500);
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

    cepData.style.display = "flex";
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
