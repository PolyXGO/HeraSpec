#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
UI/UX Builder Search - BM25, Vector, and Hybrid search engine for UI/UX style guides
Usage: python search.py "<query>" [--domain <domain>] [--stack <stack>] [--mode <mode>] [--max-results 3]

Domains: style, prompt, color, chart, landing, product, ux, typography, pages
Stacks: html-tailwind, react, nextjs, vue, svelte, swiftui, react-native, flutter
Modes: bm25 (default), vector, hybrid

Note: Vector and hybrid modes require: pip install sentence-transformers scikit-learn
"""

import argparse
from core import CSV_CONFIG, AVAILABLE_STACKS, MAX_RESULTS, search, search_stack, VECTOR_AVAILABLE


def format_output(result):
    """Format results for Claude consumption (token-optimized)"""
    if "error" in result:
        return f"Error: {result['error']}"

    output = []
    mode_info = f" | **Mode:** {result.get('mode', 'bm25')}"
    if result.get("stack"):
        output.append(f"## UI/UX Builder Stack Guidelines")
        output.append(f"**Stack:** {result['stack']} | **Query:** {result['query']}{mode_info}")
    else:
        output.append(f"## UI/UX Builder Search Results")
        output.append(f"**Domain:** {result['domain']} | **Query:** {result['query']}{mode_info}")
    output.append(f"**Source:** {result['file']} | **Found:** {result['count']} results\n")

    for i, row in enumerate(result['results'], 1):
        output.append(f"### Result {i}")
        for key, value in row.items():
            value_str = str(value)
            if len(value_str) > 300:
                value_str = value_str[:300] + "..."
            output.append(f"- **{key}:** {value_str}")
        output.append("")

    return "\n".join(output)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UI/UX Builder Search")
    parser.add_argument("query", help="Search query")
    parser.add_argument("--domain", "-d", choices=list(CSV_CONFIG.keys()), help="Search domain")
    parser.add_argument("--stack", "-s", choices=AVAILABLE_STACKS, help="Stack-specific search")
    parser.add_argument("--mode", "-m", choices=['bm25', 'vector', 'hybrid'], default='bm25',
                       help="Search mode: bm25 (default, keyword-based), vector (semantic), hybrid (best of both)")
    parser.add_argument("--max-results", "-n", type=int, default=MAX_RESULTS, help="Max results (default: 3)")
    parser.add_argument("--json", action="store_true", help="Output as JSON")

    args = parser.parse_args()

    # Check if vector mode is requested but not available
    if args.mode in ['vector', 'hybrid'] and not VECTOR_AVAILABLE:
        print("Warning: Vector/Hybrid mode requires sentence-transformers and scikit-learn.")
        print("Falling back to BM25 mode. Install with: pip install sentence-transformers scikit-learn")
        args.mode = 'bm25'

    # Stack search takes priority
    if args.stack:
        result = search_stack(args.query, args.stack, args.max_results, args.mode)
    else:
        result = search(args.query, args.domain, args.max_results, args.mode)

    if args.json:
        import json
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print(format_output(result))
