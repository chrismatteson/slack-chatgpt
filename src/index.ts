import { HandleRequest, HttpRequest, HttpResponse} from "@fermyon/spin-sdk"
import { Configuration, CreateCompletionRequest, OpenAIApi } from "@ericlewis/openai";
import { Variable } from "eslint-scope";

const decoder = new TextDecoder();
const encoder = new TextEncoder()

interface Prompt {
  speaker: string,
  message: string
}

interface Conversation {
  id: string,
  prompts: Prompt[],
}

export const handleRequest: HandleRequest = async function(request: HttpRequest): Promise<HttpResponse> {
    let openai_key = ""
    if ( spinSdk.config.get("openai_key") == "env" ) {
      let kv = spinSdk.kv.openDefault();
      console.log("no config for openai_key, using kv")
      openai_key = decoder.decode(kv.get("openai_key"))
    } else {
      openai_key = spinSdk.config.get("openai_key")
    }
    let slack_token = ""
    if ( spinSdk.config.get("slack_token") == "env" ) {
      let kv = spinSdk.kv.openDefault();
      console.log("no config for slack_token, using kv")
      slack_token = decoder.decode(kv.get("slack_token"))
    } else {
      console.log("update slack_token from kv")
      slack_token = spinSdk.config.get("slack_token")
    }
    const parsedData = new URLSearchParams(decoder.decode(request.body));
    const request_token = parsedData.get("token")
    if (request_token != slack_token) {
      console.log("Provided token "+slack_token+" does not match configuration.")
      return { status: 500, body: encoder.encode("Invalid Slack Token").buffer }
    }

    let configuration = new Configuration({
      apiKey: openai_key,
    })
    let openai = new OpenAIApi(configuration);
    // Read the conversation ID and message from the request body.
    let p = parsedData.get("text") || "prompt missing"
    
    if (p == "prompt missing") {
      console.log("Prompt missing from request")
      return { status: 500, body: encoder.encode("Prompt missing from request").buffer }
    }

    let chat: Conversation;
    chat = { id: 'id', prompts: [] }
    chat.prompts.push({ speaker: 'user', message: p });
    console.log(chat)
    console.log("---")
    let prompt = generatePrompt(chat);
    console.log(prompt)
    // Send the entire conversation to OpenAI's API.

    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 350,
      })
      let text = completion.data.choices[0].text || "I guess the AI just gave up..."
      console.log(text)
      let response:JSON = <JSON><unknown>{ 
        "response_type": "in_channel",
        "text": text
      }
      console.log(JSON.stringify(response))
      return {
        status: 200,
        headers: { "Content-type": "application/json" },
        body: encoder.encode(JSON.stringify(response)).buffer
      }
    } catch (err) {
      console.log(JSON.stringify(err));
      return { status: 500, body: encoder.encode("You might want to ask ChatGPT to fix this...").buffer }
    }
    
    

}

function generatePrompt(chat: Conversation): string {
  let prompt = '';

  for (let i = 0; i < chat.prompts.length; i++) {
    prompt += `${chat.prompts[i].speaker}: ${chat.prompts[i].message}\n`;
  }

  prompt += 'AI: ';

  return prompt;
}