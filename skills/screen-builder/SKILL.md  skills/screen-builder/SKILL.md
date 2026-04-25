# MCDS 파트너 어드민 화면 생성 Skill

> **이 Skill이 실행되면**: DESIGN.md를 읽고 PRD를 TSX 코드로 변환합니다.
> 개발 지식이 없는 디자이너의 PRD 입력 → 실제 MCDS import 코드 출력이 목표입니다.

---

## Skill 실행 절차

### Step 1 — DESIGN.md 읽기 (필수)
코드 생성 전에 반드시 아래 파일을 읽으세요:
```
partner-design-system/DESIGN.md
```

### Step 2 — PRD 분석
사용자가 제공한 PRD(요구사항)에서 아래를 파악하세요:

1. **화면 타입**: 목록(List) / 폼(Form) / 상세(Detail) 중 하나
2. **페이지명**: 화면 제목과 Breadcrumb 경로
3. **컬럼 목록** (목록 화면): 컬럼명, 타입, 정렬, 정렬가능 여부
4. **필드 목록** (폼 화면): 필드명, 입력 타입, 필수 여부
5. **검색 조건**: 어떤 필터가 있는가 (기간, 상태, 텍스트 등)
6. **액션 버튼**: 어떤 버튼이 필요한가 (등록, 삭제, 다운로드 등)
7. **상태값**: Tag로 표시할 상태 목록과 색상 매핑

### Step 3 — 코드 생성 규칙

**파일 구조** (단일 파일로 생성):
```tsx
// 1. React import
import React, { useState } from 'react';

// 2. MCDS 컴포넌트 import (확인된 패키지명으로)
import { Button, TextField, Pagination, Tag, Checkbox, Breadcrumb } from '@musinsa/mcds';
// ⚠️ TODO: 실제 패키지명을 dev팀에 확인하세요 (@musinsa/mcds 추정)

// 3. 커스텀 컴포넌트 import (MCDS에 없는 것)
import { Table } from '../components/Table';
import { Select } from '../components/Select';

// 4. 토큰 import
import '../tokens/tokens.css';

// 5. 타입 정의
// 6. 컴포넌트 함수
// 7. export default
```

**절대 생성하지 말 것:**
- HTML `<button>`, `<input>`, `<select>` 태그 직접 사용 (MCDS 컴포넌트 사용)
- 임의 색상 값 (#123456 등) — 반드시 토큰 변수 사용
- antd, MUI 등 외부 라이브러리 import
- Primary 버튼 2개 이상

### Step 4 — 파일 저장

생성된 TSX 파일을 `/sessions/clever-confident-ride/mnt/outputs/` 폴더에 저장하세요.
파일명 규칙: `[페이지명]Page.tsx` (예: `ProductListPage.tsx`, `ProductFormPage.tsx`)

---

## 컴포넌트 Import 치트시트

```tsx
// ─── MCDS 패키지 컴포넌트 ─────────────────────────────────
// ⚠️ 패키지명 확인 필요: dev팀에 "Button import 경로 알려주세요" 문의
import {
  Button,         // 버튼 (primary/secondary/tertiary)
  TextField,      // 텍스트 입력
  Checkbox,       // 체크박스
  Pagination,     // 페이지네이션
  Tag,            // 상태 태그
  Chip,           // 선택된 필터 태그
  RadioGroup,     // 라디오 그룹
  Modal,          // 알림/팝업 모달
  SideSheet,      // 우측 사이드시트
  Switch,         // 토글 스위치
  Tooltip,        // 툴팁
  Breadcrumb,     // 브레드크럼
  Divider,        // 구분선
  Typography,     // 타이포그래피
  Message,        // 토스트 메시지
  useMessage,     // 메시지 훅
} from '@musinsa/mcds';

// ─── 커스텀 컴포넌트 (MCDS에 없음) ─────────────────────────
import { Table, TableColumn } from '../components/Table';    // 데이터 테이블
import { Select } from '../components/Select';              // 드롭다운 선택

// ─── 토큰 ───────────────────────────────────────────────────
import '../tokens/tokens.css';
```

---

## 화면 타입별 템플릿 구조

### 목록 화면 (List Page)

```tsx
export default function [이름]ListPage() {
  // State: 검색 조건, 선택된 행, 페이지, 페이지당 노출 수
  const [keyword, setKeyword] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState('20');
  const message = useMessage();

  // 테이블 컬럼 정의
  const columns: TableColumn[] = [
    { key: 'no', title: 'No.', width: 60, align: 'center' },
    // ... PRD 기반으로 컬럼 추가
  ];

  return (
    <div style={{ padding: 32, fontFamily: 'var(--mcds-fontfamily)' }}>
      {/* 1. Breadcrumb */}
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '[페이지명]' }]} />

      {/* 2. 페이지 타이틀 */}
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '16px 0 24px', color: '#1A1A1A' }}>
        [페이지 타이틀]
      </h1>

      {/* 3. 검색 조건 패널 */}
      <div style={{ background: '#F2F2F2', borderRadius: 8, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {/* PRD 기반 검색 조건 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ width: 80, flexShrink: 0, fontSize: 13, color: '#808080' }}>검색어</label>
            <TextField placeholder="검색어 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <Button type="secondary" size="36" state="enabled" buttonText="초기화" />
          <Button type="primary" size="36" state="enabled" buttonText="검색" />
        </div>
      </div>

      {/* 4. 테이블 타이틀 행 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36, marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>전체 (0개)</span>
          {/* 액션 버튼: secondary/tertiary 먼저, primary 마지막 */}
        </div>
        <Select
          options={[
            { label: '20개', value: '20' },
            { label: '50개', value: '50' },
            { label: '100개', value: '100' },
          ]}
          value={pageSize}
          onChange={setPageSize}
          width={88}
        />
      </div>

      {/* 5. Table */}
      <Table
        columns={columns}
        dataSource={[]}
        rowKey="id"
        checkable
        selectedRowKeys={selectedKeys}
        onSelectChange={(keys) => setSelectedKeys(keys)}
      />

      {/* 6. Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
        <Pagination total={0} page={currentPage} pageSize={Number(pageSize)} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}
```

### 폼 화면 (Form Page)

```tsx
export default function [이름]FormPage() {
  const message = useMessage();

  return (
    <div style={{ padding: 32, fontFamily: 'var(--mcds-fontfamily)' }}>
      {/* 1. Breadcrumb */}
      <Breadcrumb items={[{ label: '홈', href: '/' }, { label: '[목록]', href: '/list' }, { label: '[등록/수정]' }]} />

      {/* 2. 페이지 타이틀 */}
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: '16px 0 24px', color: '#1A1A1A' }}>
        [타이틀]
      </h1>

      {/* 3. 섹션 카드들 */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E6E6E6', borderRadius: 8, padding: 24, marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: '#1A1A1A' }}>기본 정보</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* PRD 기반 필드 추가 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label style={{ fontSize: 14, fontWeight: 500, color: '#1A1A1A' }}>
              필드명 <span style={{ color: '#2B52F0' }}>*</span>
            </label>
            <TextField placeholder="입력하세요" />
          </div>
        </div>
      </div>

      {/* 4. 하단 액션 바 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
        <Button type="secondary" size="36" state="enabled" buttonText="취소" />
        <Button type="primary" size="36" state="enabled" buttonText="저장" />
      </div>
    </div>
  );
}
```

---

## PRD 해석 예시

**입력 PRD:**
> "상품 목록 화면. 상품코드, 상품명, 판매상태(판매중/품절/판매중지), 판매가, 등록일 컬럼. 상품명으로 검색, 판매상태 필터, 등록일 기간 검색 가능. 선택 후 판매상태 변경 가능, 상품 등록 버튼."

**Claude가 생성할 코드 구조:**
```
- 화면 타입: List Page
- 컬럼: No.(번호) / 상품코드 / 상품명(minWidth:200) / 판매상태(Tag) / 판매가(right, sortable) / 등록일(sortable)
- 검색: TextField(상품명) + RadioGroup(판매상태: 전체/판매중/품절/판매중지) + RangeCalendar(등록일)
- 액션: Button(secondary, "판매상태 변경", disabled when 미선택) + Button(primary, "상품 등록")
- Tag 색상: 판매중→blue, 판매중지→red, 품절→gray
```

---

## 완료 후 사용자에게 안내할 것

1. **패키지명 확인**: `@musinsa/mcds`는 추정값입니다. 개발팀에 "Button import 경로 알려주세요" 문의 후 실제 패키지명으로 교체하세요.
2. **컴포넌트 Props 확인**: Storybook(`https://musinsa.github.io/core-partner-frontend/mcds-storybook/`)에서 실제 Props를 확인하세요.
3. **파일 위치**: 생성된 TSX를 파트너 어드민 프로젝트 `src/pages/` 폴더에 배치하세요.
