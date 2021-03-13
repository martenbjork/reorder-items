const fs = require("fs");
const results = require("./performance/generated/results.json");

let text = "";

text += "<h2>Performance:</h2>\n";
text += "<ul>\n";

results.forEach((result) => {
  text += `\t<li>${result.name}: ${result.duration}</li>\n`;
});

text += "</ul>";

fs.writeFileSync("./docs/index.html", text);
