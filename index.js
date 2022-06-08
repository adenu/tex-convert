const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.resolve(__dirname, "test.html"), "utf8");

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

require("mathjax")
  .init({
    loader: { load: ["input/tex", "output/chtml"] },
    tex: {
      inlineMath: [
        ["$$$", "$$$"],
        ["\\(", "\\)"],
      ],
    },
  })
  .then((MathJax) => {
    startConversion();
  })
  .catch((err) => console.log(err.message));

const transform = (formula) => {
  const chtml = MathJax.tex2chtml(formula, { display: true });
  return MathJax.startup.adaptor.outerHTML(chtml);
};

const startConversion = () => {
  const dom = new JSDOM(html);

  const formulasTex = [];

  let formulas = dom.window.document.querySelectorAll("yduqs-caixa-formula");

  formulas.forEach((formula) => {
    const formulaText = formula.getAttribute("formula");
    const formulaFinal = transform(formulaText);

    let fullBlock = dom.window.document.createElement("div");
    fullBlock.appendChild(formula);
    let blockCode = fullBlock.innerHTML;
    

    const replaced = html.replace(blockCode, formulaFinal);

    console.log(blockCode.toString());

    /* fs.writeFile("./test2.html", replaced, "utf-8", function (err) {
      console.log('fez naum');
    }); */

  });
};
