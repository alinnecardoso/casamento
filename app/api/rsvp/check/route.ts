import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get('name')?.trim()
  if (!name || name.length < 2) {
    return NextResponse.json({ found: false })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data } = await supabase
    .from('rsvp_responses')
    .select('guest_name, attending, created_at')
    .ilike('guest_name', name)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!data) return NextResponse.json({ found: false })

  return NextResponse.json({
    found: true,
    attending: data.attending,
    guest_name: data.guest_name,
    created_at: data.created_at,
  })
}
