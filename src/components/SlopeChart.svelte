<script lang="ts">
  import { predictions, minPrediction, maxPrediction, size } from '../stores';
  import { scaleLinear, scalePoint } from 'd3-scale';
  import { range } from 'd3-array';

  export let width: number;
  export let height: number;
  export let difference: number;

  const margin = { top: 20, right: 40, bottom: 40, left: 40 };
  const radius = 3;
  const tickSize = 6;

  $: x = scalePoint<number>()
    .domain([0,1])
    .range([margin.left, width - margin.right]);

  $: y = scaleLinear()
    .domain([$minPrediction,$maxPrediction])
    .nice()
    .range([height - margin.bottom, margin.top]);

  $: I = range($size);

  function includeLine(i: number, difference: number):boolean {
    return Math.abs($predictions[0][i]-$predictions[1][i]) >= difference;
  }
</script>

<svg {width} {height}>
  <!-- lines -->
  <g>
    {#each I as i}
      <line
        x1={x(0)}
        x2={x(1)}
        y1={y($predictions[0][i])}
        y2={y($predictions[1][i])}
        fill='none'
        stroke={includeLine(i, difference) ? 'black':'none'}
      />
    {/each}
  </g>

  <!-- x axis -->
  <g transform="translate(0,{height - margin.bottom})">
    {#each ['Model 1','Model 2'] as tick, i}
      <g transform="translate({x(i)})">
        <line y1={0} y2={tickSize} stroke="black" />
        <text
          y={tickSize + 2}
          text-anchor="middle"
          dominant-baseline="hanging"
          font-size="12"
        >
          {tick}
        </text>
      </g>
    {/each}
  </g>

  <!-- y axis -->
  <g transform="translate({margin.left})">
    {#each y.ticks() as tick}
      <g transform="translate(0,{y(tick)})">
        <line x1={0} x2={-tickSize} stroke="black" />
        <text
          x={-tickSize - 2}
          text-anchor="end"
          dominant-baseline="middle"
          font-size="12"
        >
          {tick}
        </text>
      </g>
    {/each}
  </g>
  <g transform="translate({width-margin.right})">
    {#each y.ticks() as tick}
      <g transform="translate(0,{y(tick)})">
        <line x1={0} x2={tickSize} stroke="black" />
        <text
          x={tickSize + 2}
          text-anchor="start"
          dominant-baseline="middle"
          font-size="12"
        >
          {tick}
        </text>
      </g>
    {/each}
  </g>
</svg>

<style>
</style>
