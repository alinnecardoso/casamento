import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return '55' + digits
  return digits
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.guest_name?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }
  if (!body.phone?.trim()) {
    return NextResponse.json({ error: 'WhatsApp é obrigatório' }, { status: 400 })
  }

  const companions: string[] = Array.isArray(body.companion_names)
    ? body.companion_names.map((n: string) => n.trim()).filter(Boolean)
    : []

  const phone = normalizePhone(body.phone)

  const payload = {
    guest_name: body.guest_name.trim(),
    email: body.email?.trim() || null,
    phone,
    attending: body.attending,
    guests_count: 1 + companions.length,
    companion_names: companions.length > 0 ? JSON.stringify(companions) : null,
    message: body.message?.trim() || null,
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  )

  const { data: existing } = await supabase
    .from('rsvp_responses')
    .select('id')
    .eq('phone', phone)
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
        // Find and update the existing row by phone (column D)
        const sheetData = await sheets.spreadsheets.values.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID,
          range: 'Respostas!D:D',
        })
        const rows = sheetData.data.values || []
        const rowIndex = rows.findIndex((r) => normalizePhone(r[0] || '') === phone)
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
                phone,
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
              phone,
              payload.attending ? 'Sim' : 'Não',
              payload.guests_count,
              companions.join(', '),
              payload.message || '',
            ]],
          },
        })
      }
    } catch (err) { console.error('[Sheets]', err) }
  }

  return NextResponse.json({ ok: true, updated: !!existing })
}
