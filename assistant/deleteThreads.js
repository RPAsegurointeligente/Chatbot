const OpenAI =  require('openai') ;
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.KEY});

async function deleteThreads(id) {
  const response = await openai.beta.threads.del(id);

  console.log(response);
}

module.exports = deleteThreads;