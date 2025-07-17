export function addNewValue(data: string[] | undefined, value: string) {
  value = value.trim();
  if (value === "") return data;

  const array = data || [];
  if (!array.includes(value)) {
    array.push(value);
  }
  return array;
}
