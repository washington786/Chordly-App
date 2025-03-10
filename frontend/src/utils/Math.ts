export interface RangeOptions {
  inputVal: number;
  outputMin: number;
  outputMax: number;
  inputMin: number;
  inputMax: number;
}

export function mapRange(options: RangeOptions) {
  const { inputVal, outputMin, outputMax, inputMin, inputMax } = options;
  const result =
    ((inputVal - inputMin) * (outputMax - outputMin)) / (inputMax - inputMin) +
    outputMin;
  return result === Infinity ? 0 : result;
}
