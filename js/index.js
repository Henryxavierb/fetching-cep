var cep = document.getElementById("cep");
const cepData = document.getElementById("cepData");
var inputLabel = document.getElementById("inputLabel");
const btnCep = document.getElementById("consultarCep");

btnCep.disabled = true;
cepData.style.display = "none";

cep.addEventListener("keyup", (event) => {
  const inputKey = event.key;
  const inputValue = event.target.value;

  handleButton().changeLayoutButtonIfIsAvaliable(inputValue);
  cep.value = cepFactory(inputKey).managerKeyInputed(inputValue);
});

document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();
  const customizeFormatCep = cep.value.replace("-", "");

  handleButton().onSubmit(customizeFormatCep);
});

function cepFactory(inputKey) {
  const isDeleteKey = inputKey === "Backspace" || inputKey === "Delete";
  if (isDeleteKey) cepData.style.display = "none";

  function splitCep(inputValue) {
    const getFirstEach = inputValue.slice(0, 5);
    const getSecondEach = inputValue.slice(6, 9);

    return { getFirstEach, getSecondEach };
  }

  function handleCepMask(inputValue) {
    const firstEach = splitCep(inputValue).getFirstEach;
    const secondEach = splitCep(inputValue).getSecondEach;

    const newInput = `${firstEach}-${inputKey}${secondEach}`;

    if (inputValue.length === 6) {
      return isDeleteKey ? inputValue : newInput;
    }

    return inputValue.length === 7 && isDeleteKey ? firstEach : inputValue;
  }

  function managerKeyInputed(currentInputValue) {
    const inputValueLength = currentInputValue.length;
    const lastCharacter = currentInputValue.charAt(inputValueLength - 1);

    const handleInput = !isNaN(lastCharacter)
      ? currentInputValue
      : currentInputValue.substring(0, inputValueLength - 1);

    return handleCepMask(handleInput);
  }

  async function fetchDataByCep(cep) {
    const cepUrlService = `https://viacep.com.br/ws/${handleCepMask(cep)}/json`;

    return ({ data } = await fetch(cepUrlService));
  }

  return { splitCep, handleCepMask, fetchDataByCep, managerKeyInputed };
}

function handleButton() {
  function onSubmit(value) {
    btnCep.disabled = true;
    btnCep.querySelector("span").textContent = "Loading...";

    setTimeout(() => {
      cepFactory()
        .fetchDataByCep(value)
        .then((response) => response.json())
        .then((cepResponse) => {
          setCepData(cepResponse);

          btnCep.disabled = false;
          cepData.style.display = "flex";
          btnCep.querySelector("span").textContent = "Consultar";
        });
    }, 500);
  }

  function changeLayoutButtonIfIsAvaliable(value) {
    if (value.length < 9) {
      btnCep.disabled = true;
      inputLabel.style.color = "#55acee";
      cep.style.border = "1px solid #55acee";
      btnCep.style.backgroundColor = "#90caf9";
    } else {
      btnCep.disabled = false;
      inputLabel.style.color = "#43a047";
      cep.style.border = "1px solid #43a047";
      btnCep.style.backgroundColor = "#81c784";
    }
  }

  return { onSubmit, changeLayoutButtonIfIsAvaliable };
}

function setCepData(cepData) {
  document.querySelectorAll(".infoCep").forEach((element) => {
    const getKeyElement = element.querySelector("span");
    const getReplacedElement = element.querySelector("div");

    const getKeyValue = getKeyElement.textContent.toLocaleLowerCase();

    const removeKeysComas = getKeyValue.replace(":", "");
    const removeKeysSpaces = removeKeysComas.replace(" ", "");

    /* Specifics CEPs, like 69685-000,  don't have some attributes. */
    return (getReplacedElement.innerHTML =
      cepData[removeKeysSpaces] || "Não possui");
  });
}
