import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';

// Avatar-Komponente
function Avatar() {
  const gltf = useGLTF('https://models.readyplayer.me/684a93d82f4b144e199ecea7.glb');
  return <primitive object={gltf.scene} scale={1.8} position={[0, -2.2, 0]} />;
}

export default function App() {
  const [isListening, setIsListening] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Speech-to-Text (Browser API)
  const handleSpeech = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setIsListening(true);

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Erkannt:", transcript);
      setIsListening(false);
      await sendToWebUI(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event);
      setIsListening(false);
    };
  };

  const sendToWebUI = async (prompt) => {
    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFlYWUwY2Y3LWU0MzAtNGY2OS04MjIwLTYyYWNjNGE1YmY0MiJ9.puhsZOn4eZkitutJq4N9xrUMn6i6qac5OLl0TcZvTH4'
        },
        body: JSON.stringify({
          model: 'llama3:8b',
          messages: [
            { role: "system", content: "Du simulierst ein Angehörigengespräch in der Logopädie. Antworte empathisch, freundlich und realistisch." },
            { role: "user", content: prompt }
          ]
        })
      });

      const data = await response.json();
      console.log("WebUI Antwort:", data);

      const content = data.choices[0].message.content;
      setResponseText(content);

      // Browser Text-to-Speech Fallback
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Fehler beim WebUI Request:", error);
    }
  };

  return (
    <div className="App" style={{
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#000', marginTop: '20px', fontSize: '2.5rem', textAlign: 'center' }}>
        Willkommen zur interaktiven Logopädie-Sprechstunde:<br /> Angehörigengespräche realistisch üben
      </h1>

      <div style={{ width: '100%', height: '70%' }}>
        <Canvas camera={{ position: [0, 1.5, 4] }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} />
          <Suspense fallback={null}>
            <Avatar />
            <Environment preset="sunset" />
            <OrbitControls />
          </Suspense>
        </Canvas>
      </div>

      <button onClick={handleSpeech} style={{
        marginTop: '20px',
        padding: '20px 40px',
        fontSize: '1.5rem',
        borderRadius: '50px',
        border: 'none',
        background: isListening ? '#ff4d4d' : '#4CAF50',
        color: '#fff',
        cursor: 'pointer'
      }}>
        {isListening ? "Höre zu..." : "🎙️ Sprechen"}
      </button>

      <div style={{ marginTop: '20px', width: '80%', fontSize: '1.2rem', color: '#333' }}>
        <strong>Antwort:</strong> {responseText}
      </div>
    </div>
  );
}
