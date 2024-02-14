import Replicate from 'replicate'
import dotenv from 'dotenv'
dotenv.config()

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  userAgent: 'https://www.npmjs.com/package/create-replicate'
})
const model = 'ai-forever/kandinsky-2:601eea49d49003e6ea75a11527209c4f510a93e2112c969d548fbb45b9c4f19f'
const input = {
  prompt: 'red cat, 4k photo',
  scheduler: 'p_sampler',
  prior_steps: '5',
  guidance_scale: 4,
  prior_cf_scale: 4,
  num_inference_steps: 100,
}

console.log({ model, input })
console.log('Running...')
const output = await replicate.run(model, { input })
console.log('Done!', output)
