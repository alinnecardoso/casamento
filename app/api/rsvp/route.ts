import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.guest_name?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }

  const companions: string[] = Array.isArray(body.companion_names)
    ? body.companion_names.map((n: string) => n.trim()).filter(Boolean)
    : []

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const { error } = await supabase.from('rsvp_responses').insert({
    guest_name: body.guest_name.trim(),
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    attending: body.attending,
    guests_count: 1 + companions.length,
    companion_names: companions.length > 0 ? JSON.stringify(companions) : null,
    dietary_restrictions: body.dietary_restrictions?.trim() || null,
    message: body.message?.trim() || null,
  })

  if (error) {
    return NextResponse.json({ error: 'Erro ao salvar confirmação' }, { status: 500 })
  }

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
            1 + companions.length,
            companions.join(', '),
            body.message || '',
          ]],
        },
      })
    } catch { /* optional */ }
  }

  return NextResponse.json({ ok: true })
}
