import { pipeline, TextStreamer, env } from '@huggingface/transformers';

// Always fetch from the HF Hub CDN rather than expecting local model files.
env.allowLocalModels = false;

// NOTE: 'Xenova/Qwen1.5-0.5B-Chat' looks correct but is broken with this
// library version — it was converted for transformers.js v2 and the v3/v4
// loader requests a renamed ONNX file (decoder_model_merged_quantized.onnx)
// that repo doesn't have, causing a silent 404. onnx-community's repo is
// the one actually maintained for the current loader.
const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct';

let generatorPromise = null;

function getGenerator(progressCallback) {
  if (!generatorPromise) {
    generatorPromise = pipeline('text-generation', MODEL_ID, {
      dtype: 'q4',
      progress_callback: progressCallback,
    });
  }
  return generatorPromise;
}

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === 'load') {
    try {
      await getGenerator((p) => self.postMessage({ type: 'progress', payload: p }));
      self.postMessage({ type: 'ready' });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err?.message || String(err) });
    }
    return;
  }

  if (type === 'generate') {
    try {
      const generator = await getGenerator();
      let fullText = '';

      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: (token) => {
          fullText += token;
          self.postMessage({ type: 'token', payload: token });
        },
      });

      await generator(payload.messages, {
        max_new_tokens: 220,
        temperature: 0.6,
        top_p: 0.9,
        do_sample: true,
        streamer,
      });

      self.postMessage({ type: 'done', payload: fullText });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err?.message || String(err) });
    }
  }
};
