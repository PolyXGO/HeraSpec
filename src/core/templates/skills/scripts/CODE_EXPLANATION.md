# Giải Thích Cách Hoạt Động Của UI/UX Builder Search Engine

## Tổng Quan

UI/UX Builder là một search engine sử dụng thuật toán **BM25** để tìm kiếm thông tin thiết kế từ các database CSV. Hệ thống gồm 2 file chính:

1. **`core.py`** - Core engine với BM25 algorithm và các hàm search
2. **`search.py`** - CLI interface để sử dụng từ command line

---

## 📁 Cấu Trúc File

```
scripts/
├── core.py          # Core engine (BM25, search functions)
└── search.py         # CLI interface

data/
├── styles.csv        # 57 UI styles
├── colors.csv        # 95 color palettes
├── typography.csv    # 56 font pairings
├── pages.csv         # 9+ page types
├── products.csv      # Product recommendations
├── landing.csv       # Landing page patterns
├── charts.csv        # Chart types
├── ux-guidelines.csv # 98 UX guidelines
└── stacks/           # 8 tech stack guidelines
```

---

## 🔍 Cách Hoạt Động Chi Tiết

### 1. File `core.py` - Core Engine

#### A. Configuration (Dòng 13-82)

```python
CSV_CONFIG = {
    "style": {
        "file": "styles.csv",
        "search_cols": ["Style Category", "Keywords", ...],  # Cột để search
        "output_cols": ["Style Category", "Type", ...]        # Cột để trả về
    },
    ...
}
```

**Chức năng:**
- Định nghĩa các domain (style, color, typography, pages, etc.)
- Mỗi domain có:
  - `file`: Tên file CSV
  - `search_cols`: Các cột dùng để tìm kiếm
  - `output_cols`: Các cột trả về trong kết quả

**Ví dụ:** Khi search "minimalism" trong domain "style":
- Tìm trong các cột: "Style Category", "Keywords", "Best For", "Type"
- Trả về: "Style Category", "Type", "Keywords", "Primary Colors", etc.

---

#### B. BM25 Class (Dòng 86-145)

**BM25** là thuật toán ranking phổ biến trong information retrieval, tốt hơn TF-IDF.

**Các phương thức:**

1. **`__init__(k1=1.5, b=0.75)`** (Dòng 89-97)
   - `k1`: Điều chỉnh tần suất từ (term frequency)
   - `b`: Điều chỉnh độ dài document
   - Khởi tạo các biến: corpus, doc_lengths, idf, doc_freqs

2. **`tokenize(text)`** (Dòng 99-102)
   ```python
   # Input: "Minimalism, Glassmorphism & Dark Mode"
   # Output: ["minimalism", "glassmorphism", "dark", "mode"]
   ```
   - Chuyển text thành lowercase
   - Loại bỏ punctuation
   - Chỉ giữ từ có > 2 ký tự

3. **`fit(documents)`** (Dòng 104-121)
   - **Bước 1:** Tokenize tất cả documents
   - **Bước 2:** Tính độ dài mỗi document và độ dài trung bình
   - **Bước 3:** Tính document frequency (số documents chứa từ)
   - **Bước 4:** Tính IDF (Inverse Document Frequency):
     ```python
     idf[word] = log((N - freq + 0.5) / (freq + 0.5) + 1)
     ```
     - Từ hiếm → IDF cao
     - Từ phổ biến → IDF thấp

4. **`score(query)`** (Dòng 123-145)
   - **Input:** Query string (ví dụ: "minimal dark mode")
   - **Process:**
     1. Tokenize query
     2. Với mỗi document:
        - Tính term frequency (TF) cho mỗi từ trong query
        - Áp dụng công thức BM25:
          ```
          score = Σ IDF(word) × (TF × (k1 + 1)) / (TF + k1 × (1 - b + b × doc_len/avgdl))
          ```
     3. Trả về danh sách (index, score) sắp xếp giảm dần

**Ví dụ tính toán:**
```
Query: "minimal dark"
Document 1: "Minimalism Dark Mode UI" → score: 2.5
Document 2: "Glassmorphism Light UI" → score: 0.3
→ Document 1 được xếp hạng cao hơn
```

---

#### C. Search Functions (Dòng 148-242)

1. **`_load_csv(filepath)`** (Dòng 149-152)
   - Đọc CSV file và trả về list of dictionaries
   - Mỗi row là một dict với keys là column names

2. **`_search_csv(...)`** (Dòng 155-177)
   - **Input:**
     - `filepath`: Đường dẫn file CSV
     - `search_cols`: Cột để search
     - `output_cols`: Cột để trả về
     - `query`: Từ khóa tìm kiếm
     - `max_results`: Số kết quả tối đa (mặc định 3)
   
   - **Process:**
     1. Load CSV data
     2. Tạo documents từ search columns:
        ```python
        # Ví dụ: Nếu search_cols = ["Keywords", "Best For"]
        # Document = "minimalism dark mode" + " " + "modern apps"
        ```
     3. Khởi tạo BM25 và fit documents
     4. Score query và lấy top results
     5. Trả về list of dicts với output_cols

3. **`detect_domain(query)`** (Dòng 180-198)
   - **Chức năng:** Tự động phát hiện domain phù hợp từ query
   - **Cách hoạt động:**
     ```python
     domain_keywords = {
         "color": ["color", "palette", "hex", ...],
         "pages": ["page", "home", "about", ...],
         ...
     }
     ```
   - Đếm số từ khóa match trong query
   - Trả về domain có điểm cao nhất
   - **Ví dụ:**
     - Query: "home page design" → domain: "pages"
     - Query: "blue color palette" → domain: "color"
     - Query: "minimalism style" → domain: "style"

4. **`search(query, domain=None, max_results=3)`** (Dòng 201-220)
   - **Main search function**
   - **Process:**
     1. Nếu không có domain → tự động detect
     2. Lấy config từ CSV_CONFIG
     3. Tạo filepath: `data/styles.csv`
     4. Gọi `_search_csv()` để tìm kiếm
     5. Trả về dict:
        ```python
        {
            "domain": "style",
            "query": "minimalism",
            "file": "styles.csv",
            "count": 3,
            "results": [...]
        }
        ```

5. **`search_stack(query, stack, max_results=3)`** (Dòng 223-242)
   - Tương tự `search()` nhưng tìm trong thư mục `stacks/`
   - Hỗ trợ 8 stacks: html-tailwind, react, nextjs, vue, svelte, swiftui, react-native, flutter

---

### 2. File `search.py` - CLI Interface

#### A. Import và Setup (Dòng 11-12)

```python
from core import CSV_CONFIG, AVAILABLE_STACKS, MAX_RESULTS, search, search_stack
```

- Import các hàm và config từ `core.py`

#### B. `format_output(result)` (Dòng 15-38)

**Chức năng:** Format kết quả thành markdown để AI dễ đọc

**Process:**
1. Kiểm tra có error không
2. Tạo header với domain/stack và query
3. Với mỗi result:
   - Tạo section "Result 1", "Result 2", ...
   - Format key-value pairs
   - Giới hạn value length 300 ký tự

**Output format:**
```markdown
## UI/UX Builder Search Results
**Domain:** style | **Query:** minimalism
**Source:** styles.csv | **Found:** 3 results

### Result 1
- **Style Category:** Minimalism
- **Type:** General
- **Keywords:** minimal, clean, simple
...
```

#### C. Main CLI (Dòng 41-61)

**Argument Parser:**
```python
python search.py "minimalism" --domain style --max-results 5
```

**Arguments:**
- `query` (required): Từ khóa tìm kiếm
- `--domain` / `-d`: Chỉ định domain (style, color, pages, etc.)
- `--stack` / `-s`: Tìm trong stack guidelines
- `--max-results` / `-n`: Số kết quả tối đa (default: 3)
- `--json`: Output dạng JSON thay vì markdown

**Logic:**
1. Parse arguments
2. Nếu có `--stack` → gọi `search_stack()`
3. Nếu không → gọi `search()`
4. Nếu có `--json` → output JSON
5. Nếu không → format markdown và print

---

## 🔄 Flow Hoàn Chỉnh

### Ví dụ: Search "minimal dark mode"

```bash
python3 scripts/search.py "minimal dark mode" --domain style
```

**Step 1:** `search.py` parse arguments
- `query = "minimal dark mode"`
- `domain = "style"`

**Step 2:** Gọi `search("minimal dark mode", "style", 3)`

**Step 3:** `core.py` xử lý:
1. Lấy config: `CSV_CONFIG["style"]`
2. Filepath: `data/styles.csv`
3. Load CSV → list of dicts
4. Tạo documents từ search_cols:
   ```
   Doc 1: "Minimalism General minimal clean simple Modern apps"
   Doc 2: "Dark Mode General dark night oled Modern apps"
   ...
   ```

**Step 4:** BM25 processing:
1. Tokenize query: `["minimal", "dark", "mode"]`
2. Tokenize documents
3. Fit BM25: tính IDF cho tất cả từ
4. Score mỗi document:
   - Document có "minimal", "dark", "mode" → score cao
   - Document chỉ có 1-2 từ → score thấp

**Step 5:** Lấy top 3 results với score > 0

**Step 6:** Format output:
```markdown
## UI/UX Builder Search Results
**Domain:** style | **Query:** minimal dark mode
**Source:** styles.csv | **Found:** 3 results

### Result 1
- **Style Category:** Minimalism
- **Type:** General
...
```

**Step 7:** Print kết quả

---

## 🎯 Điểm Mạnh Của BM25

1. **Tốt hơn TF-IDF:**
   - Xử lý tốt hơn với documents có độ dài khác nhau
   - Công thức BM25 có saturation (từ xuất hiện nhiều lần không tăng điểm vô hạn)

2. **Không cần training:**
   - Không cần machine learning model
   - Chỉ cần tính toán thống kê

3. **Nhanh:**
   - O(n) với n là số documents
   - Phù hợp với dataset nhỏ-trung bình (< 10,000 records)

4. **Dễ hiểu:**
   - Logic rõ ràng, dễ debug
   - Có thể giải thích tại sao document được xếp hạng cao

---

## 📊 So Sánh Với Các Phương Pháp Khác

| Phương Pháp | Ưu Điểm | Nhược Điểm |
|------------|---------|------------|
| **BM25** (hiện tại) | Nhanh, không cần training, kết quả tốt | Không học được semantic meaning |
| **TF-IDF** | Đơn giản | Kém hơn BM25 với documents dài |
| **Vector Search (embeddings)** | Hiểu semantic, tìm được synonyms | Cần model, chậm hơn, phức tạp |
| **Keyword Match** | Rất nhanh | Không có ranking, kết quả kém |

**Tại sao chọn BM25:**
- Dataset nhỏ (hàng trăm records) → BM25 đủ tốt
- Không cần hiểu semantic (từ khóa rõ ràng)
- Cần tốc độ và đơn giản
- Kết quả đủ tốt cho use case này

---

## 🔧 Cách Mở Rộng

### Thêm Domain Mới:

1. Thêm vào `CSV_CONFIG`:
```python
"new_domain": {
    "file": "new_domain.csv",
    "search_cols": ["Column1", "Column2"],
    "output_cols": ["Column1", "Column2", "Column3"]
}
```

2. Thêm keywords vào `detect_domain()`:
```python
"new_domain": ["keyword1", "keyword2", ...]
```

3. Tạo file CSV trong `data/`

### Thêm Stack Mới:

1. Thêm vào `STACK_CONFIG`:
```python
"new_stack": {"file": "stacks/new_stack.csv"}
```

2. Tạo file CSV trong `data/stacks/`

---

## 🐛 Debug Tips

1. **Không có kết quả:**
   - Kiểm tra file CSV có tồn tại không
   - Kiểm tra search_cols có đúng tên cột không
   - Thử query đơn giản hơn

2. **Kết quả không liên quan:**
   - Kiểm tra domain có đúng không
   - Thử chỉ định domain thay vì auto-detect
   - Kiểm tra keywords trong CSV có match không

3. **Performance chậm:**
   - Dataset quá lớn → cân nhắc vector search
   - Hoặc cache BM25 index

---

## 📝 Tóm Tắt

**UI/UX Builder Search Engine hoạt động như sau:**

1. **Input:** Query string + domain (optional)
2. **Process:**
   - Auto-detect domain nếu không chỉ định
   - Load CSV file tương ứng
   - Tạo documents từ search columns
   - Áp dụng BM25 algorithm để rank
   - Lấy top N results
3. **Output:** Formatted markdown hoặc JSON với kết quả tìm kiếm

**Ưu điểm:**
- ✅ Nhanh và hiệu quả
- ✅ Không cần dependencies phức tạp
- ✅ Dễ mở rộng và maintain
- ✅ Kết quả tốt cho dataset nhỏ-trung bình
