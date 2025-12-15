import { MarketingEvent } from '@/lib/types'
import { SOLUTION_COLORS } from '@/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MapPin, Link as LinkIcon, Calendar } from '@phosphor-icons/react'

interface EventDetailModalProps {
  event: MarketingEvent | null
  open: boolean
  onClose: () => void
}

export function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
  if (!event) return null
  
  const solutionColor = SOLUTION_COLORS[event.solution]
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl pr-8">{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <Badge 
              className="text-white font-medium"
              style={{ backgroundColor: solutionColor }}
            >
              {event.solution}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 text-muted-foreground flex-shrink-0" size={20} />
              <div>
                <div className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</div>
                <div className="text-sm text-muted-foreground">{event.time}</div>
              </div>
            </div>
            
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 text-muted-foreground flex-shrink-0" size={20} />
                <div className="text-sm">{event.location}</div>
              </div>
            )}
            
            {event.regPageUrl && (
              <div className="flex items-start gap-3">
                <LinkIcon className="mt-0.5 text-muted-foreground flex-shrink-0" size={20} />
                <div>
                  <div className="text-xs uppercase font-medium text-muted-foreground mb-1">Registration Page</div>
                  <a 
                    href={event.regPageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {event.regPageUrl}
                  </a>
                </div>
              </div>
            )}
            
            {event.vivaEngageUrl && (
              <div className="flex items-start gap-3">
                <LinkIcon className="mt-0.5 text-muted-foreground flex-shrink-0" size={20} />
                <div>
                  <div className="text-xs uppercase font-medium text-muted-foreground mb-1">Viva Engage</div>
                  <a 
                    href={event.vivaEngageUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {event.vivaEngageUrl}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
