"use client"

import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  // Initial state based on a default value to prevent initial false rendering
  const [matches, setMatches] = useState(true) // Default to true for desktop view
  
  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return;
    
    const media = window.matchMedia(query)
    // Set initial value
    setMatches(media.matches)
    
    // Define listener that actually uses the MediaQueryList change event
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches)
    }
    
    // Use the correct event listener for MediaQueryList
    media.addEventListener('change', listener)
    
    return () => media.removeEventListener('change', listener)
  }, [query]) // Only depend on query
  
  return matches
}
