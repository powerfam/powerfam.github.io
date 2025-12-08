"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { ko } from "date-fns/locale"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ko}
      showOutsideDays={showOutsideDays}
      className={className}
      style={{
        // CSS 변수로 스타일 지정
        ['--rdp-accent-color' as any]: 'var(--menu-main)',
        ['--rdp-accent-background-color' as any]: 'var(--menu-main)',
      }}
      styles={{
        months: { display: 'flex', flexDirection: 'column' },
        month: { display: 'flex', flexDirection: 'column', gap: '1rem' },
        caption: { display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', padding: '0.5rem 0' },
        caption_label: { fontSize: '0.95rem', fontWeight: 600 },
        nav: { display: 'flex', alignItems: 'center', gap: '0.25rem' },
        button_previous: { position: 'absolute', left: 0 },
        button_next: { position: 'absolute', right: 0 },
        weekdays: { display: 'flex' },
        weekday: { width: '2.25rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--foreground)', opacity: 0.6 },
        week: { display: 'flex', marginTop: '0.25rem' },
        day: { width: '2.25rem', height: '2.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem', fontSize: '0.875rem', cursor: 'pointer' },
        day_button: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem' },
        selected: { backgroundColor: 'var(--menu-main)', color: 'white' },
        today: { fontWeight: 700, border: '1px solid var(--menu-main)' },
        outside: { opacity: 0.4 },
        disabled: { opacity: 0.3 },
      }}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === 'left') {
            return <ChevronLeft className="h-5 w-5" style={{ color: 'var(--foreground)' }} />
          }
          return <ChevronRight className="h-5 w-5" style={{ color: 'var(--foreground)' }} />
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
