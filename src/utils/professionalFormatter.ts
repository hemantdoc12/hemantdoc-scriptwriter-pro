// Professional Screenplay Formatter with Industry Standards

export interface FormattingPositions {
  marginLeft: number
  marginRight: number
  textAlign: 'left' | 'center' | 'right'
  textTransform: 'none' | 'uppercase' | 'lowercase'
  fontWeight: 'normal' | 'bold'
  marginTop: number
  marginBottom: number
}

export const SCREENPLAY_FORMATTING: Record<string, FormattingPositions> = {
  scene_heading: {
    marginLeft: 0,
    marginRight: 60,
    textAlign: 'left',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 0
  },
  character: {
    marginLeft: 220, // Character centered (approximately 3.7 inches)
    marginRight: 0,
    textAlign: 'center', 
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 0
  },
  dialogue: {
    marginLeft: 100, // Dialogue indent (approximately 1.5 inches)
    marginRight: 120, // Right margin for dialogue (approximately 2.5 inches from right)
    textAlign: 'left',
    textTransform: 'none',
    fontWeight: 'normal',
    marginTop: 0,
    marginBottom: 0
  },
  parenthetical: {
    marginLeft: 160, // Parenthetical indent (approximately 2 inches)
    marginRight: 100,
    textAlign: 'center',
    textTransform: 'none',
    fontWeight: 'normal',
    marginTop: 0,
    marginBottom: 0
  },
  action: {
    marginLeft: 0,
    marginRight: 60, // Right margin (approximately 1 inch)
    textAlign: 'left',
    textTransform: 'none', 
    fontWeight: 'normal',
    marginTop: 12,
    marginBottom: 0
  },
  transition: {
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'right',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 0
  },
  shot: {
    marginLeft: 0,
    marginRight: 60,
    textAlign: 'left',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 0
  }
}

export function detectElementType(line: string, lines: string[], index: number): string {
  const trimmed = line.trim()
  
  if (!trimmed) return 'action'
  
  // Scene heading detection
  if (/^(INT\\.|EXT\\.|FADE IN:|FADE OUT\\.|CUT TO:)/i.test(trimmed)) {
    return 'scene_heading'
  }
  
  // Character detection (all caps, usually followed by dialogue)
  if (/^[A-Z\\s']{2,}$/.test(trimmed) && trimmed.length < 50) {
    const nextLine = lines[index + 1]?.trim()
    if (nextLine && !(/^[A-Z\\s']{2,}$/.test(nextLine))) {
      return 'character'
    }
  }
  
  // Parenthetical detection
  if (/^\\([^)]+\\)$/.test(trimmed)) {
    return 'parenthetical'
  }
  
  // Transition detection
  if (/^(CUT TO:|FADE TO:|DISSOLVE TO:|SMASH CUT TO:)/.test(trimmed)) {
    return 'transition'
  }
  
  // Check if it's dialogue (follows character)
  if (index > 0) {
    const prevLine = lines[index - 1]?.trim()
    if (prevLine && /^[A-Z\\s']{2,}$/.test(prevLine)) {
      return 'dialogue'
    }
  }
  
  // Shot detection
  if (/^(CLOSE UP|WIDE SHOT|MEDIUM SHOT|POV|INSERT)/i.test(trimmed)) {
    return 'shot'
  }
  
  // Default to action
  return 'action'
}

export function formatLineWithIndentation(line: string, elementType: string): string {
  const trimmed = line.trim()
  if (!trimmed) return ''
  
  const formatting = SCREENPLAY_FORMATTING[elementType] || SCREENPLAY_FORMATTING.action
  let formattedText = trimmed
  
  // Apply text transformations
  if (formatting.textTransform === 'uppercase') {
    formattedText = formattedText.toUpperCase()
  } else if (formatting.textTransform === 'lowercase') {
    formattedText = formattedText.toLowerCase()
  }
  
  // Handle special cases
  if (elementType === 'parenthetical' && !formattedText.startsWith('(')) {
    formattedText = `(${formattedText})`
  }
  if (elementType === 'transition' && !formattedText.endsWith(':') && !formattedText.endsWith('.')) {
    formattedText = formattedText + ':'
  }
  
  // Calculate indentation (convert pixels to approximate characters)
  const indentChars = Math.round(formatting.marginLeft / 12) // Approximate character width
  const indent = ' '.repeat(Math.max(0, indentChars))
  
  return indent + formattedText
}

export function formatScriptProfessionally(content: string): string {
  const lines = content.split('\\n')
  const formattedLines = lines.map((line, index) => {
    const elementType = detectElementType(line, lines, index)
    return formatLineWithIndentation(line, elementType)
  })
  
  return formattedLines.join('\\n')
}

export function addSceneNumbers(content: string): string {
  const lines = content.split('\\n')
  let sceneCount = 0
  
  const numberedLines = lines.map((line, index) => {
    const elementType = detectElementType(line, lines, index)
    
    if (elementType === 'scene_heading') {
      sceneCount++
      const trimmed = line.trim()
      if (trimmed && !trimmed.match(/^\\d+\\./)) {
        return `${sceneCount}. ${trimmed}`
      }
    }
    
    return line
  })
  
  return numberedLines.join('\\n')
}

export class SceneNumberer {
  addSceneNumbers(content: string): string {
    return addSceneNumbers(content)
  }
  
  removeSceneNumbers(content: string): string {
    const lines = content.split('\\n')
    const cleanLines = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.match(/^\\d+\\. /)) {
        return line.replace(/^(\\s*)\\d+\\. /, '$1')
      }
      return line
    })
    
    return cleanLines.join('\\n')
  }
}

// PDF Export Positioning
export function getPDFPositioning(elementType: string) {
  const pdfPositions: Record<string, any> = {
    scene_heading: {
      x: 90,
      align: 'left',
      weight: 'bold',
      transform: 'uppercase',
      marginTop: 12
    },
    character: {
      x: 310, // Centered position for PDF (approximately 3.7 inches)
      align: 'center',
      weight: 'bold', 
      transform: 'uppercase',
      marginTop: 6
    },
    dialogue: {
      x: 190, // Dialogue indent for PDF (approximately 1.5 inches)
      rightMargin: 120,
      align: 'left',
      weight: 'normal',
      transform: 'none'
    },
    parenthetical: {
      x: 250, // Parenthetical indent for PDF (approximately 2 inches)
      align: 'center',
      weight: 'normal',
      transform: 'none'
    },
    action: {
      x: 90,
      rightMargin: 60,
      align: 'left',
      weight: 'normal',
      transform: 'none',
      marginTop: 6
    },
    transition: {
      x: 0,
      align: 'right',
      weight: 'bold',
      transform: 'uppercase',
      marginTop: 12
    }
  }
  
  return pdfPositions[elementType] || pdfPositions.action
}

export function getElementCSS(elementType: string): React.CSSProperties {
  const formatting = SCREENPLAY_FORMATTING[elementType] || SCREENPLAY_FORMATTING.action
  
  return {
    marginLeft: `${formatting.marginLeft}px`,
    marginRight: `${formatting.marginRight}px`,
    textAlign: formatting.textAlign,
    textTransform: formatting.textTransform,
    fontWeight: formatting.fontWeight,
    marginTop: `${formatting.marginTop}px`,
    marginBottom: `${formatting.marginBottom}px`,
    fontFamily: 'Courier New, monospace',
    fontSize: '12pt',
    lineHeight: '1.2'
  }
}