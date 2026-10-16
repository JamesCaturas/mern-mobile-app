import { api } from '../lib/api';

// The Day 2 task shape (title, completed, priority, owner) stays in this file.
// The rest of the app only sees { id, name, done, urgent, ownerId }.
export function mapTask(raw) {
  return {
    id: raw._id,
    name: raw.title,
    done: raw.completed,
    urgent: raw.priority === 'high',
    ownerId: raw.owner,
  };
}

// The Day 2 route returns everyone's tasks, so the list is filtered to its owner here.
export async function fetchItems(ownerId) {
  const response = await api.get('/tasks', { params: { limit: 100, order: 'asc' } });
  return response.data.data.map(mapTask).filter((item) => item.ownerId === ownerId);
}

export async function createItem(name) {
  const response = await api.post('/tasks', { title: name });
  return mapTask(response.data.data);
}

export async function setItemDone(id, done) {
  const response = await api.put(`/tasks/${id}`, { completed: done });
  return mapTask(response.data.data);
}

export async function deleteItem(id) {
  await api.delete(`/tasks/${id}`);
}
