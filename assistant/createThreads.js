const OpenAI =  require('openai') ;
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.KEY});

async function createthread() {
  const emptyThread = await openai.beta.threads.create();
  console.log(emptyThread);
  return emptyThread.id;
}

module.exports = createthread;