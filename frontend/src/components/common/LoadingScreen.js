import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const BIBLE_VERSES = [
  {
    text: "For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.",
    reference: "Jeremiah 29:11"
  },
  {
    text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.",
    reference: "Isaiah 40:31"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6"
  },
  {
    text: "Do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
    reference: "Isaiah 41:10"
  },
  {
    text: "The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul.",
    reference: "Psalm 23:1-3"
  },
  {
    text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
    reference: "Joshua 1:9"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28"
  },
  {
    text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.",
    reference: "John 14:27"
  },
  {
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13"
  },
  {
    text: "Cast all your anxiety on him because he cares for you.",
    reference: "1 Peter 5:7"
  }
];

function LoadingScreen({ fadeState, onTransitionEnd }) {
  const [verse, setVerse] = useState({ text: '', reference: '' });

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * BIBLE_VERSES.length);
    setVerse(BIBLE_VERSES[randomIndex]);
  }, []);

  return (
    <div 
      className={`bible-loading-screen ${fadeState}`} 
      onTransitionEnd={onTransitionEnd}
    >
      <div className="bible-loading-content">
        <div className="bible-verse-quote">“{verse.text}”</div>
        <div className="bible-verse-ref">— {verse.reference}</div>
        <div className="bible-loading-indicator">
          <div className="pulse-ring"></div>
          <div className="pulse-dot"></div>
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
