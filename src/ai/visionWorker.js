import { pipeline, env } from '@huggingface/transformers';

env.allowLocalModels = false;

// A general-purpose, publicly available on-device vision model. This is
// NOT a medical device or diagnostic tool — see the disclaimer shown in
// the Scan Injury UI. It demonstrates genuine on-device inference (no
// image ever leaves the browser) rather than providing clinical output.
const MODEL_ID = 'Xenova/vit-base-patch16-224';

let classifierPromise = null;

function getClassifier(progressCallback) {
  if (!classifierPromise) {
    classifierPromise = pipeline('image-classification', MODEL_ID, {
      progress_callback: progressCallback,
    });
  }
  return classifierPromise;
}

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === 'load') {
    try {
      await getClassifier((p) => self.postMessage({ type: 'progress', payload: p }));
      self.postMessage({ type: 'ready' });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err?.message || String(err) });
    }
    return;
  }

  if (type === 'classify') {
    try {
      const classifier = await getClassifier();
      const result = await classifier(payload.imageDataUrl, { topk: 5 });
      self.postMessage({ type: 'result', payload: result });
    } catch (err) {
      self.postMessage({ type: 'error', payload: err?.message || String(err) });
    }
  }
};
