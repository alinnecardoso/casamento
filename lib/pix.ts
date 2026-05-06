function crc16(str: string): string {
  let crc = 0xffff
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return ((crc & 0xffff).toString(16).toUpperCase()).padStart(4, '0')
}

function field(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

export function generatePixPayload(
  pixKey: string,
  receiverName: string,
  city: string = 'Brasil',
  amount?: number,
  description?: string
): string {
  const merchantAccountInfo = field('00', 'BR.GOV.BCB.PIX') +
    field('01', pixKey) +
    (description ? field('02', description.slice(0, 72)) : '')

  const payload =
    field('00', '01') +
    field('26', merchantAccountInfo) +
    field('52', '0000') +
    field('53', '986') +
    (amount ? field('54', amount.toFixed(2)) : '') +
    field('58', 'BR') +
    field('59', receiverName.slice(0, 25)) +
    field('60', city.slice(0, 15)) +
    field('62', field('05', '***'))

  return payload + field('63', crc16(payload + '6304'))
}
