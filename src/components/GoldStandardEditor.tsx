import React, { useRef, forwardRef, useImperativeHandle, useCallback, useEffect, useState } from 'react'
import { detectElementType } from '../utils/professionalFormatter'

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

// Professional screenplay formatting positions (matching PDF output)
const FORMAT_STYLES = {
  scene_heading: {
    marginLeft: '0px',
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    color: ELEMENT_COLORS.scene_heading.text,
    backgroundColor: ELEMENT_COLORS.scene_heading.bg
  },
  character: {
    marginLeft: '220px', // 3.7" - centered
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    color: ELEMENT_COLORS.character.text,
    backgroundColor: ELEMENT_COLORS.character.bg
  },
  dialogue: {
    marginLeft: '100px', // 1.5" indent
    textAlign: 'left' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    color: ELEMENT_COLORS.dialogue.text,
    backgroundColor: ELEMENT_COLORS.dialogue.bg
  },
  parenthetical: {
    marginLeft: '160px', // 2" centered
    textAlign: 'center' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    color: ELEMENT_COLORS.parenthetical.text,
    backgroundColor: ELEMENT_COLORS.parenthetical.bg
  },
  action: {
    marginLeft: '0px',
    textAlign: 'left' as const,
    textTransform: 'none' as const,
    fontWeight: 'normal' as const,
    color: ELEMENT_COLORS.action.text,
    backgroundColor: ELEMENT_COLORS.action.bg
  },
  transition: {
    marginLeft: '0px',
    textAlign: 'right' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    color: ELEMENT_COLORS.transition.text,
    backgroundColor: ELEMENT_COLORS.transition.bg
  },
  shot: {
    marginLeft: '0px',
    textAlign: 'left' as const,
    textTransform: 'uppercase' as const,
    fontWeight: 'bold' as const,
    color: ELEMENT_COLORS.shot.text,
    backgroundColor: ELEMENT_COLORS.shot.bg
  }
}

export interface ScriptEditorRef {
  formatCurrentLine: (elementType: string) => void
  insertTextAtCursor: (text: string) => void
  focus: () => void
  getCurrentLine: () => string
  getCurrentElementType: () => string
}

interface GoldStandardEditorProps {
  value: string
  onChange: (value: string) => void
  isPreviewMode: boolean
  className?: string
  placeholder?: string
}

const GoldStandardEditor = forwardRef<ScriptEditorRef, GoldStandardEditorProps>(
  ({ value, onChange, isPreviewMode, className = '', placeholder }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [currentFormatMode, setCurrentFormatMode] = useState<string>('action') // GOLD STANDARD: Active format mode
    const [cursorPosition, setCursorPosition] = useState({ line: 0, col: 0 })
    const [showTooltip, setShowTooltip] = useState(false)

    useImperativeHandle(ref, () => ({
      formatCurrentLine: (elementType: string) => {
        console.log('🎯 GOLD STANDARD: Format mode set to:', elementType)
        
        // GOLD STANDARD BEHAVIOR:
        // 1. Set the active format mode
        setCurrentFormatMode(elementType)
        
        // 2. Show tooltip for 3 seconds
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 3000)
        
        // 3. Focus the editor so user can start typing immediately
        if (textareaRef.current) {
          textareaRef.current.focus()
          
          // 4. Apply the formatting style to the textarea immediately
          applyCurrentFormatStyle(elementType)
        }
        
        console.log('✨ Ready to type in', elementType, 'format!')
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
        return currentFormatMode // Return current active mode
      }
    }))

    // Apply formatting style to textarea based on current mode
    const applyCurrentFormatStyle = useCallback((formatType: string) => {
      if (!textareaRef.current) return
      
      const textarea = textareaRef.current
      const style = FORMAT_STYLES[formatType as keyof typeof FORMAT_STYLES] || FORMAT_STYLES.action
      
      // Apply styles to the textarea for real-time formatting
      textarea.style.textAlign = style.textAlign
      textarea.style.textTransform = style.textTransform
      textarea.style.fontWeight = style.fontWeight
      textarea.style.color = style.color
      textarea.style.backgroundColor = style.backgroundColor
      textarea.style.paddingLeft = style.marginLeft
      textarea.style.caretColor = ELEMENT_COLORS[formatType as keyof typeof ELEMENT_COLORS]?.border || '#f97316'
      
      console.log('📝 Applied formatting style:', formatType, style)
    }, [])

    // Handle key presses for smart formatting
    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        console.log('⏎ Enter pressed in format mode:', currentFormatMode)
        
        // GOLD STANDARD: Smart format switching on Enter
        setTimeout(() => {
          let nextFormat = 'action' // Default fallback
          
          switch (currentFormatMode) {
            case 'scene_heading':
              nextFormat = 'action' // Scene heading → Action
              break
            case 'character':
              nextFormat = 'dialogue' // Character → Dialogue  
              break
            case 'dialogue':
              nextFormat = 'action' // Dialogue → Action (or stay in dialogue)
              break
            case 'parenthetical':
              nextFormat = 'dialogue' // Parenthetical → back to Dialogue
              break
            case 'action':
              nextFormat = 'action' // Action stays in action
              break
            case 'transition':
              nextFormat = 'scene_heading' // Transition → new scene
              break
            case 'shot':
              nextFormat = 'action' // Shot → Action
              break
          }
          
          console.log('🔄 Auto-switching format:', currentFormatMode, '→', nextFormat)
          setCurrentFormatMode(nextFormat)
          applyCurrentFormatStyle(nextFormat)
        }, 0)
      }
      
      // Handle special formatting for parenthetical and transitions
      if (currentFormatMode === 'parenthetical' && e.key !== 'Backspace' && e.key !== 'Delete') {
        // Auto-wrap parenthetical in parentheses
        const currentLine = getCurrentLine()
        if (!currentLine.startsWith('(') && currentLine.length === 0) {
          // Add opening parenthesis
          setTimeout(() => {
            if (textareaRef.current) {
              const start = textareaRef.current.selectionStart
              const newValue = value.substring(0, start) + '(' + value.substring(start)
              onChange(newValue)
              textareaRef.current.setSelectionRange(start + 1, start + 1)
            }
          }, 0)
        }
      }
    }, [currentFormatMode, value, onChange, applyCurrentFormatStyle])

    // Get current line for parenthetical logic
    const getCurrentLine = useCallback(() => {
      if (!textareaRef.current) return ''
      
      const start = textareaRef.current.selectionStart
      const beforeCursor = value.substring(0, start)
      const afterCursor = value.substring(start)
      const lastNewline = beforeCursor.lastIndexOf('\n')
      const nextNewline = afterCursor.indexOf('\n')
      
      const lineStart = lastNewline + 1
      const lineEnd = nextNewline === -1 ? value.length : start + nextNewline
      return value.substring(lineStart, lineEnd)
    }, [value])

    // Apply current format on component mount and when mode changes
    useEffect(() => {
      applyCurrentFormatStyle(currentFormatMode)
    }, [currentFormatMode, applyCurrentFormatStyle])

    // Update cursor position tracking
    const updateCursorPosition = useCallback(() => {
      if (!textareaRef.current) return
      
      const textarea = textareaRef.current
      const start = textarea.selectionStart
      const beforeCursor = value.substring(0, start)
      const lines = beforeCursor.split('\n')
      const currentLine = lines.length - 1
      const currentCol = lines[lines.length - 1].length
      
      setCursorPosition({ line: currentLine, col: currentCol })
    }, [value])

    useEffect(() => {
      updateCursorPosition()
    }, [value, updateCursorPosition])

    // Get tooltip content
    const getTooltipContent = (elementType: string) => {
      const tooltips = {
        scene_heading: '🎬 Scene Heading Mode: Type location and time (e.g., "INT. OFFICE - DAY")',
        character: '👤 Character Mode: Type character name (will be centered and uppercase)',
        dialogue: '💬 Dialogue Mode: Type character\'s speech (indented properly)',
        parenthetical: '📝 Parenthetical Mode: Type actor direction (will be wrapped in parentheses)',
        action: '🎭 Action Mode: Type scene description (left-aligned)',
        transition: '🎞️ Transition Mode: Type transition (e.g., "CUT TO:", right-aligned)',
        shot: '📷 Shot Mode: Type camera direction (e.g., "CLOSE UP")'
      }
      return tooltips[elementType as keyof typeof tooltips] || 'Type in this format mode'
    }

    if (isPreviewMode) {
      return (
        <div className={`flex-1 w-full p-8 overflow-y-auto bg-white ${className}`}>
          {value.split('\n').map((line, index) => {
            const lines = value.split('\n')
            const elementType = detectElementType(line, lines, index)
            const isCurrentLine = index === cursorPosition.line
            const style = FORMAT_STYLES[elementType as keyof typeof FORMAT_STYLES] || FORMAT_STYLES.action
            
            return (
              <div 
                key={index} 
                style={{
                  fontFamily: 'Courier New, monospace',
                  fontSize: '12pt',
                  lineHeight: '1.2',
                  minHeight: '14.4px',
                  marginBottom: '0px',
                  ...style,
                  backgroundColor: isCurrentLine ? style.backgroundColor : 'transparent',
                  borderLeft: isCurrentLine ? `4px solid ${ELEMENT_COLORS[elementType as keyof typeof ELEMENT_COLORS]?.border}` : 'none',
                  paddingLeft: isCurrentLine ? '8px' : style.marginLeft,
                  paddingRight: '8px'
                }}
                title={`${elementType.replace('_', ' ').toUpperCase()}`}
                className={`screenplay-${elementType.replace('_', '-')}`}
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
        {/* Current Format Mode Indicator */}
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
            <div className="text-xs text-gray-600">Line {cursorPosition.line + 1}, Col {cursorPosition.col + 1}</div>
            <div className="text-xs font-semibold mt-1" 
                 style={{ color: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.text }}>
              Start typing!
            </div>
          </div>
        </div>

        {/* Format Mode Tooltip */}
        {showTooltip && (
          <div className="absolute top-20 right-2 z-20 text-white text-sm rounded-lg px-4 py-3 max-w-md shadow-xl"
               style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }}>
            <div className="font-semibold mb-1">
              {currentFormatMode.replace('_', ' ').toUpperCase()} Mode Active
            </div>
            <div className="text-xs opacity-90">
              {getTooltipContent(currentFormatMode)}
            </div>
            <div className="absolute -top-2 right-4 w-4 h-4 transform rotate-45"
                 style={{ backgroundColor: ELEMENT_COLORS[currentFormatMode as keyof typeof ELEMENT_COLORS]?.border }} />
          </div>
        )}

        {/* GOLD STANDARD Editor */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            updateCursorPosition()
          }}
          onKeyDown={handleKeyDown}
          onSelect={updateCursorPosition}
          onClick={updateCursorPosition}
          placeholder={placeholder || `🎬 GOLD STANDARD SCREENPLAY EDITOR

✨ How to use:
1. Click any FORMAT BUTTON (Character, Scene Heading, etc.)
2. Start typing immediately - see real-time formatting!
3. Press ENTER to auto-switch to next logical format
4. See your active format mode in top-right corner

🎯 EXAMPLE WORKFLOW:
• Click SCENE HEADING → Type "INT. OFFICE - DAY" → Press Enter
• Click CHARACTER → Type "HEMANT" → Press Enter  
• Now in DIALOGUE mode → Type character's speech
• Press Enter → Back to ACTION mode

Ready to create professional screenplays!`}
          className="flex-1 w-full p-8 border-none outline-none resize-none relative z-10"
          style={{
            fontFamily: 'Courier New, monospace',
            fontSize: '12pt',
            lineHeight: '1.2',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease'
          }}
          spellCheck={false}
        />
      </div>
    )
  }
)

GoldStandardEditor.displayName = 'GoldStandardEditor'

export default GoldStandardEditor