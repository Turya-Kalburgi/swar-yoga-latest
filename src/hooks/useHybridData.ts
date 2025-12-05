import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import mongodbService from '../services/mongodbService';
import { visionAPI, goalsAPI, tasksAPI, todosAPI, dailyWordsAPI } from '../utils/database';

/**
 * Hybrid hook that tries MongoDB first, falls back to localStorage
 * This allows gradual migration without breaking existing functionality
 */
export const useHybridData = (dataType: 'visions' | 'goals' | 'tasks' | 'todos' | 'mywords' | 'health') => {
  const { user } = useContext(AuthContext) as any;
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);

    try {
      let fetchedData = [];

      // Try MongoDB first
      try {
        if (dataType === 'visions') {
          const response = await mongodbService.visionService.getAll(user.id);
          fetchedData = response.data;
        } else if (dataType === 'goals') {
          const response = await mongodbService.goalService.getAll(user.id);
          fetchedData = response.data;
        } else if (dataType === 'tasks') {
          const response = await mongodbService.taskService.getAll(user.id);
          fetchedData = response.data;
        } else if (dataType === 'todos') {
          const response = await mongodbService.todoService.getAll(user.id);
          fetchedData = response.data;
        } else if (dataType === 'mywords') {
          const response = await mongodbService.mywordService.getAll(user.id);
          fetchedData = response.data;
        }

        if (fetchedData && fetchedData.length > 0) {
          setData(fetchedData);
          return;
        }
      } catch (mongoError) {
        console.warn(`MongoDB fetch failed for ${dataType}, falling back to localStorage:`, mongoError);
      }

      // Fallback to localStorage
      if (dataType === 'visions') {
        fetchedData = await visionAPI.getAll();
      } else if (dataType === 'goals') {
        fetchedData = await goalsAPI.getAll();
      } else if (dataType === 'tasks') {
        fetchedData = await tasksAPI.getAll();
      } else if (dataType === 'todos') {
        fetchedData = await todosAPI.getAll();
      } else if (dataType === 'mywords') {
        fetchedData = await dailyWordsAPI.getAll();
      }

      setData(fetchedData || []);
    } catch (err) {
      console.error(`Error fetching ${dataType}:`, err);
      setError(`Failed to load ${dataType}`);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id, dataType]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Create operation with MongoDB + localStorage sync
 */
export const createHybridData = async (
  dataType: 'visions' | 'goals' | 'tasks' | 'todos' | 'mywords',
  payload: any,
  userId: string
) => {
  const enrichedPayload = { ...payload, userId };

  let created = null;

  // Try MongoDB first
  try {
    if (dataType === 'visions') {
      const response = await mongodbService.visionService.create(enrichedPayload);
      created = response.data;
    } else if (dataType === 'goals') {
      const response = await mongodbService.goalService.create(enrichedPayload);
      created = response.data;
    } else if (dataType === 'tasks') {
      const response = await mongodbService.taskService.create(enrichedPayload);
      created = response.data;
    } else if (dataType === 'todos') {
      const response = await mongodbService.todoService.create(enrichedPayload);
      created = response.data;
    } else if (dataType === 'mywords') {
      const response = await mongodbService.mywordService.create(enrichedPayload);
      created = response.data;
    }

    return created;
  } catch (mongoError) {
    console.warn(`MongoDB create failed for ${dataType}, falling back to localStorage:`, mongoError);

    // Fallback to localStorage
    if (dataType === 'visions') {
      return await visionAPI.create(payload);
    } else if (dataType === 'goals') {
      return await goalsAPI.create(payload);
    } else if (dataType === 'tasks') {
      return await tasksAPI.create(payload);
    } else if (dataType === 'todos') {
      return await todosAPI.create(payload);
    } else if (dataType === 'mywords') {
      return await dailyWordsAPI.create(payload);
    }
  }
};

/**
 * Update operation with MongoDB + localStorage sync
 */
export const updateHybridData = async (
  dataType: 'visions' | 'goals' | 'tasks' | 'todos' | 'mywords',
  id: string | number,
  payload: any
) => {
  // Try MongoDB first
  try {
    if (dataType === 'visions') {
      const response = await mongodbService.visionService.update(String(id), payload);
      return response.data;
    } else if (dataType === 'goals') {
      const response = await mongodbService.goalService.update(String(id), payload);
      return response.data;
    } else if (dataType === 'tasks') {
      const response = await mongodbService.taskService.update(String(id), payload);
      return response.data;
    } else if (dataType === 'todos') {
      const response = await mongodbService.todoService.update(String(id), payload);
      return response.data;
    } else if (dataType === 'mywords') {
      const response = await mongodbService.mywordService.update(String(id), payload);
      return response.data;
    }
  } catch (mongoError) {
    console.warn(`MongoDB update failed for ${dataType}, falling back to localStorage:`, mongoError);

    // Fallback to localStorage
    if (dataType === 'visions') {
      return await visionAPI.update(id as number, payload);
    } else if (dataType === 'goals') {
      return await goalsAPI.update(id as number, payload);
    } else if (dataType === 'tasks') {
      return await tasksAPI.update(id as number, payload);
    } else if (dataType === 'todos') {
      return await todosAPI.update(id as number, payload);
    } else if (dataType === 'mywords') {
      return await dailyWordsAPI.update(id as number, payload);
    }
  }
};

/**
 * Delete operation with MongoDB + localStorage sync
 */
export const deleteHybridData = async (
  dataType: 'visions' | 'goals' | 'tasks' | 'todos' | 'mywords',
  id: string | number
) => {
  // Try MongoDB first
  try {
    if (dataType === 'visions') {
      await mongodbService.visionService.delete(String(id));
    } else if (dataType === 'goals') {
      await mongodbService.goalService.delete(String(id));
    } else if (dataType === 'tasks') {
      await mongodbService.taskService.delete(String(id));
    } else if (dataType === 'todos') {
      await mongodbService.todoService.delete(String(id));
    } else if (dataType === 'mywords') {
      await mongodbService.mywordService.delete(String(id));
    }
  } catch (mongoError) {
    console.warn(`MongoDB delete failed for ${dataType}, falling back to localStorage:`, mongoError);

    // Fallback to localStorage
    if (dataType === 'visions') {
      await visionAPI.delete(id as number);
    } else if (dataType === 'goals') {
      await goalsAPI.delete(id as number);
    } else if (dataType === 'tasks') {
      await tasksAPI.delete(id as number);
    } else if (dataType === 'todos') {
      await todosAPI.delete(id as number);
    } else if (dataType === 'mywords') {
      await dailyWordsAPI.delete(id as number);
    }
  }
};
