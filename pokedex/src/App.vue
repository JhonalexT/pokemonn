<script setup>
import { obtenerPokemon, obtenerDebilidades, aleatorio } from "./Api/pokeapi.js"
import { coloresTipo } from "./Api/colores.js"
import { onMounted, ref, computed } from "vue"

const pokemon = ref(null)
const debil = ref([])

async function cargar() {
  const data = await obtenerPokemon(aleatorio())

  // Debilidades de todos los tipos del pokemon, sin repetir
  const tipos = await Promise.all(
    data.types.map((t) => obtenerDebilidades(t.type.url))
  )
  debil.value = [
    ...new Set(
      tipos.flatMap((t) => t.damage_relations.double_damage_from.map((d) => d.name))
    ),
  ]

  pokemon.value = data
}

// Degradado con los colores del pokemon (si tiene un solo tipo, termina en blanco)
const fondo = computed(() => {
  const colores = pokemon.value.types.map((t) => coloresTipo[t.type.name])
  return `linear-gradient(135deg, ${colores[0]}, ${colores[1] ?? "#fff"})`
})

function grito() {
  new Audio(pokemon.value.cries.latest).play()
}

onMounted(cargar)
</script>

<template>
  <p v-if="!pokemon">Cargando...</p>

  <div v-else class="pagina" :style="{ background: fondo }">
    <main class="contenido">
      <!-- Tarjeta -->
      <div class="tarjeta">
        <h2 class="nombre">{{ pokemon.name }}</h2>
        <img
          :src="pokemon.sprites.other['official-artwork'].front_default"
          :alt="pokemon.name"
          @click="grito"
        />
        <div class="medidas">
          <span>Altura: {{ pokemon.height / 10 }}m</span>
          <span>Peso: {{ pokemon.weight / 10 }}kg</span>
        </div>
      </div>

      <!-- Centro -->
      <section class="centro">
        <h1 class="numero"># {{ pokemon.id }}</h1>

        <h2>Tipos del pokemon</h2>
        <div class="chips">
          <span
            v-for="t in pokemon.types"
            :key="t.type.name"
            class="chip"
            :style="{ background: coloresTipo[t.type.name] }"
          >{{ t.type.name }}</span>
        </div>

        <h2>Debilidades del pokemon</h2>
        <div class="chips">
          <span
            v-for="d in debil"
            :key="d"
            class="chip"
            :style="{ background: coloresTipo[d] }"
          >{{ d }}</span>
        </div>

        <button class="boton" @click="cargar">Otro pokemon</button>
      </section>

      <!-- Estadísticas -->
      <section class="stats">
        <h2>Estadisticas</h2>
        <div v-for="s in pokemon.stats" :key="s.stat.name">
          <p>{{ s.stat.name }} : {{ s.base_stat }}/255</p>
          <div class="barra">
            <div class="relleno" :style="{ width: (s.base_stat / 255) * 100 + '%' }"></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style>
body { margin: 0; font-family: sans-serif; color: #222; }

.pagina { min-height: 100vh; }

.contenido {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 30px;
  padding: 30px;
  align-items: center;
}

/* Tarjeta */
.tarjeta {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 16px;
  text-align: center;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.nombre { margin: 0; text-transform: capitalize; }
.tarjeta img {
  width: 90%;
  max-height: 360px;
  object-fit: contain;
  align-self: center;
  cursor: pointer;
}
.medidas {
  display: flex;
  justify-content: space-between;
  font-style: italic;
  font-size: 1.3rem;
}

/* Centro */
.centro, .stats { text-align: center; }
.numero { font-size: 5rem; font-style: italic; margin: 0; }
.chips { display: flex; justify-content: center; gap: 20px; flex-wrap: wrap; }
.chip {
  color: #fff;
  padding: 6px 14px;
  border-radius: 4px;
  text-transform: uppercase;
  font-size: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
.boton {
  margin-top: 30px;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  background: #222;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

/* Estadísticas */
.stats p { margin: 14px 0 4px; font-weight: bold; text-transform: capitalize; }
.barra { background: rgba(255, 255, 255, 0.5); border-radius: 10px; height: 14px; overflow: hidden; }
.relleno { background: #222; height: 100%; }

@media (max-width: 900px) {
  .contenido { grid-template-columns: 1fr; }
}
</style>