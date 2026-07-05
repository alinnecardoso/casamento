import { NextRequest, NextResponse } from 'next/server'

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10 || digits.length === 11) return '55' + digits
  return digits
}

async function getSheetsClient() {
  const { google } = await import('googleapis')
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  return google.sheets({ version: 'v4', auth })
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
  const row = [
    new Date().toLocaleString('pt-BR'),
    body.guest_name.trim(),
    body.email?.trim() || '',
    phone,
    body.attending ? 'Sim' : 'Não',
    1 + companions.length,
    companions.join(', '),
    body.message?.trim() || '',
  ]

  if (!process.env.GOOGLE_SHEET_ID) {
    return NextResponse.json({ error: 'Planilha não configurada' }, { status: 500 })
  }

  try {
    const sheets = await getSheetsClient()
    const sheetId = process.env.GOOGLE_SHEET_ID

    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: 'Respostas!D:D',
    })
    const phones = existing.data.values || []
    const rowIndex = phones.findIndex((r, i) => i > 0 && normalizePhone(r[0] || '') === phone)

    if (rowIndex > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Respostas!A${rowIndex + 1}:H${rowIndex + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [row] },
      })
      return NextResponse.json({ ok: true, updated: true })
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Respostas!A:H',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    })
    return NextResponse.json({ ok: true, updated: false })
  } catch (err) {
    console.error('Sheets error:', err)
    return NextResponse.json({ error: 'Erro ao salvar confirmação' }, { status: 500 })
  }
}
