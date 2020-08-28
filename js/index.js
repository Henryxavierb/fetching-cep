var cep = document.getElementById("cep");
const cepData = document.getElementById("cepData");
const btnCep = document.getElementById("consultarCep");

// Initial state
// btnCep.disabled = true;
// cepData.style.display = "none";

// ////////////////////////////////////////////////////////////////////////////
//
//  Input Managment
//
// ////////////////////////////////////////////////////////////////////////////

cep.addEventListener("keyup", (event) => {
  const inputKey = event.key;
  const inputValue = event.target.value;

  // behaviorButton();
  cepFactory(inputKey).cepMask().mask;

  // function behaviorButton() {
  //   const isAvailableCep = inputValue?.length > 8;
  //   isAvailableCep ? (btnCep.disabled = false) : (btnCep.disabled = true);
  // }
});

document.querySelector("#form").addEventListener("submit", (event) => {
  event.preventDefault();

  cepFactory()
    .fetchDataByCep()
    .then((response) => response.json())
    .then((data) => {
      const cepResponse = JSON.stringify(data);
      const transformCepAnObject = JSON.parse(cepResponse);

      setTimeout(() => {
        document.querySelectorAll(".infoCep").forEach((element) => {
          const getKeyElement = element.querySelector("span");

          const getKeyValue = getKeyElement.textContent
            .toLocaleLowerCase()
            .replace(":", "");

          const getReplacedElement = element.querySelector("div");

          console.log(transformCepAnObject[getKeyValue]);
          getReplacedElement.innerHTML = transformCepAnObject[getKeyValue];
        });
      }, 2000);
    });
});

// ////////////////////////////////////////////////////////////////////////////
//
//  CEP Factory
//
// ////////////////////////////////////////////////////////////////////////////

function cepFactory(inputKey) {
  const isDeleteKey = inputKey === "Backspace" || inputKey === "Delete";

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
    const cepUrlService = `https://viacep.com.br/ws/${57073716}/json`;
    // const cepUrlService = `https://viacep.com.br/ws/${cepMask().remove}/json`;

    return ({ data } = await fetch(cepUrlService));
  }

  return { cepMask, splitCep, fetchDataByCep };
}

// ////////////////////////////////////////////////////////////////////////////
//
//  Insert data
//
// ////////////////////////////////////////////////////////////////////////////
