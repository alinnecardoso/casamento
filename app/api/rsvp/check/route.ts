import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return '55' + digits
  return digits
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('phone')?.trim()
  if (!raw || raw.replace(/\D/g, '').length < 8) {
    return NextResponse.json({ found: false })
  }

  const phone = normalizePhone(raw)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data } = await supabase
    .from('rsvp_responses')
    .select('guest_name, attending, created_at')
    .eq('phone', phone)
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
