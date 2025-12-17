import { useState } from 'react'
import { MarketingEvent, Solution } from '@/lib/types'
import { SOLUTIONS, LOCATION_OPTIONS } from '@/lib/constants'
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

interface AddEventModalProps {
  open: boolean
  onClose: () => void
  onAdd: (event: Omit<MarketingEvent, 'id'>) => void
}

export function AddEventModal({ open, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState('')
  const [solution, setSolution] = useState<Solution>('AI Business Solutions')
  const [date, setDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [time, setTime] = useState('')
  const [locationOption, setLocationOption] = useState<string>('마이크로소프트 13층')
  const [customLocation, setCustomLocation] = useState('')
  const [regPageUrl, setRegPageUrl] = useState('')
  const [vivaEngageUrl, setVivaEngageUrl] = useState('')
  
  const resetForm = () => {
    setTitle('')
    setSolution('AI Business Solutions')
    setDate('')
    setEndDate('')
    setTime('')
    setLocationOption('마이크로소프트 13층')
    setCustomLocation('')
    setRegPageUrl('')
    setVivaEngageUrl('')
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const finalLocation = locationOption === 'custom' ? customLocation : locationOption
    
    if (!title || !date || !finalLocation) {
      toast.error('Please fill in all required fields')
      return
    }
    
    if (endDate && endDate < date) {
      toast.error('End date cannot be before start date')
      return
    }
    
    onAdd({
      title,
      solution,
      date,
      endDate: endDate || undefined,
      time: time || undefined,
      location: finalLocation,
      regPageUrl: regPageUrl || undefined,
      vivaEngageUrl: vivaEngageUrl || undefined,
    })
    
    toast.success('Event added successfully')
    resetForm()
    onClose()
  }
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        resetForm()
        onClose()
      }
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add Marketing Event</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="solution">Solution *</Label>
            <Select value={solution} onValueChange={(value) => setSolution(value as Solution)}>
              <SelectTrigger id="solution">
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
              <Label htmlFor="date">Start Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={date}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select value={locationOption} onValueChange={setLocationOption}>
              <SelectTrigger id="location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.filter(opt => opt !== 'custom').map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
                <SelectItem value="custom">직접 입력</SelectItem>
              </SelectContent>
            </Select>
            
            {locationOption === 'custom' && (
              <Input
                id="custom-location"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="Enter custom location"
                className="mt-2"
                required
              />
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="regPageUrl">Registration Page URL</Label>
            <Input
              id="regPageUrl"
              type="url"
              value={regPageUrl}
              onChange={(e) => setRegPageUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vivaEngageUrl">Viva Engage URL</Label>
            <Input
              id="vivaEngageUrl"
              type="url"
              value={vivaEngageUrl}
              onChange={(e) => setVivaEngageUrl(e.target.value)}
              placeholder="https://"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Add Event
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
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
