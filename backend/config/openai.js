import OpenAI from 'openai'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is missing! Check your .env file.')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default openai
