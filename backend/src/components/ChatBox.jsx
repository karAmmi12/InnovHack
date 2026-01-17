// src/components/ChatBox.jsx
import { useState, useRef, useEffect } from 'react'
import { useSportAI } from '../hooks/useSportAI'

/**
 * Composant de chat avec l'IA Personal Shopper
 */
export function ChatBox() {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  
  const {
    messages,
    recommendedProducts,
    isLoading,
    currentWeather,
    sendMessage,
    clearChat,
    updateWeather
  } = useSportAI('temps normal')

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue)
      setInputValue('')
    }
  }

  const weatherOptions = [
    { value: 'soleil', label: '☀️ Soleil', emoji: '☀️' },
    { value: 'pluie', label: '🌧️ Pluie', emoji: '🌧️' },
    { value: 'froid', label: '❄️ Froid', emoji: '❄️' },
    { value: 'chaud', label: '🔥 Chaud', emoji: '🔥' },
    { value: 'vent', label: '💨 Vent', emoji: '💨' },
    { value: 'neige', label: '🌨️ Neige', emoji: '🌨️' },
  ]

  return (
    <div className="chat-container" style={styles.container}>
      {/* Header avec sélecteur météo */}
      <div style={styles.header}>
        <h2 style={styles.title}>🏃 Personal Shopper IA</h2>
        <div style={styles.weatherSelector}>
          <label style={styles.weatherLabel}>Météo actuelle :</label>
          <select 
            value={currentWeather} 
            onChange={(e) => updateWeather(e.target.value)}
            style={styles.weatherSelect}
          >
            {weatherOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone de messages */}
      <div style={styles.messagesArea}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>👋 Salut ! Je suis ton conseiller sportif.</p>
            <p style={styles.emptyText}>Dis-moi ce que tu cherches !</p>
            <div style={styles.suggestions}>
              <button 
                onClick={() => sendMessage("Je cherche une tenue pour courir")}
                style={styles.suggestionBtn}
              >
                🏃 Tenue running
              </button>
              <button 
                onClick={() => sendMessage("Il pleut, que me conseilles-tu ?")}
                style={styles.suggestionBtn}
              >
                🌧️ Protection pluie
              </button>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={msg.role === 'user' ? styles.userMessage : styles.aiMessage}
          >
            <div style={styles.messageContent}>
              <strong style={styles.messageRole}>
                {msg.role === 'user' ? '👤 Toi' : '🤖 IA'}
              </strong>
              <p style={styles.messageText}>{msg.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div style={styles.aiMessage}>
            <div style={styles.messageContent}>
              <strong style={styles.messageRole}>🤖 IA</strong>
              <p style={styles.loadingText}>
                <span className="loading-dots">Réflexion en cours...</span>
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Panneau des produits recommandés */}
      {recommendedProducts.length > 0 && (
        <div style={styles.recommendations}>
          <h3 style={styles.recoTitle}>✨ Mes recommandations pour toi :</h3>
          <div style={styles.productsGrid}>
            {recommendedProducts.map((product) => (
              <div key={product.id} style={styles.productCard}>
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={styles.productImage}
                />
                <h4 style={styles.productName}>{product.name}</h4>
                <p style={styles.productPrice}>{product.price}€</p>
                <p style={styles.productStock}>
                  {product.stock_level > 0 
                    ? `✅ En stock (${product.stock_level})`
                    : '❌ Rupture de stock'
                  }
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulaire d'entrée */}
      <form onSubmit={handleSubmit} style={styles.inputForm}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Pose ta question... (ex: je cherche des gants pour le froid)"
          style={styles.input}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          style={styles.sendButton}
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? '⏳' : '📤'}
        </button>
        {messages.length > 0 && (
          <button 
            type="button"
            onClick={clearChat}
            style={styles.clearButton}
          >
            🗑️
          </button>
        )}
      </form>
    </div>
  )
}

// Styles inline pour l'exemple (à remplacer par CSS/Tailwind dans votre projet)
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  weatherSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  weatherLabel: {
    fontSize: '14px',
  },
  weatherSelect: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '14px',
    cursor: 'pointer',
  },
  messagesArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    textAlign: 'center',
    marginTop: '60px',
  },
  emptyText: {
    fontSize: '18px',
    color: '#6b7280',
    margin: '8px 0',
  },
  suggestions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px',
  },
  suggestionBtn: {
    padding: '12px 20px',
    backgroundColor: '#e5e7eb',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '70%',
  },
  aiMessage: {
    alignSelf: 'flex-start',
    maxWidth: '70%',
  },
  messageContent: {
    padding: '12px 16px',
    borderRadius: '12px',
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageRole: {
    fontSize: '12px',
    color: '#6b7280',
    display: 'block',
    marginBottom: '4px',
  },
  messageText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#1f2937',
  },
  loadingText: {
    margin: 0,
    fontSize: '15px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  recommendations: {
    backgroundColor: '#fff7ed',
    padding: '20px',
    borderTop: '2px solid #fb923c',
  },
  recoTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#ea580c',
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px',
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  productName: {
    margin: '0 0 8px 0',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  productPrice: {
    margin: '0 0 4px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  productStock: {
    margin: 0,
    fontSize: '12px',
    color: '#6b7280',
  },
  inputForm: {
    display: 'flex',
    gap: '8px',
    padding: '16px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '15px',
    outline: 'none',
  },
  sendButton: {
    padding: '12px 20px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
    transition: 'background 0.2s',
  },
  clearButton: {
    padding: '12px 16px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '18px',
  },
}
