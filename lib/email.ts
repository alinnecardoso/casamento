import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? 'no-key')

interface RsvpData {
  guest_name: string
  email?: string
  attending: boolean
  guests_count: number
  dietary_restrictions?: string
  message?: string
}

export async function sendRsvpToCoupleEmail(data: RsvpData, coupleEmail: string, coupleName: string) {
  if (!process.env.RESEND_API_KEY || !coupleEmail) return

  const subject = data.attending
    ? `✅ ${data.guest_name} confirmou presença!`
    : `❌ ${data.guest_name} não poderá comparecer`

  const body = data.attending
    ? `
      <h2>${data.guest_name} vai ao seu casamento!</h2>
      <p><strong>Acompanhantes:</strong> ${data.guests_count} pessoa(s)</p>
      ${data.dietary_restrictions ? `<p><strong>Restrições alimentares:</strong> ${data.dietary_restrictions}</p>` : ''}
      ${data.message ? `<p><strong>Mensagem:</strong> <em>"${data.message}"</em></p>` : ''}
      ${data.email ? `<p><strong>Contato:</strong> ${data.email}</p>` : ''}
    `
    : `
      <h2>${data.guest_name} não poderá comparecer.</h2>
      ${data.message ? `<p><strong>Mensagem:</strong> <em>"${data.message}"</em></p>` : ''}
    `

  await resend.emails.send({
    from: 'Casamento <onboarding@resend.dev>',
    to: coupleEmail,
    subject,
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; color: #2c2c2c;">
        <div style="background: #2c2c2c; padding: 24px; text-align: center;">
          <h1 style="color: #c9a96e; font-size: 20px; margin: 0;">${coupleName}</h1>
        </div>
        <div style="padding: 32px; background: #faf8f4;">
          ${body}
        </div>
        <div style="background: #e8d5b0; padding: 12px; text-align: center; font-size: 12px; color: #4a4a4a;">
          Site do casamento
        </div>
      </div>
    `,
  }).catch(() => {})
}

export async function sendRsvpConfirmationToGuest(data: RsvpData, coupleName: string, weddingDate: string) {
  if (!process.env.RESEND_API_KEY || !data.email || !data.attending) return

  await resend.emails.send({
    from: 'Casamento <onboarding@resend.dev>',
    to: data.email,
    subject: `Sua presença foi confirmada! 🎉`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; color: #2c2c2c;">
        <div style="background: #2c2c2c; padding: 24px; text-align: center;">
          <h1 style="color: #c9a96e; font-size: 20px; margin: 0;">${coupleName}</h1>
          <p style="color: #e8d5b0; font-size: 13px; margin: 8px 0 0;">${weddingDate}</p>
        </div>
        <div style="padding: 32px; background: #faf8f4; text-align: center;">
          <p style="font-size: 18px;">Olá, <strong>${data.guest_name}</strong>!</p>
          <p>Sua presença foi confirmada. Mal podemos esperar para celebrar com você!</p>
          ${data.guests_count > 1 ? `<p>Confirmamos <strong>${data.guests_count} pessoas</strong>.</p>` : ''}
        </div>
        <div style="background: #e8d5b0; padding: 12px; text-align: center; font-size: 12px; color: #4a4a4a;">
          Com amor, ${coupleName}
        </div>
      </div>
    `,
  }).catch(() => {})
}
