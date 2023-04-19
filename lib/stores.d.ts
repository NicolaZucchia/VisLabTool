import type { Writable, Readable } from 'svelte/store';
import type { DOMWidgetModel } from '@jupyter-widgets/base';
export declare let df: Writable<Record<string, number[]>>;
export declare let predictions: Writable<[number[], number[]]>;
export declare let height: Writable<number>;
export declare let minPrediction: Readable<number>;
export declare let maxPrediction: Readable<number>;
export declare let size: Writable<number>;
/**
 * Note that when the cell containing the widget is re-run, a new model is
 * created. We don't want the former model to hang around. We don't want state
 * to carry over when the widget is re-run. That's why all of the stores are
 * initialized in this function, which is called when the widget's cell is run.
 * @param model backbone model that contains state synced between Python and JS
 */
export declare function setStores(model: DOMWidgetModel): void;
