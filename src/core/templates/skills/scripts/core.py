#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX Builder Core - BM25 search engine for UI/UX style guides
"""

import csv
import re
from pathlib import Path
from math import log
from collections import defaultdict

# Optional dependencies for vector search
try:
    from sentence_transformers import SentenceTransformer
    import numpy as np
    from sklearn.metrics.pairwise import cosine_similarity
    VECTOR_AVAILABLE = True
except ImportError:
    VECTOR_AVAILABLE = False

# ============ CONFIGURATION ============
DATA_DIR = Path(__file__).parent.parent / "data"
MAX_RESULTS = 3

CSV_CONFIG = {
    "style": {
        "file": "styles.csv",
        "search_cols": ["Style Category", "Keywords", "Best For", "Type"],
        "output_cols": ["Style Category", "Type", "Keywords", "Primary Colors", "Effects & Animation", "Best For", "Performance", "Accessibility", "Framework Compatibility", "Complexity"]
    },
    "prompt": {
        "file": "prompts.csv",
        "search_cols": ["Style Category", "AI Prompt Keywords (Copy-Paste Ready)", "CSS/Technical Keywords"],
        "output_cols": ["Style Category", "AI Prompt Keywords (Copy-Paste Ready)", "CSS/Technical Keywords", "Implementation Checklist"]
    },
    "color": {
        "file": "colors.csv",
        "search_cols": ["Product Type", "Keywords", "Notes"],
        "output_cols": ["Product Type", "Keywords", "Primary (Hex)", "Secondary (Hex)", "CTA (Hex)", "Background (Hex)", "Text (Hex)", "Border (Hex)", "Notes"]
    },
    "chart": {
        "file": "charts.csv",
        "search_cols": ["Data Type", "Keywords", "Best Chart Type", "Accessibility Notes"],
        "output_cols": ["Data Type", "Keywords", "Best Chart Type", "Secondary Options", "Color Guidance", "Accessibility Notes", "Library Recommendation", "Interactive Level"]
    },
    "landing": {
        "file": "landing.csv",
        "search_cols": ["Pattern Name", "Keywords", "Conversion Optimization", "Section Order"],
        "output_cols": ["Pattern Name", "Keywords", "Section Order", "Primary CTA Placement", "Color Strategy", "Conversion Optimization"]
    },
    "product": {
        "file": "products.csv",
        "search_cols": ["Product Type", "Keywords", "Primary Style Recommendation", "Key Considerations"],
        "output_cols": ["Product Type", "Keywords", "Primary Style Recommendation", "Secondary Styles", "Landing Page Pattern", "Dashboard Style (if applicable)", "Color Palette Focus"]
    },
    "ux": {
        "file": "ux-guidelines.csv",
        "search_cols": ["Category", "Issue", "Description", "Platform"],
        "output_cols": ["Category", "Issue", "Platform", "Description", "Do", "Don't", "Code Example Good", "Code Example Bad", "Severity"]
    },
    "typography": {
        "file": "typography.csv",
        "search_cols": ["Font Pairing Name", "Category", "Mood/Style Keywords", "Best For", "Heading Font", "Body Font"],
        "output_cols": ["Font Pairing Name", "Category", "Heading Font", "Body Font", "Mood/Style Keywords", "Best For", "Google Fonts URL", "CSS Import", "Tailwind Config", "Notes"]
    },
    "pages": {
        "file": "pages.csv",
        "search_cols": ["Page Type", "Keywords", "Section Order", "Key Components", "Layout Pattern", "Best For"],
        "output_cols": ["Page Type", "Keywords", "Section Order", "Key Components", "Layout Pattern", "Color Strategy", "Recommended Effects", "Best For", "Considerations"]
    }
}

STACK_CONFIG = {
    "html-tailwind": {"file": "stacks/html-tailwind.csv"},
    "react": {"file": "stacks/react.csv"},
    "nextjs": {"file": "stacks/nextjs.csv"},
    "vue": {"file": "stacks/vue.csv"},
    "svelte": {"file": "stacks/svelte.csv"},
    "swiftui": {"file": "stacks/swiftui.csv"},
    "react-native": {"file": "stacks/react-native.csv"},
    "flutter": {"file": "stacks/flutter.csv"}
}

# Common columns for all stacks
_STACK_COLS = {
    "search_cols": ["Category", "Guideline", "Description", "Do", "Don't"],
    "output_cols": ["Category", "Guideline", "Description", "Do", "Don't", "Code Good", "Code Bad", "Severity", "Docs URL"]
}

AVAILABLE_STACKS = list(STACK_CONFIG.keys())


# ============ BM25 IMPLEMENTATION ============
class BM25:
    """BM25 ranking algorithm for text search"""

    def __init__(self, k1=1.5, b=0.75):
        self.k1 = k1
        self.b = b
        self.corpus = []
        self.doc_lengths = []
        self.avgdl = 0
        self.idf = {}
        self.doc_freqs = defaultdict(int)
        self.N = 0

    def tokenize(self, text):
        """Lowercase, split, remove punctuation, filter short words"""
        text = re.sub(r'[^\w\s]', ' ', str(text).lower())
        return [w for w in text.split() if len(w) > 2]

    def fit(self, documents):
        """Build BM25 index from documents"""
        self.corpus = [self.tokenize(doc) for doc in documents]
        self.N = len(self.corpus)
        if self.N == 0:
            return
        self.doc_lengths = [len(doc) for doc in self.corpus]
        self.avgdl = sum(self.doc_lengths) / self.N

        for doc in self.corpus:
            seen = set()
            for word in doc:
                if word not in seen:
                    self.doc_freqs[word] += 1
                    seen.add(word)

        for word, freq in self.doc_freqs.items():
            self.idf[word] = log((self.N - freq + 0.5) / (freq + 0.5) + 1)

    def score(self, query):
        """Score all documents against query"""
        query_tokens = self.tokenize(query)
        scores = []

        for idx, doc in enumerate(self.corpus):
            score = 0
            doc_len = self.doc_lengths[idx]
            term_freqs = defaultdict(int)
            for word in doc:
                term_freqs[word] += 1

            for token in query_tokens:
                if token in self.idf:
                    tf = term_freqs[token]
                    idf = self.idf[token]
                    numerator = tf * (self.k1 + 1)
                    denominator = tf + self.k1 * (1 - self.b + self.b * doc_len / self.avgdl)
                    score += idf * numerator / denominator

            scores.append((idx, score))

        return sorted(scores, key=lambda x: x[1], reverse=True)


# ============ VECTOR SEARCH IMPLEMENTATION ============
class VectorSearch:
    """Vector-based semantic search using sentence transformers"""
    
    def __init__(self):
        if not VECTOR_AVAILABLE:
            raise ImportError(
                "Vector search requires sentence-transformers and scikit-learn. "
                "Install with: pip install sentence-transformers scikit-learn"
            )
        # Use lightweight, fast model
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embeddings = None
        self.documents = None
    
    def fit(self, documents):
        """Encode documents into vectors"""
        self.documents = documents
        if len(documents) == 0:
            self.embeddings = np.array([])
            return
        # Encode without progress bar for cleaner output
        self.embeddings = self.model.encode(documents, show_progress_bar=False, convert_to_numpy=True)
    
    def search(self, query, top_k=3):
        """Search using cosine similarity"""
        if self.embeddings is None or len(self.embeddings) == 0:
            return []
        
        # Encode query
        query_embedding = self.model.encode([query], show_progress_bar=False, convert_to_numpy=True)
        
        # Calculate cosine similarity
        similarities = cosine_similarity(query_embedding, self.embeddings)[0]
        
        # Get top k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        # Return (index, score) tuples
        return [(int(idx), float(similarities[idx])) for idx in top_indices if similarities[idx] > 0]


# ============ SEARCH FUNCTIONS ============
def _load_csv(filepath):
    """Load CSV and return list of dicts"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return list(csv.DictReader(f))


def _search_csv(filepath, search_cols, output_cols, query, max_results, mode='bm25'):
    """Core search function using BM25, Vector, or Hybrid"""
    if not filepath.exists():
        return []

    data = _load_csv(filepath)

    # Build documents from search columns
    documents = [" ".join(str(row.get(col, "")) for col in search_cols) for row in data]
    
    if len(documents) == 0:
        return []

    # Choose search mode
    if mode == 'bm25' or (mode in ['vector', 'hybrid'] and not VECTOR_AVAILABLE):
        # BM25 search (default or fallback)
        bm25 = BM25()
        bm25.fit(documents)
        ranked = bm25.score(query)
        
        # Get top results with score > 0
        results = []
        for idx, score in ranked[:max_results]:
            if score > 0:
                row = data[idx]
                results.append({col: row.get(col, "") for col in output_cols if col in row})
        
        return results
    
    elif mode == 'vector':
        # Vector search
        vector_search = VectorSearch()
        vector_search.fit(documents)
        ranked = vector_search.search(query, top_k=max_results)
        
        results = []
        for idx, score in ranked:
            row = data[idx]
            results.append({col: row.get(col, "") for col in output_cols if col in row})
        
        return results
    
    elif mode == 'hybrid':
        # Hybrid search: combine BM25 + Vector
        # Get more results from each to combine
        search_count = max_results * 2
        
        # BM25 results
        bm25 = BM25()
        bm25.fit(documents)
        bm25_ranked = bm25.score(query)
        bm25_scores = {idx: score for idx, score in bm25_ranked[:search_count] if score > 0}
        
        # Vector results
        vector_search = VectorSearch()
        vector_search.fit(documents)
        vector_ranked = vector_search.search(query, top_k=search_count)
        vector_scores = {idx: score for idx, score in vector_ranked}
        
        # Normalize scores to 0-1 range
        max_bm25 = max(bm25_scores.values()) if bm25_scores else 1.0
        max_vector = max(vector_scores.values()) if vector_scores else 1.0
        
        # Combine scores (alpha = 0.5 for balanced, can be adjusted)
        alpha = 0.5
        combined_scores = {}
        all_indices = set(bm25_scores.keys()) | set(vector_scores.keys())
        
        for idx in all_indices:
            bm25_norm = (bm25_scores.get(idx, 0) / max_bm25) if max_bm25 > 0 else 0
            vector_norm = (vector_scores.get(idx, 0) / max_vector) if max_vector > 0 else 0
            combined_scores[idx] = alpha * bm25_norm + (1 - alpha) * vector_norm
        
        # Sort by combined score
        sorted_indices = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Get top results
        results = []
        for idx, score in sorted_indices[:max_results]:
            if score > 0:
                row = data[idx]
                results.append({col: row.get(col, "") for col in output_cols if col in row})
        
        return results
    
    else:
        # Unknown mode, fallback to BM25
        return _search_csv(filepath, search_cols, output_cols, query, max_results, mode='bm25')


def detect_domain(query):
    """Auto-detect the most relevant domain from query"""
    query_lower = query.lower()

    domain_keywords = {
        "color": ["color", "palette", "hex", "#", "rgb"],
        "chart": ["chart", "graph", "visualization", "trend", "bar", "pie", "scatter", "heatmap", "funnel"],
        "landing": ["landing", "page", "cta", "conversion", "hero", "testimonial", "pricing", "section"],
        "product": ["saas", "ecommerce", "e-commerce", "fintech", "healthcare", "gaming", "portfolio", "crypto", "dashboard"],
        "prompt": ["prompt", "css", "implementation", "variable", "checklist", "tailwind"],
        "style": ["style", "design", "ui", "minimalism", "glassmorphism", "neumorphism", "brutalism", "dark mode", "flat", "aurora"],
        "ux": ["ux", "usability", "accessibility", "wcag", "touch", "scroll", "animation", "keyboard", "navigation", "mobile"],
        "typography": ["font", "typography", "heading", "serif", "sans"],
        "pages": ["page", "home", "homepage", "about", "post", "article", "blog", "category", "pricing", "faq", "contact", "product", "shop", "catalog", "details", "single"]
    }

    scores = {domain: sum(1 for kw in keywords if kw in query_lower) for domain, keywords in domain_keywords.items()}
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "style"


def search(query, domain=None, max_results=MAX_RESULTS, mode='bm25'):
    """
    Main search function with auto-domain detection
    
    Args:
        query: Search query string
        domain: Domain to search (auto-detected if None)
        max_results: Maximum number of results
        mode: Search mode - 'bm25' (default), 'vector', or 'hybrid'
    
    Returns:
        Dictionary with search results
    """
    if domain is None:
        domain = detect_domain(query)

    config = CSV_CONFIG.get(domain, CSV_CONFIG["style"])
    filepath = DATA_DIR / config["file"]

    if not filepath.exists():
        return {"error": f"File not found: {filepath}", "domain": domain}

    # Validate mode
    if mode not in ['bm25', 'vector', 'hybrid']:
        mode = 'bm25'
    
    # Fallback to BM25 if vector dependencies not available
    if mode in ['vector', 'hybrid'] and not VECTOR_AVAILABLE:
        mode = 'bm25'

    results = _search_csv(filepath, config["search_cols"], config["output_cols"], query, max_results, mode)

    return {
        "domain": domain,
        "query": query,
        "file": config["file"],
        "mode": mode,
        "count": len(results),
        "results": results
    }


def search_stack(query, stack, max_results=MAX_RESULTS, mode='bm25'):
    """Search stack-specific guidelines"""
    if stack not in STACK_CONFIG:
        return {"error": f"Unknown stack: {stack}. Available: {', '.join(AVAILABLE_STACKS)}"}

    filepath = DATA_DIR / STACK_CONFIG[stack]["file"]

    if not filepath.exists():
        return {"error": f"Stack file not found: {filepath}", "stack": stack}

    # Validate mode and fallback if needed
    if mode not in ['bm25', 'vector', 'hybrid']:
        mode = 'bm25'
    if mode in ['vector', 'hybrid'] and not VECTOR_AVAILABLE:
        mode = 'bm25'

    results = _search_csv(filepath, _STACK_COLS["search_cols"], _STACK_COLS["output_cols"], query, max_results, mode)

    return {
        "domain": "stack",
        "stack": stack,
        "query": query,
        "file": STACK_CONFIG[stack]["file"],
        "mode": mode,
        "count": len(results),
        "results": results
    }
