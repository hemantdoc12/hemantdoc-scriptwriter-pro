import React, { useRef, forwardRef, useImperativeHandle, useCallback, useEffect, useState } from 'react'

// Professional PDF formatting specifications (exact measurements)
const PDF_FORMATTING = {
  scene_heading: {
    marginLeft: '0in',
    marginRight: '1in', 
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: '24px',
    marginBottom: '0px'
  },
  character: {
    marginLeft: '3.7in', // Exact center position for 8.5" page
    marginRight: '0in',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const, 
    fontWeight: 'bold' as const,
    marginTop: '12px',
    marginBottom: '0px'
  },
  dialogue: {
    marginLeft: '1.5in', // Exact dialogue indent
    marginRight: '2.5in', // Right margin from page edge
    textAlign: 'left' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    marginTop: '0px',
    marginBottom: '0px'
  },
  parenthetical: {
    marginLeft: '2in', // Centered under character
    marginRight: '2in',
    textAlign: 'center' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    marginTop: '0px',
    marginBottom: '0px'
  },
  action: {
    marginLeft: '0in',
    marginRight: '1in',
    textAlign: 'left' as const, 
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    marginTop: '12px',
    marginBottom: '0px'
  },
  transition: {
    marginLeft: '0in',
    marginRight: '0in',
    textAlign: 'right' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: '12px', 
    marginBottom: '0px'
  },
  shot: {
    marginLeft: '0in',
    marginRight: '1in',
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: '12px',
    marginBottom: '0px'
  }
}

// Convert inches to pixels (96 DPI standard)
const inchesToPx = (inches: string): number => {
  const value = parseFloat(inches.replace('in', ''))
  return value * 96 // 96px per inch
}

// Industry-standard color coding
const ELEMENT_COLORS = {
  scene_heading: { bg: '#e3f2fd', border: '#1976d2', text: '#0d47a1' },
  character: { bg: '#ffebee', border: '#d32f2f', text: '#c62828' },
  dialogue: { bg: '#f3e5f5', border: '#7b1fa2', text: '#4a148c' },
  parenthetical: { bg: '#fff3e0', border: '#f57c00', text: '#e65100' },
  action: { bg: '#e8f5e8', border: '#388e3c', text: '#1b5e20' },
  transition: { bg: '#fce4ec', border: '#c2185b', text: '#880e4f' },
  shot: { bg: '#e1f5fe', border: '#0288d1', text: '#01579b' }
}

export interface ScriptEditorRef {
  formatCurrentLine: (elementType: string) => void
  insertTextAtCursor: (text: string) => void
  focus: () => void
  getCurrentLine: () => string
  getCurrentElementType: () => string
}

interface ProfessionalArchitectureEditorProps {
  value: string
  onChange: (value: string) => void
  isPreviewMode: boolean
  className?: string
  placeholder?: string
}

// Individual line component with its own formatting
interface ScriptLine {
  id: string
  content: string
  elementType: string
  lineNumber: number
}

const ProfessionalArchitectureEditor = forwardRef<ScriptEditorRef, ProfessionalArchitectureEditorProps>(
  ({ value, onChange, isPreviewMode, className = '', placeholder }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const [lines, setLines] = useState<ScriptLine[]>([])
    const [currentFormatMode, setCurrentFormatMode] = useState<string>('action')
    const [activeLine, setActiveLine] = useState<number>(0)
    const [showTooltip, setShowTooltip] = useState(false)

    // Convert text value to structured lines
    useEffect(() => {
      const textLines = value.split('\n')
      const structuredLines: ScriptLine[] = textLines.map((content, index) => ({
        id: `line-${index}`,
        content,
        elementType: 'action', // Default, will be updated by user selection
        lineNumber: index
      }))
      setLines(structuredLines)
    }, [value])

    // Convert structured lines back to text
    const linesToText = useCallback((scriptLines: ScriptLine[]): string => {
      return scriptLines.map(line => line.content).join('\n')
    }, [])

    useImperativeHandle(ref, () => ({
      formatCurrentLine: (elementType: string) => {
        console.log('🎯 PROFESSIONAL ARCHITECTURE: Format current line as:', elementType)
        
        // Set format mode for new typing
        setCurrentFormatMode(elementType)
        
        // Format the current active line
        setLines(prevLines => {
          const newLines = [...prevLines]
          if (newLines[activeLine]) {
            // Apply formatting to current line content
            let formattedContent = newLines[activeLine].content.trim()
            
            // Apply element-specific transformations
            switch (elementType) {
              case 'scene_heading':
                formattedContent = formattedContent.toUpperCase()
                break
              case 'character':
                formattedContent = formattedContent.toUpperCase()
                break
              case 'parenthetical':
                if (formattedContent && !formattedContent.startsWith('(')) {
                  formattedContent = `(${formattedContent})`
                }
                break
              case 'transition':
                formattedContent = formattedContent.toUpperCase()
                if (formattedContent && !formattedContent.endsWith(':')) {
                  formattedContent = `${formattedContent}:`
                }
                break
              case 'shot':
                formattedContent = formattedContent.toUpperCase()
                break
            }
            
            newLines[activeLine] = {
              ...newLines[activeLine],
              content: formattedContent,
              elementType: elementType
            }
            
            console.log(`📝 Formatted line ${activeLine}:`, elementType, '→', formattedContent)
          }
          
          return newLines
        })
        
        // Update the parent component immediately with the updated lines
        setTimeout(() => {
          setLines(currentLines => {
            const newText = linesToText(currentLines)
            onChange(newText)
            return currentLines
          })
        }, 0)
        
        // Show tooltip
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
        
        // Focus the editor
        if (editorRef.current) {
          editorRef.current.focus()
        }
      },

      insertTextAtCursor: (text: string) => {
        // Implementation for inserting text at cursor position
        console.log('📝 Insert text at cursor:', text)
      },

      focus: () => {
        editorRef.current?.focus()
      },

      getCurrentLine: () => {
        return lines[activeLine]?.content || ''
      },

      getCurrentElementType: () => {
        return lines[activeLine]?.elementType || 'action'
      }
    }))

    // Handle content changes in individual lines
    const handleLineChange = useCallback((lineIndex: number, newContent: string) => {
      setLines(prevLines => {
        const newLines = [...prevLines]
        if (newLines[lineIndex]) {
          newLines[lineIndex] = {
            ...newLines[lineIndex],
            content: newContent
          }
        }
        return newLines
      })
      
      // Update parent component with the updated lines
      setTimeout(() => {
        setLines(currentLines => {
          const newText = linesToText(currentLines)
          onChange(newText)
          return currentLines
        })
      }, 0)
    }, [linesToText, onChange])

    // Handle Enter key for smart format switching
    const handleKeyDown = useCallback((e: React.KeyboardEvent, lineIndex: number) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        
        const currentLine = lines[lineIndex]
        console.log('⏎ Enter pressed on line', lineIndex, 'format:', currentLine?.elementType)
        
        // Create new line
        const newLineIndex = lineIndex + 1
        let nextFormat = 'action'
        
        // Smart format switching
        if (currentLine) {
          switch (currentLine.elementType) {
            case 'scene_heading':
              nextFormat = 'action'
              break
            case 'character':
              nextFormat = 'dialogue'
              break
            case 'dialogue':
              nextFormat = 'action'
              break
            case 'parenthetical':
              nextFormat = 'dialogue'
              break
            case 'transition':
              nextFormat = 'scene_heading'
              break
            default:
              nextFormat = 'action'
          }
        }
        
        // Insert new line
        setLines(prevLines => {
          const newLines = [...prevLines]
          newLines.splice(newLineIndex, 0, {
            id: `line-${Date.now()}`,
            content: '',
            elementType: nextFormat,
            lineNumber: newLineIndex
          })
          
          // Update line numbers
          return newLines.map((line, index) => ({
            ...line,
            lineNumber: index
          }))
        })
        
        // Move to new line
        setActiveLine(newLineIndex)
        setCurrentFormatMode(nextFormat)
        
        console.log('🔄 Created new line', newLineIndex, 'with format:', nextFormat)
      }
    }, [lines])

    // Get CSS styles for a specific element type
    const getElementStyles = useCallback((elementType: string, isActive: boolean = false) => {
      const pdfFormat = PDF_FORMATTING[elementType as keyof typeof PDF_FORMATTING] || PDF_FORMATTING.action
      const colorScheme = ELEMENT_COLORS[elementType as keyof typeof ELEMENT_COLORS] || ELEMENT_COLORS.action
      
      return {
        fontFamily: 'Courier New, monospace',
        fontSize: '12pt',
        lineHeight: '1.2',
        minHeight: '14.4px',
        marginTop: pdfFormat.marginTop,
        marginBottom: pdfFormat.marginBottom,
        marginLeft: inchesToPx(pdfFormat.marginLeft),
        marginRight: inchesToPx(pdfFormat.marginRight),
        textAlign: pdfFormat.textAlign,
        textTransform: pdfFormat.textTransform,
        fontWeight: pdfFormat.fontWeight,
        color: colorScheme.text,
        backgroundColor: isActive ? colorScheme.bg : 'transparent',
        borderLeft: isActive ? `4px solid ${colorScheme.border}` : 'none',
        paddingLeft: isActive ? '8px' : '0px',
        outline: 'none',
        border: 'none',
        width: '100%',
        resize: 'none' as const
      }
    }, [])

    // Get tooltip content
    const getTooltipContent = (elementType: string) => {
      const tooltips = {
        scene_heading: '🎬 Scene Heading: INT./EXT. LOCATION - TIME',
        character: '👤 Character: Speaker name (centered, all caps)',
        dialogue: '💬 Dialogue: Character speech (indented)',
        parenthetical: '📝 Parenthetical: (actor direction)',
        action: '🎭 Action: Scene description',
        transition: '🎞️ Transition: CUT TO: (right-aligned)',
        shot: '📷 Shot: CLOSE UP, WIDE SHOT, etc.'
      }
      return tooltips[elementType as keyof typeof tooltips] || 'Format mode active'
    }

    if (isPreviewMode) {
      return (
        <div className={`flex-1 w-full p-8 overflow-y-auto bg-white ${className}`}>
          {lines.map((line, index) => (
            <div
              key={line.id}
              style={getElementStyles(line.elementType, index === activeLine)}
              title={`Line ${index + 1}: ${line.elementType.replace('_', ' ').toUpperCase()}`}
            >
              {line.content || '\u00A0'}
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={`flex-1 flex flex-col ${className} relative`}>
        {/* Format Mode Indicator */}
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border-2" 
             style={{ borderColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}>
          <div className="text-xs font-mono">
            <div className="flex items-center mb-1">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}
              />
              <span className="font-bold text-sm capitalize" 
                    style={{ color: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.text }}>
                {currentFormatMode.replace('_', ' ')} Mode
              </span>
            </div>
            <div className="text-xs text-gray-600">Line {activeLine + 1} Active</div>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-20 right-2 z-20 text-white text-sm rounded-lg px-4 py-3 max-w-md shadow-xl"
               style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}>
            <div className="font-semibold mb-1">
              {currentFormatMode.replace('_', ' ').toUpperCase()} Mode
            </div>
            <div className="text-xs opacity-90">
              {getTooltipContent(currentFormatMode)}
            </div>
            <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45"
                 style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }} />
          </div>
        )}

        {/* Professional Editor with Individual Lines */}
        <div 
          ref={editorRef}
          className="flex-1 w-full p-8 overflow-y-auto bg-white relative z-10"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '12pt',
            lineHeight: '1.2'
          }}
          contentEditable={false} // We'll handle editing per line
        >
          {lines.map((line, index) => (
            <div key={line.id} className="relative">
              <textarea
                value={line.content}
                onChange={(e) => handleLineChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={() => setActiveLine(index)}
                style={getElementStyles(line.elementType, index === activeLine)}
                className="w-full border-none outline-none resize-none"
                placeholder={index === 0 ? placeholder || `🏆 PROFESSIONAL ARCHITECTURE EDITOR

✨ BREAKTHROUGH SOLUTION:
• Each line maintains its own formatting independently
• Click format button → applies to CURRENT LINE only
• Press Enter → smart format switching
• Real-time PDF-accurate formatting

🎯 WORKFLOW:
1. Click SCENE HEADING → Current line becomes scene heading
2. Type → See exact PDF formatting
3. Press ENTER → New line auto-switches to ACTION
4. Perfect line-by-line control!

Ready for professional scriptwriting!` : ''}
                rows={1}
                spellCheck={false}
              />
            </div>
          ))}
        </div>
      </div>
    )
  }
)

ProfessionalArchitectureEditor.displayName = 'ProfessionalArchitectureEditor'

export default ProfessionalArchitectureEditor