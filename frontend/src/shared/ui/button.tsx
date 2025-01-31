import React from "react";
import "../style/button.css";

type ButtonProps = {
  text: string;
  onClick: () => void;
  className?: string; // 추가 스타일 클래스
};

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button className={`button ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
