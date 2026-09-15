import type { PublicUserProfile } from '../types'

export function generateVCard(profile: PublicUserProfile): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${profile.fullName}`,
  ]

  const nameParts = profile.fullName.trim().split(' ')
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''
  const firstName = nameParts[0] || ''
  lines.push(`N:${lastName};${firstName};;;`)

  if (profile.jobTitle) {
    lines.push(`TITLE:${profile.jobTitle}`)
  }

  if (profile.phone) {
    lines.push(`TEL;TYPE=CELL:${profile.phone}`)
  }

  if (profile.email) {
    lines.push(`EMAIL;TYPE=INTERNET:${profile.email}`)
  }

  if (profile.website) {
    lines.push(`URL:${profile.website}`)
  }

  if (profile.bio) {
    lines.push(`NOTE:${profile.bio.replace(/\n/g, ' ')}`)
  }

  lines.push('END:VCARD')
  return lines.join('\n')
}

export function downloadVCard(profile: PublicUserProfile) {
  const vcardContent = generateVCard(profile)
  const filename = `${profile.username}_contact.vcf`

  // #ifdef H5
  const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // #endif

  // #ifndef H5
  uni.showModal({
    title: 'Contact File Ready',
    content: vcardContent,
    showCancel: false,
    confirmText: 'Copy Data',
    success() {
      uni.setClipboardData({
        data: vcardContent,
        success() {
          uni.showToast({ title: 'vCard copied!', icon: 'success' })
        }
      })
    }
  })
  // #endif
}
