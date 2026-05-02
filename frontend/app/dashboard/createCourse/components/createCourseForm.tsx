'use client'

import React, { useState } from 'react'
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent,
} from "@/components/ui/card"
import { BookOpen, BarChart2, Video } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-500' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
  { value: 'advanced', label: 'Advanced', color: 'bg-red-500' },
]

export default function CreateCourseForm() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [chapters, setChapters] = useState([5])
  const [difficulty, setDifficulty] = useState('beginner')
  const [includeVideo, setIncludeVideo] = useState(false)

  const selectedDifficulty = DIFFICULTY_LEVELS.find(d => d.value === difficulty)

  return (
    <div className='space-y-6'>
      {/* Card 1 — Course Details */}
      <Card className='border-gray-200 hover:shadow-[0_0_12px_3px_rgba(139,92,246,0.18)] transition-all duration-500 ease-in-out'>
        <CardHeader>
          <CardTitle className='flex gap-2 items-center'>
            <BookOpen className="h-5 w-5 text-violet-500" />
            Course Details
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Provide basic information about the course you want to create.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor="course_title">Course Title</Label>
            <Input
              id="course_title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className='focus-visible:ring-primary border-gray-200 mt-1'
              placeholder='e.g., Introduction to Machine Learning'
            />
          </div>

          <div>
            <Label htmlFor="course_description">Course Description</Label>
            <Textarea
              id="course_description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='focus-visible:ring-primary border-gray-200 mt-1 min-h-[120px] resize-none'
              placeholder='Describe what this course will cover and what learners will achieve...'
            />
          </div>
        </CardContent>
      </Card>

      {/* Card 2 — Course Structure */}
      <Card className='border-gray-200 hover:shadow-[0_0_12px_3px_rgba(139,92,246,0.18)] transition-all duration-500 ease-in-out'>
        <CardHeader>
          <CardTitle className='flex gap-2 items-center'>
            <BarChart2 className="h-5 w-5 text-violet-500" />
            Course Structure
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Configure how your course will be organized.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
          <div>
            <div className='flex items-center justify-between mb-3'>
              <Label>Number of Chapters</Label>
              <span className='text-sm font-medium text-violet-500'>{chapters[0]} chapters</span>
            </div>
            <Slider
              min={3}
              max={20}
              step={1}
              value={chapters}
              onValueChange={setChapters}
              className='w-full [&>span]:bg-gray-100 [&_[role=slider]]:focus-visible:outline-none [&_[role=slider]]:hover:ring-4 [&_[role=slider]]:hover:ring-violet-300 [&_[role=slider]]:hover:ring-offset-0 [&_[role=slider]]:focus-visible:ring-4 [&_[role=slider]]:focus-visible:ring-violet-300 [&_[role=slider]]:focus-visible:ring-offset-0'
            />
            <p className='text-sm text-gray-500 mt-2'>
              Choose between 3-20 chapters. More chapters provide deeper coverage.
            </p>
          </div>

          <div>
            <Label>Difficulty Level</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className='w-40 border-gray-100 mt-3 shadow-2xs'>
                <SelectValue>
                  <span className='flex items-center gap-2 '>
                    <span className={`w-2 h-2 rounded-full ${selectedDifficulty?.color}`} />
                    {selectedDifficulty?.label}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent
              position="popper"
              sideOffset={4}
              className='shadow-lg border-gray-100 bg-white min-w-[200px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 ring-primary duration-500 ease-out'
              >
                {DIFFICULTY_LEVELS.map(level => (
                  <SelectItem 
                    key={level.value} 
                    value={level.value}
                    className='cursor-pointer transition-all duration-300 ease-in-out hover:bg-violet-50 hover:scale-[1.02] focus:bg-violet-50 focus:outline-none'
                  >
                    <span className='flex items-center gap-2'>
                      <span className={`w-2 h-2 rounded-full ${level.color}`} />
                      {level.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Card 3 — Additional Options */}
      <Card className='border-gray-200 hover:shadow-[0_0_12px_3px_rgba(139,92,246,0.18)] transition-all duration-500 ease-in-out'>
        <CardHeader>
          <CardTitle className='flex gap-2 items-center'>
            <Video className="h-5 w-5 text-violet-500" />
            Additional Options
          </CardTitle>
          <CardDescription className='text-gray-600'>
            Customize your learning experience.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className='flex items-center justify-between'>
            <div>
              <p className='font-semibold text-sm'>Include Video Content</p>
              <p className='text-sm text-gray-500'>AI will suggest relevant video resources for each chapter.</p>
            </div>
            <Switch
              checked={includeVideo}
              onCheckedChange={setIncludeVideo}
              className='bg-gray-200 data-[state=checked]:bg-violet-500 [&>span]:bg-white hover:scale-105 transition-transform duration-200'
            />
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className='flex justify-end gap-3 pb-8'>
        <Button 
        variant='outline'
        className='cursor-pointer border-gray-300 hover:text-primary hover:bg-violet-100 duration-300 ease-out'>
          Cancel
        </Button>
        <Button className='bg-violet-400 hover:bg-violet-300 text-white gap-2 cursor-pointer'>
          <span>✦</span> Generate Course
        </Button>
      </div>
    </div>
  )
}