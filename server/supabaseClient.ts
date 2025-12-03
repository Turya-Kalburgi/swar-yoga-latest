/*
  TypeScript Supabase client source (development-only source file).
  This file is not imported by Node directly; a small runtime JS wrapper
  `server/supabaseClient.js` is used by the running server. The TS file
  is included here for clarity, type-safety, and future compilation.

  Environment variables expected (server only):
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE_KEY

  NOTE: Do NOT commit real keys. Use `server/.env.example` as a template.
*/
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const SUPABASE_AVAILABLE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

let supabase: SupabaseClient | null = null;
if (SUPABASE_AVAILABLE) {
  supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
  });
}

export async function getVisions(filter: { year?: string | number; date?: string } = {}) {
  if (!supabase) throw new Error('Supabase client not initialized');
  let q = supabase.from('visions').select('*');
  if (filter.year) q = q.eq('year', Number(filter.year));
  if (filter.date) q = q.eq('date', String(filter.date));
  const { data, error } = await q.order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createVision(payload: any) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from('visions').insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateVision(id: number | string, payload: any) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from('visions').update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteVision(id: number | string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from('visions').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export default supabase;

// Generic helpers for other resources
export async function getResource(table: string, filter: { year?: string | number; date?: string } = {}) {
  if (!supabase) throw new Error('Supabase client not initialized');
  let q = supabase.from(table).select('*');
  if (filter.year) q = q.eq('year', Number(filter.year));
  if (filter.date) q = q.eq('date', String(filter.date));
  const { data, error } = await q.order('id', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createResource(table: string, payload: any) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from(table).insert([payload]).select().single();
  if (error) throw error;
  return data;
}

export async function updateResource(table: string, id: number | string, payload: any) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteResource(table: string, id: number | string) {
  if (!supabase) throw new Error('Supabase client not initialized');
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}
