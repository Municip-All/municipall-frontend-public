import React from 'react';
import './SplitText.scss';

interface SplitTextProps {
  text: string;
  className?: string;
  baseDelay?: number;
  step?: number;
  as?: 'span' | 'h1' | 'h2' | 'p';
}

export const SplitText: React.FC<SplitTextProps> = ({ text, className = '', baseDelay = 0, step = 0.05, as = 'span' }) => {
  const Tag = as as React.ElementType;
  const words = text.split(' ');

  return (
    <Tag className={`split-text ${className}`.trim()}>
      <span className="split-text__sr-only">{text}</span>
      <span aria-hidden="true" className="split-text__visible">
        {words.map((word, i) => (
          <span className="split-text__word-mask" key={i}>
            <span className="split-text__word" style={{ animationDelay: `${baseDelay + i * step}s` }}>
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
};
