import { MessageCircle } from 'lucide-react'

type ContactShortcutProps = {
  onNavigate: (path: string) => void
}

export function ContactShortcut({ onNavigate }: ContactShortcutProps) {
  return (
    <a
      className="whatsapp-float"
      href="/contact"
      aria-label="Contact our team"
      onClick={(event) => {
        event.preventDefault()
        onNavigate('contact')
      }}
    >
      <MessageCircle size={20} />
      <span>Need a hand?</span>
    </a>
  )
}
