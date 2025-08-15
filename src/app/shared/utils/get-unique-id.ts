export const getUniqueId = (id: string, existingIds: string[]): string => {
  let newId = id;
  let counter = 1;
  while (existingIds.includes(newId)) {
    newId = `${id}-${counter}`;
    counter++;
  }
  return newId;
};
