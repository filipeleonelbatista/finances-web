import { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  indicator?: boolean;
}

const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 70, indicator = false }) => {
  const [displayText, setDisplayText] = useState<string>('');

  useEffect(() => {
    let currentText = "  " + text;

    let currentIndex = 0;
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        setDisplayText(prevText => prevText + (currentText[currentIndex] ? currentText[currentIndex] : ""));
        if (currentIndex === currentText.length - 1) {
          clearInterval(intervalId);
        }
        currentIndex++;
      }, speed);

      return () => clearInterval(intervalId);
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [text, speed]);

  return <p className={indicator ? "typewriterAnimation" : ""} style={{ marginLeft: displayText.length > 0 ? "0px" : "-4px" }}>{displayText}</p>;
};

export default Typewriter;