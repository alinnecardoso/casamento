import { NextResponse } from 'next/server'

export async function GET() {
  if (!process.env.GOOGLE_SHEET_ID) {
    return NextResponse.json([])
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
    const data = rows.slice(1).filter((row) => row[1]).map((row, i) => ({
      id: String(i),
      created_at: row[0] || '',
      guest_name: row[1] || '',
      email: row[2] || '',
      phone: row[3] || '',
      attending: row[4] === 'Sim',
      guests_count: parseInt(row[5] || '1', 10) || 1,
      companion_names: row[6] ? JSON.stringify(row[6].split(', ').filter(Boolean)) : null,
      message: row[7] || null,
    }))

    return NextResponse.json(data)
  } catch {
    return NextResponse.json([])
  }
}
