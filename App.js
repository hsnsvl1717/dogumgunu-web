import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sensitivities, setSensitivities] = useState([]);
  const [sensitivityTypes, setSensitivityTypes] = useState([]);
  const [message, setMessage] = useState(null);
  const [surprise, setSurprise] = useState(null);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Backend URL - production'da değişecek
  const API_URL = process.env.NODE_ENV === 'production' 
    ? 'https://dogumgunu-web.onrender.com' 
    : 'http://localhost:3001';

  useEffect(() => {
    fetchSensitivities();
  }, []);

  const fetchSensitivities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sensitivities`);
      const data = await response.json();
      setSensitivityTypes(data);
    } catch (error) {
      console.error('Hassasiyet türleri yüklenemedi:', error);
    }
  };

  const handleSensitivityChange = (sensitivityId) => {
    setSensitivities(prev => {
      if (prev.includes(sensitivityId)) {
        return prev.filter(id => id !== sensitivityId);
      } else {
        return [...prev, sensitivityId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !birthDate) {
      alert('Lütfen isim ve doğum gününü girin.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/birthday-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, birthDate, sensitivities }),
      });

      const data = await response.json();
      setMessage(data);
      setStep(2);
    } catch (error) {
      console.error('Mesaj alınamadı:', error);
      alert('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurprise = async () => {
    try {
      const response = await fetch(`${API_URL}/api/surprises/${name}`);
      const data = await response.json();
      setSurprise(data.surprise);
      setStep(3);
    } catch (error) {
      console.error('Sürpriz alınamadı:', error);
    }
  };

  const resetForm = () => {
    setName('');
    setBirthDate('');
    setSensitivities([]);
    setMessage(null);
    setSurprise(null);
    setStep(1);
  };

  if (step === 1) {
    return (
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>🎉 Doğum Günün Kutlu Olsun! 🎉</h1>
            <p>Senin için özel bir deneyim hazırladık</p>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="name">İsmin:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="İsmini yaz..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Doğum Günün:</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Hassasiyetlerin (İsteğe bağlı):</label>
              <div className="sensitivities">
                {sensitivityTypes.map((sensitivity) => (
                  <label key={sensitivity.id} className="sensitivity-item">
                    <input
                      type="checkbox"
                      checked={sensitivities.includes(sensitivity.id)}
                      onChange={() => handleSensitivityChange(sensitivity.id)}
                    />
                    <span>{sensitivity.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Hazırlanıyor...' : 'Özel Mesajımı Al'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 2 && message) {
    return (
      <div className="App">
        <div className="container">
          <div className="message-container">
            <h2 className="greeting">{message.greeting}</h2>
            
            <div className="message-card">
              <h3>🎂 Doğum Günü Mesajın</h3>
              <p className="birthday-message">{message.birthdayMessage}</p>
            </div>

            <div className="message-card zodiac-card">
              <h3>⭐ Burç Özelliklerin</h3>
              <div className="zodiac-info">
                <h4 className="zodiac-personality">{message.zodiac.name}</h4>
                <p className="zodiac-message">{message.zodiac.message}</p>
                <div className="zodiac-details">
                  <div className="zodiac-strength">
                    <strong>💪 Gücün:</strong> {message.zodiac.strength}
                  </div>
                  <div className="zodiac-purpose">
                    <strong>🎯 Amacın:</strong> {message.zodiac.purpose}
                  </div>
                </div>
              </div>
            </div>

            <div className="message-card">
              <h3>🌟 Yaşam Amacın</h3>
              <p className="life-purpose">{message.lifePurpose}</p>
            </div>

            <div className="buttons">
              <button onClick={handleSurprise} className="surprise-btn">
                🎁 Sürprizimi Göster
              </button>
              <button onClick={resetForm} className="reset-btn">
                🔄 Yeni Mesaj Al
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 3 && surprise) {
    return (
      <div className="App">
        <div className="container">
          <div className="surprise-container">
            <h2>🎁 Senin İçin Özel Bir Sürpriz!</h2>
            
            <div className="surprise-card">
              <h3>{surprise.title}</h3>
              <div className="surprise-content">
                {surprise.type === 'poem' ? (
                  <pre className="poem">{surprise.content}</pre>
                ) : (
                  <p className="quote">{surprise.content}</p>
                )}
              </div>
            </div>

            <div className="buttons">
              <button onClick={resetForm} className="reset-btn">
                🏠 Ana Sayfaya Dön
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;
