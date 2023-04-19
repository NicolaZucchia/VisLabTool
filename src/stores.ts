import { writable, derived } from 'svelte/store';
import type { Writable, Readable } from 'svelte/store';
import type { DOMWidgetModel } from '@jupyter-widgets/base';

/**
 * Adapted from https://github.com/cabreraalex/widget-svelte-cookiecutter
 *
 * @param name_ Name of the variable in the model. This is the same as the
 *              name of the corresponding Python variable in widget.py
 * @param value_ Default value
 * @param model backbone model containing state synced between Python and JS
 * @returns Svelte store that is synced with the model.
 */
function createSyncedWidget<T>(
  name_: string,
  value_: T,
  model: DOMWidgetModel
): Writable<T> {
  const name: string = name_;
  const internalWritable: Writable<T> = writable(value_);

  const modelValue = model.get(name);
  if (modelValue !== undefined) {
    internalWritable.set(modelValue);
  }

  // when the model changes, update the store
  model.on('change:' + name, () => internalWritable.set(model.get(name)), null);

  return {
    // when the store changes, update the model
    set: (v: T) => {
      internalWritable.set(v);
      if (model) {
        model.set(name, v);
        model.save_changes();
      }
    },
    subscribe: internalWritable.subscribe,
    update: (func: (v: T) => T) => {
      internalWritable.update((v: T) => {
        const output = func(v);
        if (model) {
          model.set(name, output);
          model.save_changes();
        }
        return output;
      });
    },
  };
}

export let df: Writable<Record<string, number[]>>;
export let predictions: Writable<[number[], number[]]>;
export let height: Writable<number>;
export let minPrediction: Readable<number>;
export let maxPrediction: Readable<number>;
export let size: Writable<number>;

/**
 * Note that when the cell containing the widget is re-run, a new model is
 * created. We don't want the former model to hang around. We don't want state
 * to carry over when the widget is re-run. That's why all of the stores are
 * initialized in this function, which is called when the widget's cell is run.
 * @param model backbone model that contains state synced between Python and JS
 */
export function setStores(model: DOMWidgetModel): void {
  df = createSyncedWidget<Record<string, number[]>>('df', {}, model);
  predictions = createSyncedWidget<[number[], number[]]>(
    'predictions',
    [[], []],
    model
  );
  height = createSyncedWidget<number>('height', 600, model);
  size = createSyncedWidget<number>('size', 0, model);
  minPrediction = derived(predictions, ($predictions) =>
    Math.min(...$predictions[0], ...$predictions[1])
  );
  maxPrediction = derived(predictions, ($predictions) =>
    Math.max(...$predictions[0], ...$predictions[1])
  );
}
