import { data } from './data';

let id = 1;
function incrementIds(entry: any) {
  entry.id = id++;

  if (entry.children) {
    entry.children = entry.children.map((childEntry: any) => incrementIds(childEntry));
  } else {
    entry.children = [];
  }

  return entry;
}

export function getContent(): string {
  const x = data.content.map(incrementIds);

  return JSON.stringify({ content: x, checkedItems: {} });
}
