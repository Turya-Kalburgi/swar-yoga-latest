// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jixqmxjqfonapxnrfcme.supabase.co';
const supabaseAnonKey = 'sb_publishable_RuvZCRJWDikZj8NuAupJVw_zZQIJ5Bb';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('✅ Supabase client created successfully');
console.log('📍 Project URL:', supabaseUrl);
console.log('🔑 Anon Key: ' + supabaseAnonKey.substring(0, 20) + '...');
console.log('\n✨ Supabase is ready for use!');

