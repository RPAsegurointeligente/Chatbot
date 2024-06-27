const OpenAI = require('openai');
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.KEY});

async function cancelRun(idthread,idrun) {
  const run = await openai.beta.threads.runs.cancel(
    idthread,
    idrun
  );

  console.log("se cancelo ejecucion",run);
}

module.exports = cancelRun;