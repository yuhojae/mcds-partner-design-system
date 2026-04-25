/**
 * MCDS Select Component
 * 피그마 기반 제작 — 크로스플랫폼 상품 어드민
 *
 * Design tokens:
 *  height: 36px
 *  border: 1px solid #D9D9D9 (gray/85)
 *  border-radius: 4px (var(--dimension/borderradius-4))
 *  padding: 8px (var(--dimension/spacing-8))
 *  text: 14px regular, #1A1A1A (gray/10)
 *  placeholder: #808080 (gray/50)
 *  disabled border: #B8B8B8 (gray/70)
 *  focus border: #2B52F0 (blue/40, Primary)
 *  dropdown bg: #FFFFFF
 *  option hover bg: #F2F2F2 (gray/95)
 */

import React, { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** 옵션 목록 */
  options: SelectOption[];
  /** 현재 선택된 값 (controlled) */
  value?: string;
  /** 기본 선택값 (uncontrolled) */
  defaultValue?: string;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** 값 변경 콜백 */
  onChange?: (value: string) => void;
  /** 비활성화 */
  disabled?: boolean;
  /** 너비 (기본: 100%) */
  width?: number | string;
  /** 컴포넌트 크기 */
  size?: '32' | '36' | '40';
  /** 에러 상태 */
  error?: boolean;
  /** label 텍스트 */
  label?: string;
  /** 필수 여부 */
  required?: boolean;
  /** 도움말 텍스트 */
  helperText?: string;
}

const HEIGHTS: Record<string, number> = { '32': 32, '36': 36, '40': 40 };
const FONT_SIZES: Record<string, number> = { '32': 13, '36': 14, '40': 14 };

export const Select: React.FC<SelectProps> = ({
  options,
  value: controlledValue,
  defaultValue,
  placeholder = '선택',
  onChange,
  disabled = false,
  width = '100%',
  size = '36',
  error = false,
  label,
  required = false,
  helperText,
}) => {
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? '');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue);
  const height = HEIGHTS[size];
  const fontSize = FONT_SIZES[size];

  /* 외부 클릭 닫기 */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;
    if (!isControlled) setInternalValue(option.value);
    onChange?.(option.value);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen((p) => !p); }
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'ArrowDown' && !open) setOpen(true);
  };

  /* ── 스타일 ── */
  const borderColor = error
    ? '#FF4D4F'
    : open
    ? '#2B52F0'
    : '#D9D9D9';

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    height,
    width: '100%',
    padding: '0 8px',
    border: `1px solid ${borderColor}`,
    borderRadius: 4,
    background: disabled ? '#F2F2F2' : '#FFFFFF',
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  };

  const textStyle: React.CSSProperties = {
    flex: 1,
    fontFamily: "var(--mcds-fontfamily, 'Pretendard', sans-serif)",
    fontSize,
    fontWeight: 400,
    lineHeight: '20px',
    color: disabled ? '#B8B8B8' : selectedOption ? '#1A1A1A' : '#808080',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    minWidth: 0,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    background: '#FFFFFF',
    border: '1px solid #D9D9D9',
    borderRadius: 4,
    boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
    zIndex: 1000,
    maxHeight: 240,
    overflowY: 'auto',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width }}>
      {/* 라벨 */}
      {label && (
        <label
          htmlFor={id}
          style={{
            fontFamily: "var(--mcds-fontfamily, 'Pretendard', sans-serif)",
            fontSize: 14,
            fontWeight: 400,
            lineHeight: '20px',
            color: disabled ? '#B8B8B8' : '#1A1A1A',
          }}
        >
          {label}
          {required && (
            <span style={{ color: '#2B52F0', marginLeft: 2 }}>*</span>
          )}
        </label>
      )}

      {/* 트리거 + 드롭다운 */}
      <div ref={containerRef} style={{ position: 'relative' }}>
        <button
          id={id}
          type="button"
          style={triggerStyle}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => !disabled && setOpen((p) => !p)}
          onKeyDown={handleKeyDown}
        >
          <span style={textStyle}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {/* 화살표 아이콘 */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{
              flexShrink: 0,
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          >
            <path
              d="M4 6L8 10L12 6"
              stroke={disabled ? '#B8B8B8' : '#808080'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* 드롭다운 목록 */}
        {open && (
          <ul role="listbox" style={dropdownStyle}>
            {options.map((option) => {
              const isSelected = option.value === currentValue;
              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: 36,
                    padding: '0 8px',
                    fontFamily: "var(--mcds-fontfamily, 'Pretendard', sans-serif)",
                    fontSize,
                    fontWeight: isSelected ? 600 : 400,
                    color: option.disabled ? '#B8B8B8' : '#1A1A1A',
                    background: isSelected ? '#F2F2F2' : 'transparent',
                    cursor: option.disabled ? 'not-allowed' : 'pointer',
                    listStyle: 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!option.disabled && !isSelected)
                      (e.currentTarget as HTMLElement).style.background = '#F2F2F2';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected)
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  {option.label}
                  {isSelected && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{ marginLeft: 'auto', flexShrink: 0 }}
                    >
                      <path
                        d="M3 8L6.5 11.5L13 5"
                        stroke="#2B52F0"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 도움말 / 에러 텍스트 */}
      {helperText && (
        <p
          style={{
            fontFamily: "var(--mcds-fontfamily, 'Pretendard', sans-serif)",
            fontSize: 12,
            lineHeight: '16px',
            color: error ? '#FF4D4F' : '#808080',
            margin: 0,
          }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Select;
