# MCDS — 파트너 어드민 디자인 시스템

> **AI 사용 지침**: 이 문서를 읽고 모든 화면을 생성하세요.
> PRD를 입력받으면 아래 규칙과 컴포넌트를 사용해 React + TypeScript 코드로 화면을 만드세요.
> 이 시스템 외의 컴포넌트나 색상, 폰트를 임의로 사용하지 마세요.

---

## 1. 기술 스택

- **Framework**: React 18 + TypeScript
- **Font**: Pretendard (`var(--mcds-fontfamily)`)
- **Token**: `tokens/tokens.css` 참고
- **기존 컴포넌트**: `@musinsa/mcds` 패키지에서 import
- **신규 컴포넌트**: `components/Table.tsx`, `components/Select.tsx`

---

## 2. 디자인 토큰 핵심 값

### 색상

| 용도 | 변수 | 값 |
|------|------|----|
| 본문 텍스트 | `--color-gray-10` | `#1A1A1A` |
| 보조 텍스트 | `--color-gray-50` | `#808080` |
| Disabled | `--color-gray-70` | `#B8B8B8` |
| Border 기본 | `--color-gray-85` | `#D9D9D9` |
| Row border | `--color-gray-90` | `#E6E6E6` |
| 배경 (헤더/hover) | `--color-gray-95` | `#F2F2F2` |
| Primary (버튼/링크) | `--color-blue-40` | `#2B52F0` |
| 선택된 행 배경 | `--color-blue-10` | `#EFF2FE` |
| 에러 | `--color-error` | `#FF4D4F` |
| White | `--color-white` | `#FFFFFF` |

### 타이포그래피

| 용도 | 크기 | 두께 | 행간 |
|------|------|------|------|
| 페이지 타이틀 | 28px | Bold | 36px |
| 섹션 타이틀 | 20px | Bold | 28px |
| 서브 타이틀 | 16px | Medium | 24px |
| 본문 (기본) | 14px | Regular | 20px |
| 보조 텍스트 | 13px | Regular | 20px |
| 캡션 | 12px | Regular | 16px |

### 스페이싱

기본 단위: **4px**. 항상 4의 배수 사용 (4, 8, 12, 16, 20, 24, 32, 40, 48px).

### Border Radius

| 용도 | 값 |
|------|----|
| Input, Select, Tag, Button | 4px |
| 카드, 패널, 모달 | 8px |
| Pill (Tag 일부) | 9999px |

---

## 3. 컴포넌트 사용 규칙

### Button (`@musinsa/mcds`)

```tsx
import { Button } from '@musinsa/mcds';

// Primary — 페이지당 1개, 가장 중요한 단일 액션
<Button type="primary" size="36" state="enabled" buttonText="상품 등록" />

// Secondary — 보조 액션 (다운로드, 변경 등)
<Button type="secondary" size="36" state="enabled" buttonText="엑셀 다운로드" />

// Tertiary — 저장, 취소 등 하위 액션
<Button type="tertiary" size="36" state="enabled" buttonText="수정 저장" />
```

**규칙**
- size는 항상 `"36"` 사용 (기본). 공간이 협소할 때만 `"32"`.
- Primary 버튼은 페이지에서 1개만.
- 버튼 그룹은 우선순위 낮은 것부터 왼쪽, Primary는 가장 오른쪽.
- Disabled 상태에서는 클릭 이벤트 바인딩 금지.

---

### TextField (`@musinsa/mcds`)

```tsx
import { TextField } from '@musinsa/mcds';

<TextField
  placeholder="검색어를 입력하세요"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**규칙**
- 검색 입력은 반드시 TextField 사용.
- 에러 메시지는 input 하단 12px 텍스트로 표시, 색상 `#FF4D4F`.

---

### Select (`components/Select.tsx`)

```tsx
import { Select } from './components/Select';

// 페이지당 노출 개수 선택
<Select
  options={[
    { label: '10개', value: '10' },
    { label: '30개', value: '30' },
    { label: '50개', value: '50' },
    { label: '100개', value: '100' },
    { label: '1000개', value: '1000' },
  ]}
  value={pageSize}
  onChange={setPageSize}
  width={88}
/>

// 폼 내 선택 필드
<Select
  label="카테고리"
  options={categoryOptions}
  placeholder="카테고리 선택"
  value={category}
  onChange={setCategory}
  width="100%"
/>
```

**규칙**
- 3개 이상 선택지 → Select 사용. 2개 이하 → RadioGroup 사용.
- 폼 내 Select는 반드시 `label` prop 포함.
- 페이지 우측 상단 노출 수 조절 Select는 width 88px 고정.

---

### Checkbox (`@musinsa/mcds`)

```tsx
import { Checkbox } from '@musinsa/mcds';

// 단독 체크박스
<Checkbox checked={checked} onCheckedChange={setChecked} />

// Indeterminate (테이블 전체 선택)
<Checkbox checked={false} indeterminate={true} onCheckedChange={handleSelectAll} />
```

**규칙**
- 테이블 전체 선택 체크박스는 항상 헤더 첫 번째 컬럼에 위치.
- 단독 선택/해제 시 Indeterminate 상태 자동 처리.

---

### Table (`components/Table.tsx`)

> ℹ️ **참고**: MCDS Storybook에도 Table이 있으나 Ant Design 기반(antd 태그)입니다.
> 현재는 커스텀 Table을 사용하며, dev팀 확인 후 MCDS Table로 마이그레이션 가능합니다.

```tsx
import { Table, TableColumn } from './components/Table';

<Table
  columns={[
    { key: 'no', title: 'No.', width: 60, align: 'center' },
    { key: 'productName', title: '상품명', minWidth: 200 },
    { key: 'status', title: '판매상태', width: 100,
      render: (value) => <Tag variant="solid" color="blue">{value}</Tag> },
    { key: 'price', title: '판매가', width: 120, align: 'right', sortable: true },
    { key: 'createdAt', title: '등록일', width: 120, sortable: true },
  ]}
  dataSource={products}
  rowKey="id"
  checkable
  onSelectChange={(keys, rows) => setSelected(rows)}
/>
```

**규칙**
- 테이블은 항상 `border: 1px solid #E6E6E6`, `border-radius: 4px` 컨테이너 안에.
- 헤더 배경 `#F2F2F2`, 행 높이 52px.
- 숫자/금액 컬럼은 `align: 'right'`.
- 상태 값은 Tag 컴포넌트로 표시.
- 체크박스 선택이 필요하면 `checkable` prop 추가.
- 정렬 가능한 컬럼에만 `sortable: true`.

---

### Pagination (`@musinsa/mcds`)

```tsx
import { Pagination } from '@musinsa/mcds';

<Pagination
  total={totalCount}
  page={currentPage}
  pageSize={pageSize}
  onPageChange={setCurrentPage}
/>
```

**규칙**
- 테이블 하단 중앙에 배치.
- 우측에 Select로 페이지당 노출 수 조절.
- 항상 테이블과 세트로 사용.

---

### Modal (`@musinsa/mcds`)

```tsx
import { Modal } from '@musinsa/mcds';

// 확인/취소 Alert
<Modal type="alert" title="삭제하시겠습니까?" description="삭제 후 복구 불가합니다."
  onConfirm={handleDelete} onCancel={() => setOpen(false)} />

// 콘텐츠 팝업
<Modal type="popup" title="상세 정보" onClose={() => setOpen(false)}>
  {children}
</Modal>
```

**규칙**
- 되돌릴 수 없는 액션(삭제, 초기화)은 반드시 Alert Modal 경유.
- 복잡한 정보 표시는 Popup Modal 또는 SideSheet 사용.

---

### SideSheet (`@musinsa/mcds`)

```tsx
import { SideSheet } from '@musinsa/mcds';

<SideSheet title="상품 상세" open={open} onClose={() => setOpen(false)}>
  {/* 상세 내용 */}
</SideSheet>
```

**규칙**
- 목록에서 상세 조회 시 SideSheet 우선 사용 (페이지 이동 최소화).
- 편집이 필요하면 SideSheet 내부에 폼 배치 가능.

---

### Tag (`@musinsa/mcds`)

```tsx
import { Tag } from '@musinsa/mcds';

// 상태 표시 (판매중/판매중지/품절)
<Tag variant="solid" color="blue">판매중</Tag>
<Tag variant="solid" color="red">판매중지</Tag>
<Tag variant="solid" color="gray">품절</Tag>
```

**규칙**
- 상태 값은 반드시 Tag로 표시. 색상은 의미에 맞게 고정.
- 판매중/활성 → blue, 중지/비활성 → red, 대기/기타 → gray.

---

### RadioGroup (`@musinsa/mcds`)

```tsx
import { RadioGroup } from '@musinsa/mcds';

<RadioGroup
  value={value}
  onValueChange={setValue}
  options={[
    { label: '전체', value: 'all' },
    { label: '판매중', value: 'active' },
    { label: '판매중지', value: 'inactive' },
  ]}
/>
```

**규칙**
- 선택지가 2~4개일 때 RadioGroup 사용.
- 5개 이상이면 Select로 대체.
- 필터 영역에서는 RadioGroup 수평 배치.

---

### Chip (`@musinsa/mcds`)

```tsx
import { Chip } from '@musinsa/mcds';

// 선택된 필터 태그
<Chip onRemove={() => removeFilter(key)}>{filterLabel}</Chip>
```

**규칙**
- 검색 조건 패널에서 선택된 필터를 표시할 때 사용.
- 삭제 가능한 필터는 반드시 `onRemove` prop 포함.

---

### Breadcrumb (`@musinsa/mcds`)

```tsx
import { Breadcrumb } from '@musinsa/mcds';

<Breadcrumb
  items={[
    { label: '홈', href: '/' },
    { label: '상품 관리' },
    { label: '상품 조회' },
  ]}
/>
```

**규칙**
- 모든 내부 페이지 상단에 Breadcrumb 필수.
- 현재 페이지는 마지막 item에 href 없이 표시.

---

### Calendar (`@musinsa/mcds`)

```tsx
import { RangeCalendar, SingleCalendar } from '@musinsa/mcds';

// 기간 검색
<RangeCalendar value={dateRange} onChange={setDateRange} />

// 단일 날짜 선택
<SingleCalendar value={date} onChange={setDate} />
```

**규칙**
- 기간 필터는 반드시 RangeCalendar 사용.
- 단일 날짜 입력은 SingleCalendar 사용.

---

### Tooltip (`@musinsa/mcds`)

```tsx
import { Tooltip } from '@musinsa/mcds';

<Tooltip content="더 자세한 설명">
  <InfoIcon />
</Tooltip>
```

**규칙**
- 설명이 필요한 아이콘/텍스트에만 사용. 남용 금지.
- 기본 방향은 `top`. 공간 부족 시 자동 회피.

---

### Switch (`@musinsa/mcds`)

```tsx
import { Switch } from '@musinsa/mcds';

<Switch checked={enabled} onCheckedChange={setEnabled} label="자동 승인" />
```

**규칙**
- On/Off 토글이 필요한 단일 설정에 사용.
- 반드시 `label` prop으로 의미 명시.

---

### Message (`@musinsa/mcds`)

```tsx
import { useMessage } from '@musinsa/mcds';

const message = useMessage();

// 성공
message.success('저장되었습니다.');

// 에러
message.error('저장에 실패했습니다. 다시 시도해주세요.');
```

**규칙**
- API 완료 후 항상 Message로 결과 피드백.
- 성공 → success, 실패 → error, 경고 → warning.
- 3초 후 자동 소멸.

---

## 4. 레이아웃 구조

### 어드민 기본 레이아웃

```
┌─────────────────────────────────────┐
│ GNB (높이 52px, 전체 너비)            │
├──────────┬──────────────────────────┤
│ LNB      │ 콘텐츠 영역               │
│ (210px)  │ padding: 32px            │
│          │                          │
│          │ ┌──────────────────────┐ │
│          │ │ Breadcrumb           │ │
│          │ │ 페이지 타이틀         │ │
│          │ ├──────────────────────┤ │
│          │ │ 검색 조건 패널        │ │
│          │ ├──────────────────────┤ │
│          │ │ 테이블 타이틀 + 액션  │ │
│          │ │ Table                │ │
│          │ │ Pagination           │ │
│          │ └──────────────────────┘ │
└──────────┴──────────────────────────┘
```

### 콘텐츠 영역 너비

- 전체: `calc(100vw - 210px)`
- 내부 패딩: `32px`
- 테이블 최대 너비: 제한 없음 (가로 스크롤 지원)

---

## 5. 화면 패턴별 규칙

### 목록 화면 (List Page)

**구성 요소 (순서대로)**
1. Breadcrumb
2. 페이지 타이틀 (28px Bold)
3. 검색 조건 패널 (SearchConditionsPanel)
4. 테이블 타이틀 행: `전체 (n개)` + 액션 버튼 그룹 + 우측 Select(노출수)
5. Table (체크박스 포함)
6. Pagination (중앙)

**테이블 타이틀 행 레이아웃**
```tsx
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 36 }}>
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ fontSize: 20, fontWeight: 700 }}>전체 ({total}개)</span>
    {/* 액션 버튼들 — secondary/tertiary 먼저, primary 마지막 */}
    <Button type="secondary" buttonText="판매상태 변경" state={selectedCount > 0 ? 'enabled' : 'disabled'} />
    <Button type="primary" buttonText="상품 등록" showIconLeft iconLeft="plus" />
  </div>
  <Select options={pageSizeOptions} value={pageSize} onChange={setPageSize} width={88} />
</div>
```

---

### 검색 조건 패널 (SearchConditionsPanel)

```tsx
// 항상 회색 배경 패널 안에 그리드 레이아웃
<div style={{ background: '#F2F2F2', borderRadius: 8, padding: '20px 24px' }}>
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
    {/* 각 조건: 라벨(너비 고정 80px) + 입력 컴포넌트 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <label style={{ width: 80, flexShrink: 0, fontSize: 13, color: '#808080' }}>기간</label>
      <RangeCalendar value={dateRange} onChange={setDateRange} />
    </div>
  </div>
  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
    <Button type="secondary" buttonText="초기화" />
    <Button type="primary" buttonText="검색" />
  </div>
</div>
```

**규칙**
- 검색 조건은 3열 그리드 배치.
- 각 조건 라벨은 80px 고정 너비.
- 하단에 초기화(secondary) + 검색(primary) 버튼 중앙 정렬.

---

### 폼 화면 (Form Page)

**구성 요소**
1. Breadcrumb
2. 페이지 타이틀
3. 섹션 구분 카드들 (border-radius 8px, padding 24px)
4. 하단 고정 액션 바: 취소(secondary) + 저장(primary)

**폼 필드 레이아웃**
```tsx
// 2열 그리드
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <label style={{ fontSize: 14, fontWeight: 500 }}>상품명 <span style={{ color: '#2B52F0' }}>*</span></label>
    <TextField placeholder="상품명을 입력하세요" />
  </div>
</div>
```

**규칙**
- 필수 항목은 라벨 옆 `*` 표시 (색상: `#2B52F0`).
- 입력 필드 에러는 하단 12px 빨간 텍스트.
- 저장 전 필수 항목 미입력 시 에러 처리.

---

### 상세 화면 (Detail Page)

**구성 요소**
1. Breadcrumb
2. 페이지 타이틀 + 우측 액션 버튼
3. 정보 표시 그리드 (라벨 + 값)
4. 필요 시 하단 탭(Tab) 또는 SideSheet

**정보 표시 레이아웃**
```tsx
<div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 120px 1fr', gap: '16px 24px' }}>
  <span style={{ fontSize: 13, color: '#808080' }}>상품번호</span>
  <span style={{ fontSize: 14, color: '#1A1A1A' }}>{product.id}</span>
</div>
```

---

## 6. 절대 하지 말 것 (금지 규칙)

- ❌ MUI, Material UI 등 MCDS와 무관한 외부 라이브러리 설치 금지
- ⚠️ antd: MCDS Table이 내부적으로 Ant Design 기반 — 직접 설치 후 사용은 dev팀과 협의
- ❌ 임의 색상 사용 금지 — 반드시 토큰 변수 사용
- ❌ 폰트 패밀리 변경 금지 — Pretendard만 사용
- ❌ Primary 버튼 2개 이상 동시 사용 금지
- ❌ 되돌릴 수 없는 액션에 Modal 없이 직접 실행 금지
- ❌ 테이블 헤더 배경을 white로 사용 금지 (`#F2F2F2` 고정)
- ❌ border-radius를 4px/8px 외의 임의 값 사용 금지
- ❌ 상태 표시를 Tag 없이 텍스트로만 표시 금지

---

## 7. PRD 해석 규칙

PRD를 받으면 아래 순서로 판단하세요:

1. **화면 타입 파악**: 목록/폼/상세 중 어느 패턴인가?
2. **필요한 컴포넌트 목록 작성**: 위의 규칙에서 어떤 컴포넌트가 필요한가?
3. **데이터 구조 정의**: 테이블 컬럼, 폼 필드, 상태값 목록
4. **코드 생성**: 이 DESIGN.md의 규칙을 엄격히 따라 생성

### 자주 쓰는 PRD → 컴포넌트 매핑

| PRD 표현 | 사용 컴포넌트 |
|---------|------------|
| "목록 조회" | Table + Pagination + SearchConditionsPanel |
| "상태 변경" | Tag + Modal(alert) + Button(secondary) |
| "기간 검색" | RangeCalendar |
| "등록/수정" | Form Page 패턴 + TextField + Select |
| "삭제" | Button + Modal(alert) |
| "상세 보기" | SideSheet 또는 Detail Page |
| "다운로드" | Button(secondary, 엑셀 다운로드) |
| "알림" | Message (success/error) |
