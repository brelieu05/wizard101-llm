import { useState, useEffect, useRef } from "react"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

function App(): React.JSX.Element {
  const [text, setText] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [text])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message to ChatGPT
  const sendMessage = async (): Promise<void> => {
    if (!text.trim() || !apiKey.trim()) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    setMessages(prev => [...prev, userMessage])
    setText("")
    setIsLoading(true)

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [...messages, userMessage],
          max_tokens: 500,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }
ss
      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error calling ChatGPT:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your request.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <div className="fixed top-4 right-4 text-white max-w-sm bg-gray-800/50 hover:bg-gray-800/90 p-3 rounded transition-all duration-300">
        {/* API Key Input */}
        <input
          type="password"
          placeholder="Enter OpenAI API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full bg-gray-700/50 text-white text-xs p-2 rounded mb-3 focus:outline-none focus:bg-gray-700/75"
        />
        
        {/* Chat Messages */}
        <div className="max-h-96 overflow-y-auto mb-3 space-y-2">
          {messages.map((message, index) => (
            <div key={index} className={`text-sm p-2 rounded ${
              message.role === 'user' 
                ? 'bg-blue-600/30 text-blue-100 ml-4' 
                : 'bg-gray-600/30 text-gray-100 mr-4'
            }`}>
              <div className="font-semibold text-xs mb-1 opacity-75">
                {message.role === 'user' ? 'You' : 'ChatGPT'}
              </div>
              <div>{message.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-600/30 text-gray-100 mr-4 text-sm p-2 rounded">
              <div className="font-semibold text-xs mb-1 opacity-75">ChatGPT</div>
              <div>Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <textarea
          ref={textareaRef}
          className="w-full hover:bg-gray-800/50 border-white text-white focus:outline-none focus:bg-gray-800/75 max-w-full resize-none bg-transparent text-sm rounded-md"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message and press Enter..."
          rows={1}
          style={{ 
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            scrollbarWidth: 'none',
            minHeight: '2.5rem',
            maxHeight: '25rem',
            overflowY: 'auto'
          }}
        />
      </div>
    </>
  )
}

export default App
