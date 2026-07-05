import { NextRequest, NextResponse } from 'next/server'

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

  if (!process.env.GOOGLE_SHEET_ID) {
    return NextResponse.json({ found: false })
  }

  try {
    const { google } = await import('googleapis')
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    })
    const sheets = google.sheets({ version: 'v4', auth })

    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Respostas!A:H',
    })

    const rows = result.data.values || []
    const rowIndex = rows.findIndex((r, i) => i > 0 && normalizePhone(r[3] || '') === phone)

    if (rowIndex < 0) return NextResponse.json({ found: false })

    const row = rows[rowIndex]
    return NextResponse.json({
      found: true,
      attending: row[4] === 'Sim',
      guest_name: row[1] || '',
      created_at: row[0] || '',
    })
  } catch {
    return NextResponse.json({ found: false })
  }
}
