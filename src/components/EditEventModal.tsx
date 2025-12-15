import { useState, useEffect } from 'react'
import { MarketingEvent, Solution } from '@/lib/types'
import { SOLUTIONS } from '@/lib/constants'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface EditEventModalProps {
  event: MarketingEvent | null
  open: boolean
  onClose: () => void
  onEdit: (event: MarketingEvent) => void
  onDelete: (eventId: string) => void
}

export function EditEventModal({ event, open, onClose, onEdit, onDelete }: EditEventModalProps) {
  const [title, setTitle] = useState('')
  const [solution, setSolution] = useState<Solution>('AI Business Solutions')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [location, setLocation] = useState('')
  const [regPageUrl, setRegPageUrl] = useState('')
  const [vivaEngageUrl, setVivaEngageUrl] = useState('')
  
  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setSolution(event.solution)
      setDate(event.date)
      setTime(event.time || '')
      setLocation(event.location)
      setRegPageUrl(event.regPageUrl || '')
      setVivaEngageUrl(event.vivaEngageUrl || '')
    }
  }, [event])
  
  const resetForm = () => {
    setTitle('')
    setSolution('AI Business Solutions')
    setDate('')
    setTime('')
    setLocation('')
    setRegPageUrl('')
    setVivaEngageUrl('')
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!event || !title || !date || !location) {
      toast.error('Please fill in all required fields')
      return
    }
    
    onEdit({
      id: event.id,
      title,
      solution,
      date,
      time: time || undefined,
      location,
      regPageUrl: regPageUrl || undefined,
      vivaEngageUrl: vivaEngageUrl || undefined,
    })
    
    toast.success('Event updated successfully')
    resetForm()
    onClose()
  }
  
  const handleDelete = () => {
    if (!event) return
    
    if (confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id)
      toast.success('Event deleted successfully')
      resetForm()
      onClose()
    }
  }
  
  if (!event) return null
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm()
        onClose()
      }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Marketing Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Event Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-solution">Solution *</Label>
            <Select value={solution} onValueChange={(value) => setSolution(value as Solution)}>
              <SelectTrigger id="edit-solution">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOLUTIONS.map((sol) => (
                  <SelectItem key={sol} value={sol}>
                    {sol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date *</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-time">Time</Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-location">Location *</Label>
            <Input
              id="edit-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-regPageUrl">Registration Page URL</Label>
            <Input
              id="edit-regPageUrl"
              type="url"
              value={regPageUrl}
              onChange={(e) => setRegPageUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-vivaEngageUrl">Viva Engage URL</Label>
            <Input
              id="edit-vivaEngageUrl"
              type="url"
              value={vivaEngageUrl}
              onChange={(e) => setVivaEngageUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm()
                onClose()
              }}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
