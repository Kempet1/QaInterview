const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let client;

function getSupabase() {
  if (!client) {
    if (!url || !secretKey) {
      throw new Error('SUPABASE_URL dan SUPABASE_SECRET_KEY wajib dikonfigurasi');
    }
    client = createClient(url, secretKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return client;
}

module.exports = { getSupabase };
