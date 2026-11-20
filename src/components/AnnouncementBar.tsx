import { PackageCheck, Sparkles } from 'lucide-react'

type AnnouncementBarProps = {
  messages: string[]
}

export function AnnouncementBar({ messages }: AnnouncementBarProps) {
  return (
    <div className="announcement">
      <div className="announcement-marquee" aria-hidden="true">
        <div className="announcement-track">
          {[0, 1].map((copy) => (
            <div className="announcement-group" key={copy}>
              <PackageCheck className="announcement-truck" size={18} />
              {messages.map((message, index) => (
                <span className="announcement-item" key={`${copy}-${index}`}>
                  {index > 0 && <Sparkles className="announcement-divider" size={14} />}
                  {index === 0 ? <strong>{message}</strong> : message}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <span className="sr-only">{messages.join(' • ')}</span>
    </div>
  )
}
