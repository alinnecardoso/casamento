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

  const payload = {
    guest_name: body.guest_name.trim(),
    email: body.email?.trim() || null,
    phone: body.phone?.trim() || null,
    attending: body.attending,
    guests_count: 1 + companions.length,
    companion_names: companions.length > 0 ? JSON.stringify(companions) : null,
    message: body.message?.trim() || null,
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  // Check if name already exists (case-insensitive)
  const { data: existing } = await supabase
    .from('rsvp_responses')
    .select('id')
    .ilike('guest_name', payload.guest_name)
    .limit(1)
    .single()

  const { error } = existing
    ? await supabase.from('rsvp_responses').update(payload).eq('id', existing.id)
    : await supabase.from('rsvp_responses').insert(payload)

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

      if (existing) {
        // Find and update the existing row in the sheet
        const sheetData = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Respostas!A:B',
        })
        const rows = sheetData.data.values || []
        const rowIndex = rows.findIndex(
          (r) => r[1]?.toLowerCase() === payload.guest_name.toLowerCase()
        )
        if (rowIndex > 0) {
          await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `Respostas!A${rowIndex + 1}:H${rowIndex + 1}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
              values: [[
                new Date().toLocaleString('pt-BR'),
                payload.guest_name,
                payload.email || '',
                payload.phone || '',
                payload.attending ? 'Sim' : 'Não',
                payload.guests_count,
                companions.join(', '),
                payload.message || '',
              ]],
            },
          })
        }
      } else {
        await sheets.spreadsheets.values.append({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Respostas!A:H',
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [[
              new Date().toLocaleString('pt-BR'),
              payload.guest_name,
              payload.email || '',
              payload.phone || '',
              payload.attending ? 'Sim' : 'Não',
              payload.guests_count,
              companions.join(', '),
              payload.message || '',
            ]],
          },
        })
      }
    } catch { /* optional */ }
  }

  return NextResponse.json({ ok: true, updated: !!existing })
}
