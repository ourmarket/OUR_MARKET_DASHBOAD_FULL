export function firstLetterCapitalized(arr) {
  // Verificar si el argumento es un array
  if (!Array.isArray(arr)) {
    throw new Error("El argumento debe ser un array");
  }

  // Iterar sobre cada elemento del array y capitalizar la primera letra
  const resultado = arr.map((elemento) => {
    // Verificar si el elemento es una cadena de texto
    if (typeof elemento !== "string") {
      throw new Error(
        "Todos los elementos del array deben ser cadenas de texto"
      );
    }

    // Capitalizar la primera letra y concatenar el resto de la cadena
    return elemento.charAt(0).toUpperCase() + elemento.slice(1);
  });

  return resultado;
}
