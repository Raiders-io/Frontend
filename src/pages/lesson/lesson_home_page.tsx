import React, { useState } from "react";
import { lessonService } from "@/services/lesson_service";
import type { Lesson } from "@/utils/types/lesson";

export default function LessonHomePage() {
  const [ inputValue, setInputValue ] = useState('')
  const [ searchResults, setSearchResults ] = useState<Lesson[]>([])

  const executeSearch = async (event: React.SubmitEvent) => {
    event.preventDefault()
    try {
      const results = await lessonService.searchLessons(inputValue)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching lessons:', error)
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '600px' }}>
      <h2>Lesson Workspace</h2>

      {/* The HTML Form Interceptor */}
      <form onSubmit={executeSearch}>
        <input 
          type="text" 
          placeholder="Search by title..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} 
        />
        <button type="submit">Search</button>
      </form>

      {/* The Dynamic Layout Loop */}
      <div style={{ marginTop: '20px' }}>
        {searchResults.map((lesson) => (
          <div key={lesson.slug} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '8px' }}>
            <h3>{lesson.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}