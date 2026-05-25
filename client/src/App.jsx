import { useState, useEffect } from 'react';
import socket from './socket';
import LandingPage    from './components/LandingPage';
import OnboardScreen  from './components/OnboardScreen';
import NearbyScreen   from './components/NearbyScreen';
import ChatScreen     from './components/ChatScreen';
import PrivacyPage    from './components/PrivacyPage';
import TermsPage      from './components/TermsPage';

export default function App() {
  var [screen, setScreen] = useState('landing'); // landing | onboard | nearby | chat | privacy | terms
  var [me, setMe]         = useState(null);
  var [chatData, setChatData] = useState(null);
  var [prevScreen, setPrevScreen] = useState('landing');

  useEffect(function() {
    socket.on('presence:expired', function() {
      socket.disconnect();
      setScreen('onboard');
      setMe(null);
    });
    return function() { socket.off('presence:expired'); };
  }, []);

  function showLegal(page) {
    setPrevScreen(screen);
    setScreen(page);
  }

  function backFromLegal() {
    setScreen(prevScreen);
  }

  function handleReady(data) {
    setMe(data);
    if (socket.connected) {
      socket.emit('go_live', { ...data, radiusKm: 5 });
    } else {
      socket.connect();
      socket.once('connect', function() {
        socket.emit('go_live', { ...data, radiusKm: 5 });
      });
    }
    setScreen('nearby');
  }

  function handleGoOffline() {
    socket.emit('go_offline');
    socket.disconnect();
    setScreen('landing');
    setMe(null);
  }

  function handleChatStarted(data) {
    setChatData(data);
    setScreen('chat');
  }

  function handleEndChat() {
    socket.emit('go_offline');
    socket.disconnect();
    setScreen('landing');
    setMe(null);
    setChatData(null);
  }

  if (screen === 'privacy') return <PrivacyPage onBack={backFromLegal} />;
  if (screen === 'terms')   return <TermsPage   onBack={backFromLegal} />;
  if (screen === 'landing') return (
    <LandingPage
      onGetStarted={function() { setScreen('onboard'); }}
      onShowPrivacy={function() { showLegal('privacy'); }}
      onShowTerms={function()   { showLegal('terms');   }}
    />
  );
  if (screen === 'onboard') return <OnboardScreen onReady={handleReady} />;
  if (screen === 'nearby')  return (
    <NearbyScreen
      me={me}
      onChatStarted={handleChatStarted}
      onGoOffline={handleGoOffline}
    />
  );
  if (screen === 'chat') return (
    <ChatScreen
      chatData={chatData}
      myName={me?.name}
      onEnd={handleEndChat}
    />
  );
  return null;
}
