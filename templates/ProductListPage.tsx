/**
 * 상품 목록 페이지 — MCDS 파트너 어드민 템플릿
 *
 * ⚠️ 패키지명 확인 필요:
 *   현재 '@musinsa/mcds'는 추정값입니다.
 *   개발팀에 "Button import 경로 알려주세요" 문의 후 실제 패키지명으로 교체하세요.
 *
 * PRD:
 *   상품 목록 화면. 상품코드·상품명·판매상태·판매가·등록일 컬럼.
 *   상품명 검색, 판매상태 필터, 등록일 기간 검색.
 *   선택 후 판매상태 변경 가능. 상품 등록 버튼. 엑셀 다운로드 버튼.
 */

import React, { useState } from 'react';

// ── MCDS 패키지 컴포넌트 ────────────────────────────────────────
// TODO: 아래 패키지명을 실제 값으로 교체하세요
import {
  Button,
  TextField,
  Pagination,
  Tag,
  Chip,
  RadioGroup,
  Modal,
  Breadcrumb,
  useMessage,
} from '@musinsa/mcds';

// ── 커스텀 컴포넌트 (MCDS에 없음) ──────────────────────────────
import { Table, TableColumn } from '../components/Table';
import { Select } from '../components/Select';

// ── 디자인 토큰 ─────────────────────────────────────────────────
import '../tokens/tokens.css';

// ── 타입 ────────────────────────────────────────────────────────
type SaleStatus = '판매중' | '품절' | '판매중지';

interface Product {
  id: string;
  no: number;
  productCode: string;
  productName: string;
  status: SaleStatus;
  price: number;
  createdAt: string;
}

// ── 상수 ────────────────────────────────────────────────────────
const STATUS_COLORS: Record<SaleStatus, string> = {
  '판매중': 'blue',
  '판매중지': 'red',
  '품절': 'gray',
};

const PAGE_SIZE_OPTIONS = [
  { label: '20개', value: '20' },
  { label: '50개', value: '50' },
  { label: '100개', value: '100' },
  { label: '1000개', value: '1000' },
];

const STATUS_OPTIONS = [
  { label: '전체', value: 'all' },
  { label: '판매중', value: '판매중' },
  { label: '품절', value: '품절' },
  { label: '판매중지', value: '판매중지' },
];

// ── 목 데이터 (실제 API로 교체) ──────────────────────────────────
const MOCK_DATA: Product[] = [
  { id: '1', no: 1, productCode: 'P001', productName: '클래식 반팔티', status: '판매중', price: 29000, createdAt: '2024-01-15' },
  { id: '2', no: 2, productCode: 'P002', productName: '슬림 청바지', status: '품절', price: 89000, createdAt: '2024-01-14' },
  { id: '3', no: 3, productCode: 'P003', productName: '오버핏 후드', status: '판매중지', price: 65000, createdAt: '2024-01-13' },
];

// ── 메인 컴포넌트 ────────────────────────────────────────────────
export default function ProductListPage() {
  const message = useMessage();

  // 검색 조건
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // 선택 / 페이지
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('20');

  // 모달
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const selectedCount = selectedKeys.length;

  // 테이블 컬럼 정의
  const columns: TableColumn<Product>[] = [
    {
      key: 'no',
      title: 'No.',
      width: 60,
      align: 'center',
    },
    {
      key: 'productCode',
      title: '상품코드',
      width: 120,
    },
    {
      key: 'productName',
      title: '상품명',
      minWidth: 200,
    },
    {
      key: 'status',
      title: '판매상태',
      width: 100,
      align: 'center',
      render: (value) => (
        <Tag variant="solid" color={STATUS_COLORS[value as SaleStatus]}>
          {value as string}
        </Tag>
      ),
    },
    {
      key: 'price',
      title: '판매가',
      width: 120,
      align: 'right',
      sortable: true,
      render: (value) => `${(value as number).toLocaleString()}원`,
    },
    {
      key: 'createdAt',
      title: '등록일',
      width: 120,
      sortable: true,
    },
  ];

  // 핸들러
  const handleSearch = () => {
    setCurrentPage(1);
    // TODO: API 호출
  };

  const handleReset = () => {
    setKeyword('');
    setStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setCurrentPage(1);
  };

  const handleStatusChange = () => {
    if (selectedCount === 0) return;
    setStatusModalOpen(true);
  };

  const handleStatusChangeConfirm = () => {
    setStatusModalOpen(false);
    setSelectedKeys([]);
    message.success('판매상태가 변경되었습니다.');
  };

  const handleExcelDownload = () => {
    // TODO: 엑셀 다운로드 API 호출
    message.success('다운로드가 시작되었습니다.');
  };

  const handleRegister = () => {
    // TODO: 상품 등록 페이지로 이동
  };

  return (
    <div
      style={{
        padding: 32,
        fontFamily: 'var(--mcds-fontfamily, "Pretendard", sans-serif)',
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg-page, #F2F2F2)',
      }}
    >
      {/* ── 1. Breadcrumb ── */}
      <Breadcrumb
        items={[
          { label: '홈', href: '/' },
          { label: '상품 관리' },
          { label: '상품 조회' },
        ]}
      />

      {/* ── 2. 페이지 타이틀 ── */}
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          lineHeight: '36px',
          color: '#1A1A1A',
          margin: '16px 0 24px',
        }}
      >
        상품 조회
      </h1>

      {/* ── 3. 검색 조건 패널 ── */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid #E6E6E6',
          borderRadius: 8,
          padding: '20px 24px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
        >
          {/* 상품명 검색 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              style={{
                width: 80,
                flexShrink: 0,
                fontSize: 13,
                color: '#808080',
                fontWeight: 400,
              }}
            >
              상품명
            </label>
            <TextField
              placeholder="상품명 입력"
              value={keyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
            />
          </div>

          {/* 판매상태 필터 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              style={{
                width: 80,
                flexShrink: 0,
                fontSize: 13,
                color: '#808080',
                fontWeight: 400,
              }}
            >
              판매상태
            </label>
            <RadioGroup
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={STATUS_OPTIONS}
            />
          </div>

          {/* 등록일 기간 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label
              style={{
                width: 80,
                flexShrink: 0,
                fontSize: 13,
                color: '#808080',
                fontWeight: 400,
              }}
            >
              등록일
            </label>
            {/* TODO: RangeCalendar 컴포넌트로 교체 */}
            <div style={{ display: 'flex', gap: 8, flex: 1 }}>
              <TextField
                placeholder="시작일"
                value={dateFrom}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value)}
              />
              <span style={{ color: '#808080', lineHeight: '36px' }}>~</span>
              <TextField
                placeholder="종료일"
                value={dateTo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* 검색 버튼 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginTop: 16,
          }}
        >
          <Button
            type="secondary"
            size="36"
            state="enabled"
            buttonText="초기화"
            onClick={handleReset}
          />
          <Button
            type="primary"
            size="36"
            state="enabled"
            buttonText="검색"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* ── 4. 테이블 타이틀 행 ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 36,
          marginBottom: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              lineHeight: '28px',
              color: '#1A1A1A',
            }}
          >
            전체 ({MOCK_DATA.length}개)
          </span>
          {/* 액션 버튼: secondary/tertiary 먼저, primary 마지막 */}
          <Button
            type="secondary"
            size="36"
            state={selectedCount > 0 ? 'enabled' : 'disabled'}
            buttonText={`판매상태 변경${selectedCount > 0 ? ` (${selectedCount})` : ''}`}
            onClick={handleStatusChange}
          />
          <Button
            type="secondary"
            size="36"
            state="enabled"
            buttonText="엑셀 다운로드"
            onClick={handleExcelDownload}
          />
          <Button
            type="primary"
            size="36"
            state="enabled"
            buttonText="상품 등록"
            onClick={handleRegister}
          />
        </div>

        {/* 페이지당 노출 수 */}
        <Select
          options={PAGE_SIZE_OPTIONS}
          value={pageSize}
          onChange={setPageSize}
          width={88}
        />
      </div>

      {/* ── 5. Table ── */}
      <Table
        columns={columns}
        dataSource={MOCK_DATA}
        rowKey="id"
        checkable
        selectedRowKeys={selectedKeys}
        onSelectChange={(keys) => setSelectedKeys(keys)}
        onSortChange={(key, order) => {
          // TODO: 정렬 API 호출
          console.log('sort:', key, order);
        }}
      />

      {/* ── 6. Pagination ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 24,
        }}
      >
        <Pagination
          total={MOCK_DATA.length}
          page={currentPage}
          pageSize={Number(pageSize)}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ── 모달: 판매상태 변경 ── */}
      {statusModalOpen && (
        <Modal
          type="alert"
          title={`${selectedCount}개 상품의 판매상태를 변경하시겠습니까?`}
          description="변경 후 즉시 적용됩니다."
          onConfirm={handleStatusChangeConfirm}
          onCancel={() => setStatusModalOpen(false)}
        />
      )}
    </div>
  );
}
