// Scene numbering utility for professional screenplay formatting

export interface SceneInfo {
  sceneNumber: number
  lineIndex: number
  content: string
  location: string
  timeOfDay: string
}

export const extractScenes = (content: string): SceneInfo[] => {
  const lines = content.split('\n')
  const scenes: SceneInfo[] = []
  let sceneCounter = 1
  
  lines.forEach((line, index) => {
    const trimmed = line.trim()
    
    // Detect scene headings (INT./EXT.)
    if (/^(INT\.|EXT\.)/i.test(trimmed)) {
      // Parse location and time
      const match = trimmed.match(/^(INT\.|EXT\.)\s+(.+?)\s*-\s*(.+)$/i)
      const location = match ? match[2] : trimmed.replace(/^(INT\.|EXT\.)\s*/i, '')
      const timeOfDay = match ? match[3] : 'CONTINUOUS'
      
      scenes.push({
        sceneNumber: sceneCounter++,
        lineIndex: index,
        content: trimmed,
        location: location.trim(),
        timeOfDay: timeOfDay.trim().toUpperCase()
      })
    }
  })
  
  return scenes
}

export const addSceneNumbers = (content: string): string => {
  const lines = content.split('\n')
  const scenes = extractScenes(content)
  
  // Create a map of line indices to scene numbers
  const sceneMap = new Map<number, number>()
  scenes.forEach(scene => {
    sceneMap.set(scene.lineIndex, scene.sceneNumber)
  })
  
  // Add scene numbers to lines
  const numberedLines = lines.map((line, index) => {
    const sceneNumber = sceneMap.get(index)
    if (sceneNumber) {
      const trimmed = line.trim()
      return `${sceneNumber}. ${trimmed}`
    }
    return line
  })
  
  return numberedLines.join('\n')
}

export const formatSceneNumberForDisplay = (sceneNumber: number): string => {
  return sceneNumber.toString().padStart(2, '0')
}

export const formatSceneHeaderWithNumber = (content: string, sceneNumber: number): string => {
  return `${sceneNumber}. ${content.replace(/^\d+\.\s*/, '')}`
}