import mongodbService from '../services/mongodbService';

/**
 * Migrate all localStorage data to MongoDB
 * This script should be run once after MongoDB is set up
 */
export const migrateLocalStorageToMongoDB = async (userId) => {
  try {
    console.log('🔄 Starting migration to MongoDB...');
    const migrationResults = {
      visions: 0,
      goals: 0,
      tasks: 0,
      todos: 0,
      mywords: 0,
      health: 0,
      errors: []
    };

    // Migrate Visions
    try {
      const visionsKey = `sadhaka_visions_${userId}`;
      const visionsData = JSON.parse(localStorage.getItem(visionsKey) || '[]');
      
      for (const vision of visionsData) {
        try {
          await mongodbService.visionService.create({
            ...vision,
            userId,
            _id: vision.id || undefined
          });
          migrationResults.visions++;
        } catch (error) {
          console.warn(`⚠️ Failed to migrate vision ${vision.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${migrationResults.visions} visions`);
    } catch (error) {
      migrationResults.errors.push(`Visions: ${error.message}`);
    }

    // Migrate Goals
    try {
      const goalsKey = `sadhaka_goals_${userId}`;
      const goalsData = JSON.parse(localStorage.getItem(goalsKey) || '[]');
      
      for (const goal of goalsData) {
        try {
          await mongodbService.goalService.create({
            ...goal,
            userId,
            _id: goal.id || undefined
          });
          migrationResults.goals++;
        } catch (error) {
          console.warn(`⚠️ Failed to migrate goal ${goal.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${migrationResults.goals} goals`);
    } catch (error) {
      migrationResults.errors.push(`Goals: ${error.message}`);
    }

    // Migrate Tasks
    try {
      const tasksKey = `sadhaka_tasks_${userId}`;
      const tasksData = JSON.parse(localStorage.getItem(tasksKey) || '[]');
      
      for (const task of tasksData) {
        try {
          await mongodbService.taskService.create({
            ...task,
            userId,
            _id: task.id || undefined
          });
          migrationResults.tasks++;
        } catch (error) {
          console.warn(`⚠️ Failed to migrate task ${task.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${migrationResults.tasks} tasks`);
    } catch (error) {
      migrationResults.errors.push(`Tasks: ${error.message}`);
    }

    // Migrate Todos
    try {
      const todosKey = `sadhaka_todos_${userId}`;
      const todosData = JSON.parse(localStorage.getItem(todosKey) || '[]');
      
      for (const todo of todosData) {
        try {
          await mongodbService.todoService.create({
            ...todo,
            userId,
            _id: todo.id || undefined
          });
          migrationResults.todos++;
        } catch (error) {
          console.warn(`⚠️ Failed to migrate todo ${todo.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${migrationResults.todos} todos`);
    } catch (error) {
      migrationResults.errors.push(`Todos: ${error.message}`);
    }

    // Migrate MyWords (Affirmations)
    try {
      const mywordsKey = `sadhaka_mywords_${userId}`;
      const mywordsData = JSON.parse(localStorage.getItem(mywordsKey) || '[]');
      
      for (const word of mywordsData) {
        try {
          await mongodbService.mywordService.create({
            ...word,
            userId,
            _id: word.id || undefined
          });
          migrationResults.mywords++;
        } catch (error) {
          console.warn(`⚠️ Failed to migrate word ${word.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${migrationResults.mywords} mywords`);
    } catch (error) {
      migrationResults.errors.push(`MyWords: ${error.message}`);
    }

    // Migrate Health Tracker data
    try {
      const healthKey = `sadhaka_health_${userId}`;
      const healthData = JSON.parse(localStorage.getItem(healthKey) || '[]');
      
      for (const health of healthData) {
        try {
          await mongodbService.healthService.create({
            ...health,
            userId,
            _id: health.id || undefined
          });
          migrationResults.health++;
        } catch (error) {
          console.warn(`⚠️ Failed to migrate health record ${health.id}:`, error.message);
        }
      }
      console.log(`✅ Migrated ${migrationResults.health} health records`);
    } catch (error) {
      migrationResults.errors.push(`Health: ${error.message}`);
    }

    console.log('✅ Migration complete!');
    console.log('Migration Results:', migrationResults);
    
    return {
      success: true,
      message: 'All available data migrated to MongoDB',
      ...migrationResults
    };
  } catch (error) {
    console.error('❌ Migration error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
