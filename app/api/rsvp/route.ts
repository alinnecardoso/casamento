import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getSiteConfig } from '@/lib/supabase'
import { sendRsvpToCoupleEmail, sendRsvpConfirmationToGuest } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.guest_name?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const { error } = await supabase.from('rsvp_responses').insert({
    guest_name: body.guest_name.trim(),
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    attending: body.attending,
    guests_count: Math.min(Math.max(Number(body.guests_count) || 1, 1), 20),
    dietary_restrictions: body.dietary_restrictions?.trim() || null,
    message: body.message?.trim() || null,
  })

  if (error) {
    return NextResponse.json({ error: 'Erro ao salvar confirmação' }, { status: 500 })
  }

  // Send emails (non-blocking)
  const config = await getSiteConfig().catch(() => null)
  if (config) {
    const rsvpData = {
      guest_name: body.guest_name,
      email: body.email,
      attending: body.attending,
      guests_count: body.guests_count || 1,
      dietary_restrictions: body.dietary_restrictions,
      message: body.message,
    }

    const dateFormatted = new Date(config.wedding_date + 'T12:00:00')
      .toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })

    await Promise.allSettled([
      config.couple_email && sendRsvpToCoupleEmail(rsvpData, config.couple_email, config.couple_name),
      sendRsvpConfirmationToGuest(rsvpData, config.couple_name, dateFormatted),
    ])
  }

  // Sync to Google Sheets if configured
  if (process.env.GOOGLE_SHEET_ID) {
    try {
      const { google } = await import('googleapis')
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      })
      const sheets = google.sheets({ version: 'v4', auth })
      await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Respostas!A:H',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [[
            new Date().toLocaleString('pt-BR'),
            body.guest_name,
            body.email || '',
            body.phone || '',
            body.attending ? 'Sim' : 'Não',
            body.guests_count || 1,
            body.dietary_restrictions || '',
            body.message || '',
          ]],
        },
      })
    } catch { /* optional */ }
  }

  return NextResponse.json({ ok: true })
}
