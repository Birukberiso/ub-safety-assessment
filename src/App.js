import React, { useState } from 'react';
import Header from './Header';
import Welcome from './Welcome';
import Quiz from './Quiz';
import Results from './Results';

const SCREEN = { WELCOME: 'welcome', QUIZ: 'quiz', RESULTS: 'results' };

export default function App() {
  const [screen, setScreen] = useState(SCREEN.WELCOME);
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);

  function handleStart(visitorName) {
    setName(visitorName);
    setScreen(SCREEN.QUIZ);
  }

  function handleFinish(data) {
    setResult(data);
    setScreen(SCREEN.RESULTS);
  }

  function handleReset() {
    setResult(null);
    setName('');
    setScreen(SCREEN.WELCOME);
  }

  const labels = {
    [SCREEN.WELCOME]: 'KIOSK MODE',
    [SCREEN.QUIZ]: 'IN PROGRESS',
    [SCREEN.RESULTS]: 'RESULTS',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
      <Header label={labels[screen]} />
      {screen === SCREEN.WELCOME && <Welcome onStart={handleStart} />}
      {screen === SCREEN.QUIZ    && <Quiz name={name} onFinish={handleFinish} />}
      {screen === SCREEN.RESULTS && (
        <Results
          name={name}
          order={result.order}
          answers={result.answers}
          elapsed={result.elapsed}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
