export async function obtenerPokemon(id){

    try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon/"+id)
        const data  =await res.json()
        console.log(data);
        return data
    } catch (error) {
        console.log(error);
        
    }
}


export async function obtenerDebilidades(url){
    try {
        const res = await fetch(url)
        const data  = await  res.json()
        console.log(data);
        
        return data
    } catch (error) {
        console.log(error);
        
    }
  }
  export function aleatorio(){
    return Math.floor(Math.random()*500) + 1
}