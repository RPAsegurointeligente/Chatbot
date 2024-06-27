const openAI = require('openai')
require("dotenv").config();

const openai = new openAI.OpenAI({apiKey: process.env.KEY})

async function retrieveRun(){
    const retrieve = openai.beta.threads.runs.retrieve(threadid,runid)
    console.log('recuperndo el ejecutor')
    console.log('run', retrieve)
    console.log('fin del recuperado del ejecutor')
}

module.exports = retrieveRun;