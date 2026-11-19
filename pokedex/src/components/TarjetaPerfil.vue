<script setup>
import {computed} from 'vue'
import {coloresTipo} from '../Api/colores.js'

const props = defineProps ({
    pokemon: {
        type: Object,
        required: true
    }
}) 

const imagen = computed(
    () => props.pokemon.sprites.other['official-artwork'].frot_default
)

const color = computed(
    () => coloresTipo[props.pokemon.types[0].type.name]
)

</script>
<template>
    <div class="tarjeta" >

    </div>
  <HelloWorld />
</template>
