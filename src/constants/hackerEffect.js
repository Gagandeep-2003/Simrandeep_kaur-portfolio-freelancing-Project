const hackerEffect = ({ target: element }) => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWZXZ";

  let iteration = -2;
  const interval = setInterval(() => {
    element.innerText = element.innerText
      .split("")
      .map((_, index) => {
        if (index < iteration) return element.dataset.text[index];
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration > element.innerText.length) clearInterval(interval);

    iteration += 1 / 2;
  }, 45);
};

export default hackerEffect;
