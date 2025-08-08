import React, { useRef, forwardRef, useImperativeHandle, useCallback, useEffect, useState } from 'react'

// Professional screenplay line interface
interface ScriptLine {
  id: string
  text: string
  format: 'SceneHeading' | 'Action' | 'Character' | 'Dialogue' | 'Parenthetical' | 'Transition' | 'Shot'
  isActive: boolean
}

// Professional PDF formatting specifications (exact measurements)
const FORMAT_SPECS = {
  SceneHeading: {
    marginLeft: 0,
    marginRight: 72, // 1 inch
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: 24,
    marginBottom: 0,
    color: '#0d47a1',
    bgColor: '#e3f2fd'
  },
  Character: {
    marginLeft: 266, // 3.7 inches
    marginRight: 0,
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: 12,
    marginBottom: 0,
    color: '#c62828',
    bgColor: '#ffebee'
  },
  Dialogue: {
    marginLeft: 108, // 1.5 inches
    marginRight: 180, // 2.5 inches
    textAlign: 'left' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    marginTop: 0,
    marginBottom: 0,
    color: '#4a148c',
    bgColor: '#f3e5f5'
  },
  Parenthetical: {
    marginLeft: 144, // 2 inches
    marginRight: 144,
    textAlign: 'left' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    marginTop: 0,
    marginBottom: 0,
    color: '#e65100',
    bgColor: '#fff3e0'
  },
  Action: {
    marginLeft: 0,
    marginRight: 72,
    textAlign: 'left' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    marginTop: 12,
    marginBottom: 0,
    color: '#1b5e20',
    bgColor: '#e8f5e8'
  },
  Transition: {
    marginLeft: 360, // Right-aligned
    marginRight: 0,
    textAlign: 'right' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: 12,
    marginBottom: 0,
    color: '#880e4f',
    bgColor: '#fce4ec'
  },
  Shot: {
    marginLeft: 0,
    marginRight: 72,
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    marginTop: 12,
    marginBottom: 0,
    color: '#01579b',
    bgColor: '#e1f5fe'
  }
}

export interface ScriptEditorRef {
  formatCurrentLine: (format: string) => void
  insertTextAtCursor: (text: string) => void
  focus: () => void
  getCurrentLine: () => ScriptLine | null
  getCurrentElementType: () => string
  addNewLine: (format?: string) => void
  handleKeyboardShortcut: (shortcut: string) => void
}

interface ProfessionalVerticalStackEditorProps {
  value: string
  onChange: (value: string) => void
  isPreviewMode: boolean
  className?: string
  placeholder?: string
}

const ProfessionalVerticalStackEditor = forwardRef<ScriptEditorRef, ProfessionalVerticalStackEditorProps>(
  ({ value, onChange, isPreviewMode, className = '', placeholder }, ref) => {
    const [lines, setLines] = useState<ScriptLine[]>([])
    const [activeLineIndex, setActiveLineIndex] = useState(0)
    const [showFormatIndicator, setShowFormatIndicator] = useState(false)
    const lineRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})
    const containerRef = useRef<HTMLDivElement>(null)

    // Initialize with default content or empty line
    useEffect(() => {
      if (value && value.trim()) {
        const textLines = value.split('\n')
        const scriptLines: ScriptLine[] = textLines.map((text, index) => ({
          id: `line-${Date.now()}-${index}`,
          text: text,
          format: detectFormat(text) as any,
          isActive: index === 0
        }))
        setLines(scriptLines)
      } else {
        setLines([{
          id: `line-${Date.now()}`,
          text: '',
          format: 'Action',
          isActive: true
        }])
      }
    }, [])

    // Auto-detect format based on text content
    const detectFormat = useCallback((text: string): string => {
      const trimmed = text.trim()
      if (!trimmed) return 'Action'
      
      // Scene heading detection
      if (/^(INT\.|EXT\.|FADE IN:|FADE OUT\.|CUT TO:)/i.test(trimmed)) {
        return 'SceneHeading'
      }
      
      // Character detection (all caps, possibly with extension)
      if (/^[A-Z][A-Z\s\-']{1,}(\s\(.*\))?$/.test(trimmed) && trimmed.length < 50) {
        return 'Character'
      }
      
      // Parenthetical detection
      if (/^\(.*\)$/.test(trimmed)) {
        return 'Parenthetical'
      }
      
      // Transition detection
      if (/^(CUT TO:|FADE TO:|DISSOLVE TO:|MATCH CUT:|SMASH CUT:)/.test(trimmed.toUpperCase())) {
        return 'Transition'
      }
      
      // Shot detection
      if (/^(CLOSE UP|WIDE SHOT|MEDIUM SHOT|ECU|EWS|POV|INSERT|ANGLE ON)/.test(trimmed.toUpperCase())) {
        return 'Shot'
      }
      
      return 'Action'
    }, [])

    // Convert lines array back to text for parent component
    const linesToText = useCallback((scriptLines: ScriptLine[]): string => {
      return scriptLines.map(line => line.text).join('\n')
    }, [])

    // Smart format switching logic
    const getNextFormat = useCallback((currentFormat: string, currentText: string): string => {
      switch (currentFormat) {
        case 'SceneHeading':
          return 'Action'
        case 'Character':
          return currentText.trim() ? 'Dialogue' : 'Action'
        case 'Dialogue':
          return 'Action'
        case 'Parenthetical':
          return 'Dialogue'
        case 'Action':
          return 'Action'
        case 'Transition':
          return 'SceneHeading'
        case 'Shot':
          return 'Action'
        default:
          return 'Action'
      }
    }, [])

    // Validate format application based on context
    const canApplyFormat = useCallback((format: string, lineIndex: number): boolean => {
      if (format === 'Parenthetical') {
        // Parenthetical only allowed after Character
        const previousLine = lines[lineIndex - 1]
        return previousLine && previousLine.format === 'Character'
      }
      
      if (format === 'Transition') {
        // Transition only after Action, Dialogue, or Shot
        const previousLine = lines[lineIndex - 1]
        return previousLine && ['Action', 'Dialogue', 'Shot'].includes(previousLine.format)
      }
      
      return true
    }, [lines])

    // Format validation with user feedback
    const validateAndApplyFormat = useCallback((format: string, lineIndex: number): boolean => {
      if (!canApplyFormat(format, lineIndex)) {
        if (format === 'Parenthetical') {
          alert('Parenthetical can only be used directly after a Character line.')
          return false
        }
        if (format === 'Transition') {
          alert('Transitions can only be used after Action, Dialogue, or Shot lines.')
          return false
        }
      }
      return true
    }, [canApplyFormat])

    useImperativeHandle(ref, () => ({
      formatCurrentLine: (format: string) => {
        if (!validateAndApplyFormat(format, activeLineIndex)) return

        setLines(prevLines => {
          const newLines = [...prevLines]
          if (newLines[activeLineIndex]) {
            let formattedText = newLines[activeLineIndex].text.trim()
            
            // Apply format-specific transformations
            switch (format) {
              case 'SceneHeading':
                formattedText = formattedText.toUpperCase()
                break
              case 'Character':
                formattedText = formattedText.toUpperCase()
                break
              case 'Parenthetical':
                if (formattedText && !formattedText.startsWith('(')) {
                  formattedText = `(${formattedText})`
                }
                break
              case 'Transition':
                formattedText = formattedText.toUpperCase()
                if (formattedText && !formattedText.endsWith(':')) {
                  formattedText = `${formattedText}:`
                }
                break
              case 'Shot':
                formattedText = formattedText.toUpperCase()
                break
            }
            
            newLines[activeLineIndex] = {
              ...newLines[activeLineIndex],
              text: formattedText,
              format: format as any
            }
          }
          return newLines
        })
        
        setShowFormatIndicator(true)
        setTimeout(() => setShowFormatIndicator(false), 2000)
      },

      insertTextAtCursor: (text: string) => {
        const activeRef = lineRefs.current[lines[activeLineIndex]?.id]
        if (activeRef) {
          const start = activeRef.selectionStart || 0
          const end = activeRef.selectionEnd || 0
          const currentText = lines[activeLineIndex].text
          const newText = currentText.substring(0, start) + text + currentText.substring(end)
          
          setLines(prevLines => {
            const newLines = [...prevLines]
            newLines[activeLineIndex] = {
              ...newLines[activeLineIndex],
              text: newText
            }
            return newLines
          })
          
          setTimeout(() => {
            activeRef.setSelectionRange(start + text.length, start + text.length)
          }, 0)
        }
      },

      focus: () => {
        const activeRef = lineRefs.current[lines[activeLineIndex]?.id]
        activeRef?.focus()
      },

      getCurrentLine: () => lines[activeLineIndex] || null,

      getCurrentElementType: () => lines[activeLineIndex]?.format || 'Action',

      addNewLine: (format?: string) => {
        const nextFormat = format || getNextFormat(
          lines[activeLineIndex]?.format || 'Action',
          lines[activeLineIndex]?.text || ''
        )
        
        const newLine: ScriptLine = {
          id: `line-${Date.now()}`,
          text: '',
          format: nextFormat as any,
          isActive: true
        }
        
        setLines(prevLines => {
          const newLines = [...prevLines]
          newLines.splice(activeLineIndex + 1, 0, newLine)
          return newLines.map((line, index) => ({
            ...line,
            isActive: index === activeLineIndex + 1
          }))
        })
        
        setActiveLineIndex(activeLineIndex + 1)
        
        setTimeout(() => {
          const newRef = lineRefs.current[newLine.id]
          newRef?.focus()
        }, 0)
      },

      handleKeyboardShortcut: (shortcut: string) => {
        const shortcuts = {
          'cmd+1': 'SceneHeading',
          'cmd+2': 'Action', 
          'cmd+3': 'Character',
          'cmd+4': 'Dialogue',
          'cmd+5': 'Parenthetical',
          'cmd+6': 'Transition',
          'cmd+7': 'Shot'
        }
        
        const format = shortcuts[shortcut as keyof typeof shortcuts]
        if (format && ref && 'current' in ref && ref.current) {
          ref.current.formatCurrentLine(format)
        }
      }
    }))

    // Handle line content changes
    const handleLineChange = useCallback((lineId: string, newText: string) => {
      setLines(prevLines => {
        const newLines = prevLines.map(line =>
          line.id === lineId ? { ...line, text: newText } : line
        )
        
        // Update parent component
        setTimeout(() => {
          onChange(linesToText(newLines))
        }, 0)
        
        return newLines
      })
    }, [onChange, linesToText])

    // Handle Enter key press
    const handleKeyDown = useCallback((e: React.KeyboardEvent, lineIndex: number) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        if (ref && 'current' in ref && ref.current) {
          ref.current.addNewLine()
        }
      }
      
      // Arrow key navigation
      if (e.key === 'ArrowUp' && lineIndex > 0) {
        e.preventDefault()
        setActiveLineIndex(lineIndex - 1)
        setTimeout(() => {
          const prevRef = lineRefs.current[lines[lineIndex - 1]?.id]
          prevRef?.focus()
        }, 0)
      }
      
      if (e.key === 'ArrowDown' && lineIndex < lines.length - 1) {
        e.preventDefault()
        setActiveLineIndex(lineIndex + 1)
        setTimeout(() => {
          const nextRef = lineRefs.current[lines[lineIndex + 1]?.id]
          nextRef?.focus()
        }, 0)
      }
      
      // Keyboard shortcuts
      if (e.metaKey || e.ctrlKey) {
        const shortcut = `${e.metaKey ? 'cmd' : 'ctrl'}+${e.key.toLowerCase()}`
        if (ref && 'current' in ref && ref.current) {
          ref.current.handleKeyboardShortcut(shortcut)
        }
      }
    }, [lines, ref])

    // Handle line focus
    const handleLineFocus = useCallback((lineIndex: number) => {
      setLines(prevLines =>
        prevLines.map((line, index) => ({
          ...line,
          isActive: index === lineIndex
        }))
      )
      setActiveLineIndex(lineIndex)
    }, [])

    // Get CSS styles for a line
    const getLineStyles = useCallback((line: ScriptLine) => {
      const spec = FORMAT_SPECS[line.format]
      return {
        fontFamily: 'Courier New, monospace',
        fontSize: '12pt',
        lineHeight: '1.2',
        marginLeft: `${spec.marginLeft}px`,
        marginRight: `${spec.marginRight}px`,
        marginTop: `${spec.marginTop}px`,
        marginBottom: `${spec.marginBottom}px`,
        textAlign: spec.textAlign,
        textTransform: spec.textTransform,
        fontWeight: spec.fontWeight,
        color: line.isActive ? spec.color : '#000',
        backgroundColor: line.isActive ? spec.bgColor : 'transparent',
        borderLeft: line.isActive ? `4px solid ${spec.color}` : 'none',
        paddingLeft: line.isActive ? '8px' : '0px',
        minHeight: '20px',
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none' as const,
        overflow: 'hidden'
      }
    }, [])

    // Preview mode render
    if (isPreviewMode) {
      return (
        <div className={`flex-1 w-full p-8 overflow-y-auto bg-white ${className}`}>
          {lines.map((line, index) => (
            <div
              key={line.id}
              style={getLineStyles(line)}
              title={`Line ${index + 1}: ${line.format}`}
              className="mb-1"
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>
      )
    }

    // Main editor render
    return (
      <div className={`flex-1 flex flex-col ${className} relative`} ref={containerRef}>
        {/* Format Indicator */}
        {showFormatIndicator && (
          <div className="absolute top-4 right-4 z-20 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
            ✓ Formatted as {lines[activeLineIndex]?.format}
          </div>
        )}

        {/* Current Line Format Display */}
        <div className="absolute top-2 right-2 z-10 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border-2">
          <div className="text-xs font-mono">
            <div className="flex items-center mb-1">
              <div 
                className="w-4 h-4 rounded-full mr-2" 
                style={{ backgroundColor: FORMAT_SPECS[lines[activeLineIndex]?.format || 'Action'].color }}
              />
              <span className="font-bold text-sm">
                {lines[activeLineIndex]?.format || 'Action'}
              </span>
            </div>
            <div className="text-xs text-gray-600">
              Line {activeLineIndex + 1} of {lines.length}
            </div>
          </div>
        </div>

        {/* Vertical Line Stack */}
        <div className="flex-1 w-full p-8 overflow-y-auto bg-white">
          <div className="max-w-4xl mx-auto space-y-1">
            {lines.map((line, index) => (
              <div key={line.id} className="relative">
                <textarea
                  ref={(el) => lineRefs.current[line.id] = el}
                  value={line.text}
                  onChange={(e) => handleLineChange(line.id, e.target.value)}
                  onFocus={() => handleLineFocus(index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  style={getLineStyles(line)}
                  placeholder={
                    line.text === '' && index === 0 && lines.length === 1
                      ? placeholder || `🏆 PROFESSIONAL VERTICAL STACK EDITOR

✨ REAL SCREENPLAY WORKFLOW:
• Each line is a separate, editable row
• Press ENTER → creates new line below
• All previous lines remain visible and editable
• Format buttons apply to current line only
• Smart format switching (Character → Dialogue → Action)

🎯 PROFESSIONAL FEATURES:
• Contextual format validation
• Full keyboard navigation (↑↓ arrows)
• Complete keyboard shortcuts (⌘+1-7)
• Industry-standard positioning
• Multi-line scene editing

Ready for professional scriptwriting!`
                      : line.format === 'SceneHeading' && line.text === ''
                      ? 'EXT. COFFEE SHOP - MORNING'
                      : line.format === 'Character' && line.text === ''
                      ? 'SARAH'
                      : line.format === 'Dialogue' && line.text === ''
                      ? 'Character dialogue goes here...'
                      : line.format === 'Parenthetical' && line.text === ''
                      ? '(actor direction)'
                      : line.format === 'Action' && line.text === ''
                      ? 'Scene description and action...'
                      : line.format === 'Transition' && line.text === ''
                      ? 'CUT TO:'
                      : line.format === 'Shot' && line.text === ''
                      ? 'CLOSE UP - SARAH\'S FACE'
                      : ''
                  }
                  rows={1}
                  className="block w-full"
                  spellCheck={false}
                />
                
                {/* Line number indicator */}
                {line.isActive && (
                  <div className="absolute -left-8 top-0 text-xs text-gray-400 leading-5">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Add new line button */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              if (ref && 'current' in ref && ref.current) {
                ref.current.addNewLine()
              }
            }}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400"
          >
            + Add New Line (Enter)
          </button>
        </div>
      </div>
    )
  }
)

ProfessionalVerticalStackEditor.displayName = 'ProfessionalVerticalStackEditor'

export default ProfessionalVerticalStackEditor