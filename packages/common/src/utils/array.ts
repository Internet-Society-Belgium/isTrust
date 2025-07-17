export function improve_array<T>(data: T[] | undefined, value: T | undefined) {
  if (value === undefined || value === "") return data;

  const array = data || [];
  if (!array.includes(value)) {
    array.push(value);
  }
  return array;
}
