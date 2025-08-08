import React, { useRef, forwardRef, useImperativeHandle, useCallback, useEffect, useState } from 'react'
import { detectElementType, formatLineWithIndentation } from '../utils/professionalFormatter'

// Industry-standard color coding for screenplay elements
const ELEMENT_COLORS = {
  scene_heading: { bg: '#e3f2fd', border: '#1976d2', text: '#0d47a1' }, // Blue
  character: { bg: '#ffebee', border: '#d32f2f', text: '#c62828' }, // Red
  dialogue: { bg: '#f3e5f5', border: '#7b1fa2', text: '#4a148c' }, // Purple
  parenthetical: { bg: '#fff3e0', border: '#f57c00', text: '#e65100' }, // Orange
  action: { bg: '#e8f5e8', border: '#388e3c', text: '#1b5e20' }, // Green
  transition: { bg: '#fce4ec', border: '#c2185b', text: '#880e4f' }, // Pink
  shot: { bg: '#e1f5fe', border: '#0288d1', text: '#01579b' } // Light Blue
}

export interface ScriptEditorRef {
  formatCurrentLine: (elementType: string) => void
  insertTextAtCursor: (text: string) => void
  focus: () => void
  getCurrentLine: () => string
  getCurrentElementType: () => string
}

interface WorkingScriptEditorProps {
  value: string
  onChange: (value: string) => void
  isPreviewMode: boolean
  className?: string
  placeholder?: string
}

const WorkingScriptEditor = forwardRef<ScriptEditorRef, WorkingScriptEditorProps>(
  ({ value, onChange, isPreviewMode, className = '', placeholder }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [cursorPosition, setCursorPosition] = useState({ line: 0, col: 0 })
    const [activeElement, setActiveElement] = useState<string>('action')
    const [showTooltip, setShowTooltip] = useState(false)
    const [tooltipElement, setTooltipElement] = useState<string>('')

    useImperativeHandle(ref, () => ({
      formatCurrentLine: (elementType: string) => {
        console.log('🎬 Format button clicked:', elementType)
        if (!textareaRef.current) return
        
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        
        console.log('📍 Cursor position:', start, 'to', end)
        
        // Get current line boundaries
        const beforeCursor = value.substring(0, start)
        const afterCursor = value.substring(end)
        const lastNewline = beforeCursor.lastIndexOf('\n')
        const nextNewline = afterCursor.indexOf('\n')
        
        const lineStart = lastNewline + 1
        const lineEnd = nextNewline === -1 ? value.length : end + nextNewline
        const currentLine = value.substring(lineStart, lineEnd)
        
        console.log('📝 Current line:', `"${currentLine}"`)
        
        // Format the line with professional indentation
        const formattedLine = formatLineWithIndentation(currentLine, elementType)
        console.log('✨ Formatted line:', `"${formattedLine}"`)
        
        // Replace the current line
        const newValue = value.substring(0, lineStart) + formattedLine + value.substring(lineEnd)
        onChange(newValue)
        
        // Show tooltip for element positioning
        setTooltipElement(elementType)
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
        
        // Enhanced cursor positioning with visual guides and tooltips
        setTimeout(() => {
          let newCursorPos = lineStart + formattedLine.length
          
          // Move cursor to next line for certain elements (Celtx behavior)
          if (elementType === 'character') {
            // After character formatting, move to next line and prepare for dialogue
            if (!newValue.substring(newCursorPos).startsWith('\n')) {
              const withNewLine = newValue + '\n'
              onChange(withNewLine)
              newCursorPos = withNewLine.length
            } else {
              newCursorPos += 1
            }
          } else if (elementType === 'scene_heading') {
            // After scene heading, move to next line for action
            if (!newValue.substring(newCursorPos).startsWith('\n\n')) {
              const withNewLines = newValue + '\n\n'
              onChange(withNewLines)
              newCursorPos = withNewLines.length
            } else {
              newCursorPos += 2
            }
          }
          
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
          
          // Visual feedback for cursor position with element color
          const elementColor = ELEMENT_COLORS[elementType as keyof typeof ELEMENT_COLORS]?.border || '#f97316'
          textarea.style.caretColor = elementColor
          
          // Update active element for visual feedback
          setActiveElement(elementType)
          updateCursorPosition()
          
          console.log('✅ Format complete! New cursor position:', newCursorPos)
        }, 0)
      },

      insertTextAtCursor: (text: string) => {
        if (!textareaRef.current) return
        
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        
        const newValue = value.substring(0, start) + text + value.substring(end)
        onChange(newValue)
        
        setTimeout(() => {
          const newCursorPos = start + text.length
          textarea.setSelectionRange(newCursorPos, newCursorPos)
          textarea.focus()
        }, 0)
      },

      focus: () => {
        textareaRef.current?.focus()
      },

      getCurrentLine: () => {
        if (!textareaRef.current) return ''
        
        const start = textareaRef.current.selectionStart
        const beforeCursor = value.substring(0, start)
        const afterCursor = value.substring(start)
        const lastNewline = beforeCursor.lastIndexOf('\n')
        const nextNewline = afterCursor.indexOf('\n')
        
        const lineStart = lastNewline + 1
        const lineEnd = nextNewline === -1 ? value.length : start + nextNewline
        return value.substring(lineStart, lineEnd)
      },

      getCurrentElementType: () => {
        if (!textareaRef.current) return 'action'
        
        const lines = value.split('\n')
        const start = textareaRef.current.selectionStart
        const beforeCursor = value.substring(0, start)
        const currentLineIndex = beforeCursor.split('\n').length - 1
        
        return detectElementType(lines[currentLineIndex] || '', lines, currentLineIndex)
      }
    }))

    // Update cursor position for visual feedback
    const updateCursorPosition = useCallback(() => {
      if (!textareaRef.current) return
      
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const beforeCursor = value.substring(0, start)
      const lines = beforeCursor.split('\n')
      const currentLine = lines.length - 1
      const currentCol = lines[lines.length - 1].length
      
      setCursorPosition({ line: currentLine, col: currentCol })
      
      // Detect and set active element type
      const allLines = value.split('\n')
      const elementType = detectElementType(allLines[currentLine] || '', allLines, currentLine)
      setActiveElement(elementType)
    }, [value])

    // Handle cursor position updates
    useEffect(() => {
      updateCursorPosition()
    }, [value, updateCursorPosition])

    // Get tooltip content for elements
    const getTooltipContent = (elementType: string) => {
      const tooltips = {
        scene_heading: 'Scene Heading: Left margin, all caps. Describes location and time.',
        character: 'Character: Centered at 3.7". Speaker\'s name in all caps.',
        dialogue: 'Dialogue: 1.5" left margin, 2.5" right margin. Character\'s speech.',
        parenthetical: 'Parenthetical: Centered at 2". Actor direction in (parentheses).',
        action: 'Action: Left margin to 1" right. Scene description and action.',
        transition: 'Transition: Right aligned. Scene change like "CUT TO:"',
        shot: 'Shot: Left margin. Camera direction like "CLOSE UP"'
      }
      return tooltips[elementType as keyof typeof tooltips] || 'Unknown element type'
    }

    const getElementCSS = (elementType: string, isSelected: boolean = false): React.CSSProperties => {
      const colorScheme = ELEMENT_COLORS[elementType as keyof typeof ELEMENT_COLORS] || ELEMENT_COLORS.action
      
      const baseStyle: React.CSSProperties = {
        fontFamily: 'Courier New, monospace',
        fontSize: '12pt',
        lineHeight: '1.2',
        minHeight: '14.4px',
        marginBottom: '0px',
        color: colorScheme.text,
        backgroundColor: isSelected ? colorScheme.bg : 'transparent',
        borderLeft: isSelected ? `4px solid ${colorScheme.border}` : 'none',
        paddingLeft: isSelected ? '8px' : '0px',
        transition: 'all 0.2s ease',
        position: 'relative'
      }

      const styles: Record<string, React.CSSProperties> = {
        scene_heading: {
          ...baseStyle,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          marginLeft: '0px',
          marginTop: '24px'
        },
        character: {
          ...baseStyle,
          fontWeight: 'bold', 
          textTransform: 'uppercase',
          textAlign: 'center',
          marginLeft: '220px', // 3.7 inches - Celtx style
          marginTop: '12px'
        },
        dialogue: {
          ...baseStyle,
          marginLeft: '100px', // 1.5 inches
          marginRight: '120px', // 2.5 inches from right
          marginTop: '0px'
        },
        parenthetical: {
          ...baseStyle,
          fontStyle: 'italic',
          textAlign: 'center',
          marginLeft: '160px', // 2 inches
          marginTop: '0px'
        },
        action: {
          ...baseStyle,
          marginLeft: '0px',
          marginRight: '60px', // 1 inch
          marginTop: '12px'
        },
        transition: {
          ...baseStyle,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'right',
          marginTop: '12px'
        },
        shot: {
          ...baseStyle,
          fontWeight: 'bold',
          textTransform: 'uppercase', 
          marginLeft: '0px',
          marginTop: '12px'
        }
      }
      
      return styles[elementType] || styles.action
    }

    if (isPreviewMode) {
      return (
        <div className={`flex-1 w-full p-8 overflow-y-auto bg-white ${className}`}>
          {value.split('\n').map((line, index) => {
            const lines = value.split('\n')
            const elementType = detectElementType(line, lines, index)
            const isCurrentLine = index === cursorPosition.line
            const elementCSS = getElementCSS(elementType, isCurrentLine)
            
            return (
              <div 
                key={index} 
                style={elementCSS}
                title={`${elementType.replace('_', ' ').toUpperCase()}: ${getTooltipContent(elementType)}`}
                className={`screenplay-${elementType.replace('_', '-')} ${isCurrentLine ? 'current-line' : ''}`}
              >
                {isCurrentLine && (
                  <div className="absolute -left-4 top-0 w-2 h-full bg-orange-400 rounded-r" />
                )}
                {line || '\u00A0'}
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className={`flex-1 flex flex-col ${className} relative`}>
        {/* Position Guide Overlay */}
        <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-sm border">
          <div className="text-xs font-mono text-gray-600">
            <div>Line {cursorPosition.line + 1}, Col {cursorPosition.col + 1}</div>
            <div className="flex items-center mt-1">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: ELEMENT_COLORS[activeElement as keyof typeof ELEMENT_COLORS]?.border || '#6b7280' }}
              />
              <span className="capitalize text-xs font-semibold">
                {activeElement.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-16 left-8 z-20 bg-black text-white text-sm rounded-lg px-3 py-2 max-w-md shadow-lg">
            <div className="font-semibold mb-1 capitalize">{tooltipElement.replace('_', ' ')} Positioned</div>
            <div className="text-xs opacity-90">{getTooltipContent(tooltipElement)}</div>
            <div className="absolute -top-1 left-4 w-2 h-2 bg-black transform rotate-45" />
          </div>
        )}

        {/* Simple Working Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            updateCursorPosition()
          }}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          placeholder={placeholder || `FADE IN:

EXT. YOUR STORY - DAY

Start writing your professional screenplay here...

🎬 TESTING FEATURES:
• Click CHARACTER button, type "HEMANT", then click DIALOGUE
• Click SCENE HEADING button for "INT. OFFICE - DAY"  
• Click ACTION button for scene description
• All format buttons should work properly!

FADE OUT.`}
          className="flex-1 w-full p-8 border-none outline-none resize-none bg-white"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '12pt',
            lineHeight: '1.2',
            color: '#000000',
            backgroundColor: '#ffffff',
            caretColor: ELEMENT_COLORS[activeElement as keyof typeof ELEMENT_COLORS]?.border || '#f97316'
          }}
          spellCheck={false}
        />
      </div>
    )
  }
)

WorkingScriptEditor.displayName = 'WorkingScriptEditor'

export default WorkingScriptEditor