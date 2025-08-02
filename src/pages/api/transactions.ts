import { createClient } from '@supabase/supabase-js';
import type { APIRoute } from 'astro';

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
  { db: { schema: 'keuangan' } }
);

// ✅ GET: List with pagination
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from('transaction')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    data,
    meta: {
      page,
      limit,
      total: count,
      totalPages: count ? Math.ceil(count / limit) : null
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

// ✅ POST: Insert new transaction
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const { data, error } = await supabase
    .from('transaction')
    .insert([body])
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
};

// ✅ PUT: Update transaction by ID (expects `id` in body)
export const PUT: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return new Response(JSON.stringify({ error: 'Missing transaction id' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('transaction')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
