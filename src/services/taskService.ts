import { v4 as uuidv4 } from 'uuid';
import { Task } from '../types';
import { Database } from '../db/database';

export class TaskService {
  constructor(private db: Database) { }

  async createTask(taskData: Partial<Task>): Promise<Task> {
    // TODO: Implement task creation
    // 1. Generate UUID for the task
    // 2. Set default values (completed: false, is_deleted: false)
    // 3. Set sync_status to 'pending'
    // 4. Insert into database
    // 5. Add to sync queue
    taskData.id = uuidv4();

    await this.db.run(
      `INSERT INTO tasks (id, title, description, created_at, updated_at)
   VALUES (?, ?, ?, ?, ?)`,
      [
        taskData.id,
        taskData.title,
        taskData.description,
        new Date(),
        new Date()
      ]
    );

    const task = await this.db.get(
      `SELECT * FROM tasks WHERE id = ?;`,
      [taskData.id]
    );

    await this.db.run(
      `INSERT INTO sync_queue (id, task_id, operation,data, created_at)
   VALUES (?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        task.id,
        "create",
        task,
        new Date()
      ]
    );

    return task;

  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    // TODO: Implement task update
    // 1. Check if task exists
    // 2. Update task in database
    // 3. Update updated_at timestamp
    // 4. Set sync_status to 'pending'
    // 5. Add to sync queue
    throw new Error('Not implemented');
  }

  async deleteTask(id: string): Promise<boolean> {
    // TODO: Implement soft delete
    // 1. Check if task exists
    // 2. Set is_deleted to true
    // 3. Update updated_at timestamp
    // 4. Set sync_status to 'pending'
    // 5. Add to sync queue
    throw new Error('Not implemented');
  }

  async getTask(id: string): Promise<Task | null> {
    const task = await this.db.get(
      `SELECT * FROM tasks WHERE id = ?;`,
      [id]
    );
    if (!task) {
      return null;
    }
    else if (task.is_deleted) {
      return null;
    }
    else {
      task.created_at = new Date(task.created_at).toLocaleString();
      task.updated_at = new Date(task.updated_at).toLocaleString();
      return task;
    }

  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.db.all(
      `SELECT * FROM tasks WHERE is_deleted = 0;`
    );

    if (!tasks)
      return [];

    tasks.forEach(task => {
      task.created_at = new Date(task.created_at).toLocaleString();
      task.updated_at = new Date(task.updated_at).toLocaleString();
    });
    return tasks;

  }

  async getTasksNeedingSync(): Promise<Task[]> {
    // TODO: Get all tasks with sync_status = 'pending' or 'error'
    throw new Error('Not implemented');
  }
}