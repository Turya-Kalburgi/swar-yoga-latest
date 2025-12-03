// Runtime JS wrapper used by the Node server. This file reads runtime env vars
// and exports simple async helpers. Keep this file JS so the existing server
// can import it without requiring a TypeScript compile step.
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const SUPABASE_AVAILABLE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

let supabase = null;
if (SUPABASE_AVAILABLE) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

export async function getVisions(filter = {}) {
  if (!supabase) throw new Error('Supabase client not initialized');
  let q = supabase.from('visions').select('*');
  if (filter.year) q = q.eq('year', Number(filter.year));
  if (filter.date) q = q.eq('date', String(filter.date));
  const { data, error } = await q.order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createVision(payload) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from('visions').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateVision(id, payload) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from('visions').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteVision(id) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('visions').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

// Generic helpers for other resources
export async function getResource(table, filter = {}) {
  if (!supabase) throw new Error('Supabase client not initialized');
  let q = supabase.from(table).select('*');
  if (filter.year) q = q.eq('year', Number(filter.year));
  if (filter.date) q = q.eq('date', String(filter.date));
  const { data, error } = await q.order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createResource(table, payload) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from(table).insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateResource(table, id, payload) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteResource(table, id) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export default supabase;
