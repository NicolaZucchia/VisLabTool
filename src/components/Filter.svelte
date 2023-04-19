<script lang="ts">
    import { predictions, minPrediction, maxPrediction, size } from '../stores';
      import { createEventDispatcher } from 'svelte';
  
      const dispatch = createEventDispatcher();
    let difference = 0; 
    function onFilter() {
      dispatch('filter',difference);
    }
  </script>
  
  <div>
    <label>
      Difference
      <input type="number" bind:value={difference}/>
    </label>
    <button on:click={onFilter}>
      Filter
    </button>
  </div>