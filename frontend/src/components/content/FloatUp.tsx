'use client'
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css"
import { ReactNode } from 'react';

interface FloatProps {
    children: ReactNode;
  }  

const FloatUp: React.FC<FloatProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAppeared) {
          setHasAppeared(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [hasAppeared]);

  return (
    <div
        ref={ref}
        className={`box ${hasAppeared ? styles.visible : styles.invisible }`}
    >
        {children}
    </div>
  );
}

const FloatDown: React.FC<FloatProps> = ({ children }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [hasAppeared, setHasAppeared] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAppeared) {
            setHasAppeared(true);
          }
        },
        { threshold: 0.1 }
      );
  
      if (ref.current) observer.observe(ref.current);
  
      return () => observer.disconnect();
    }, [hasAppeared]);
  
    return (
      <div
          ref={ref}
          className={`box ${hasAppeared ? styles.visible : styles.invisibledown }`}
      >
          {children}
      </div>
    );
  }
  

export { FloatUp, FloatDown }