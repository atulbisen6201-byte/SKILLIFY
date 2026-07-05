import { goalRepository } from '../repositories/goal.repository.js';

export async function getGoals(userId: string) {
  return goalRepository.findManyByUserId(userId);
}

export async function createGoal(userId: string, title: string) {
  return goalRepository.create(userId, title);
}

export async function updateGoal(id: string, userId: string, data: { title?: string; completed?: boolean }) {
  return goalRepository.update(id, userId, data);
}

export async function deleteGoal(id: string, userId: string) {
  return goalRepository.delete(id, userId);
}
