/**
 * MCDS Table Component
 * 피그마 기반 제작 — 크로스플랫폼 상품 어드민
 *
 * Design tokens:
 *  header bg: #F2F2F2 (gray/95)
 *  header text: 13px medium, #808080 (gray/50)
 *  row border: 1px solid #E6E6E6
 *  row height: 52px
 *  row hover bg: #F7F7F7
 *  row selected bg: #EFF2FE (blue tint)
 *  cell text: 14px regular, #1A1A1A (gray/10)
 *  checkbox accent: #2B52F0 (blue/40 Primary)
 *  sort icon: #B8B8B8 (gray/70) / #2B52F0 active
 */

import React, { useState, useCallback } from 'react';

/* ── 타입 ── */
export type SortOrder = 'asc' | 'desc' | null;

export interface TableColumn<T = Record<string, unknown>> {
  /** 컬럼 고유 키 */
  key: string;
  /** 헤더 표시 이름 */
  title: string;
  /** 셀 너비 */
  width?: number | string;
  /** 최소 너비 */
  minWidth?: number;
  /** 정렬 가능 여부 */
  sortable?: boolean;
  /** 텍스트 정렬 */
  align?: 'left' | 'center' | 'right';
  /** 커스텀 셀 렌더러 */
  render?: (value: unknown, row: T, index: number) => React.ReactNode;
  /** 고정 컬럼 */
  fixed?: 'left' | 'right';
}

export interface TableProps<T = Record<string, unknown>> {
  /** 컬럼 정의 */
  columns: TableColumn<T>[];
  /** 데이터 */
  dataSource: T[];
  /** 행 고유 키 (기본: 'id') */
  rowKey?: keyof T | ((row: T) => string);
  /** 체크박스 선택 활성화 */
  checkable?: boolean;
  /** 선택된 행 키 목록 (controlled) */
  selectedRowKeys?: string[];
  /** 선택 변경 콜백 */
  onSelectChange?: (keys: string[], rows: T[]) => void;
  /** 정렬 변경 콜백 */
  onSortChange?: (key: string, order: SortOrder) => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 빈 데이터 텍스트 */
  emptyText?: string;
  /** 행 클릭 */
  onRowClick?: (row: T, index: number) => void;
  /** 테이블 최소 너비 */
  minWidth?: number;
}

/* ── 유틸 ── */
function getRowKey<T>(
  row: T,
  rowKey: keyof T | ((row: T) => string) | undefined,
  index: number
): string {
  if (!rowKey) return String((row as Record<string, unknown>)['id'] ?? index);
  if (typeof rowKey === 'function') return rowKey(row);
  return String(row[rowKey] ?? index);
}

/* ── 아이콘 ── */
const SortIcon: React.FC<{ order: SortOrder }> = ({ order }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, marginLeft: 4 }}>
    <svg width="8" height="5" viewBox="0 0 8 5">
      <path
        d="M1 4L4 1L7 4"
        stroke={order === 'asc' ? '#2B52F0' : '#B8B8B8'}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
    <svg width="8" height="5" viewBox="0 0 8 5">
      <path
        d="M1 1L4 4L7 1"
        stroke={order === 'desc' ? '#2B52F0' : '#B8B8B8'}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  </span>
);

const CheckIcon: React.FC<{ checked: boolean; indeterminate?: boolean; onChange: () => void; disabled?: boolean }> = ({
  checked,
  indeterminate,
  onChange,
  disabled,
}) => (
  <label
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 16,
      height: 16,
      border: `1.5px solid ${checked || indeterminate ? '#2B52F0' : '#D9D9D9'}`,
      borderRadius: 3,
      background: checked || indeterminate ? '#2B52F0' : '#FFFFFF',
      cursor: disabled ? 'not-allowed' : 'pointer',
      flexShrink: 0,
      transition: 'all 0.15s',
      boxSizing: 'border-box',
    }}
  >
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
    />
    {indeterminate && !checked && (
      <svg width="8" height="2" viewBox="0 0 8 2">
        <rect x="0" y="0.5" width="8" height="1" rx="0.5" fill="#FFFFFF" />
      </svg>
    )}
    {checked && (
      <svg width="10" height="8" viewBox="0 0 10 8">
        <path d="M1 4L3.5 6.5L9 1" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )}
  </label>
);

/* ── 메인 컴포넌트 ── */
export function Table<T = Record<string, unknown>>({
  columns,
  dataSource,
  rowKey,
  checkable = false,
  selectedRowKeys: controlledKeys,
  onSelectChange,
  onSortChange,
  loading = false,
  emptyText = '데이터가 없습니다.',
  onRowClick,
  minWidth = 800,
}: TableProps<T>): React.ReactElement {
  const [internalKeys, setInternalKeys] = useState<string[]>([]);
  const [sortState, setSortState] = useState<{ key: string; order: SortOrder }>({
    key: '',
    order: null,
  });

  const isControlled = controlledKeys !== undefined;
  const checkedKeys = isControlled ? controlledKeys : internalKeys;

  const allKeys = dataSource.map((row, i) => getRowKey(row, rowKey, i));
  const isAllChecked = allKeys.length > 0 && allKeys.every((k) => checkedKeys.includes(k));
  const isIndeterminate = !isAllChecked && allKeys.some((k) => checkedKeys.includes(k));

  const handleCheckAll = useCallback(() => {
    const next = isAllChecked ? [] : allKeys;
    const nextRows = isAllChecked ? [] : dataSource;
    if (!isControlled) setInternalKeys(next);
    onSelectChange?.(next, nextRows);
  }, [isAllChecked, allKeys, dataSource, isControlled, onSelectChange]);

  const handleCheckRow = useCallback(
    (key: string, row: T) => {
      const next = checkedKeys.includes(key)
        ? checkedKeys.filter((k) => k !== key)
        : [...checkedKeys, key];
      const nextRows = dataSource.filter((r, i) =>
        next.includes(getRowKey(r, rowKey, i))
      );
      if (!isControlled) setInternalKeys(next);
      onSelectChange?.(next, nextRows);
    },
    [checkedKeys, dataSource, rowKey, isControlled, onSelectChange]
  );

  const handleSort = useCallback(
    (key: string) => {
      const nextOrder: SortOrder =
        sortState.key === key
          ? sortState.order === 'asc' ? 'desc' : sortState.order === 'desc' ? null : 'asc'
          : 'asc';
      const next = { key, order: nextOrder };
      setSortState(next);
      onSortChange?.(key, nextOrder);
    },
    [sortState, onSortChange]
  );

  /* ── 스타일 상수 ── */
  const FONT = "var(--mcds-fontfamily, 'Pretendard', sans-serif)";
  const cellBase: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '20px',
    color: '#1A1A1A',
    padding: '0 12px',
    verticalAlign: 'middle',
    borderBottom: '1px solid #E6E6E6',
    whiteSpace: 'nowrap',
  };

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        position: 'relative',
        border: '1px solid #E6E6E6',
        borderRadius: 4,
        boxSizing: 'border-box',
      }}
    >
      <table
        style={{
          width: '100%',
          minWidth,
          borderCollapse: 'collapse',
          tableLayout: 'auto',
        }}
      >
        {/* ── THEAD ── */}
        <thead>
          <tr style={{ background: '#F2F2F2' }}>
            {checkable && (
              <th
                style={{
                  ...cellBase,
                  width: 44,
                  padding: '0 12px',
                  background: '#F2F2F2',
                  borderBottom: '1px solid #E6E6E6',
                  fontWeight: 500,
                  color: '#808080',
                  fontSize: 13,
                }}
              >
                <CheckIcon
                  checked={isAllChecked}
                  indeterminate={isIndeterminate}
                  onChange={handleCheckAll}
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...cellBase,
                  height: 44,
                  fontWeight: 500,
                  fontSize: 13,
                  color: '#808080',
                  background: '#F2F2F2',
                  textAlign: col.align ?? 'left',
                  width: col.width,
                  minWidth: col.minWidth,
                  cursor: col.sortable ? 'pointer' : 'default',
                  userSelect: 'none',
                }}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {col.title}
                  {col.sortable && (
                    <SortIcon
                      order={sortState.key === col.key ? sortState.order : null}
                    />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* ── TBODY ── */}
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={columns.length + (checkable ? 1 : 0)}
                style={{ ...cellBase, height: 200, textAlign: 'center', color: '#808080' }}
              >
                로딩 중...
              </td>
            </tr>
          )}
          {!loading && dataSource.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (checkable ? 1 : 0)}
                style={{ ...cellBase, height: 200, textAlign: 'center', color: '#808080' }}
              >
                {emptyText}
              </td>
            </tr>
          )}
          {!loading &&
            dataSource.map((row, rowIndex) => {
              const key = getRowKey(row, rowKey, rowIndex);
              const isChecked = checkedKeys.includes(key);

              return (
                <tr
                  key={key}
                  onClick={onRowClick ? () => onRowClick(row, rowIndex) : undefined}
                  style={{
                    height: 52,
                    background: isChecked ? '#EFF2FE' : '#FFFFFF',
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isChecked)
                      (e.currentTarget as HTMLElement).style.background = '#F7F7F7';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = isChecked
                      ? '#EFF2FE'
                      : '#FFFFFF';
                  }}
                >
                  {checkable && (
                    <td
                      style={{ ...cellBase, width: 44, textAlign: 'center' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <CheckIcon
                        checked={isChecked}
                        onChange={() => handleCheckRow(key, row)}
                      />
                    </td>
                  )}
                  {columns.map((col) => {
                    const rawValue = (row as Record<string, unknown>)[col.key];
                    return (
                      <td
                        key={col.key}
                        style={{
                          ...cellBase,
                          textAlign: col.align ?? 'left',
                          width: col.width,
                          minWidth: col.minWidth,
                        }}
                      >
                        {col.render
                          ? col.render(rawValue, row, rowIndex)
                          : (rawValue as React.ReactNode) ?? '—'}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
