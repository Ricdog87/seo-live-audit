/**
 * DataForSEO API client for comprehensive SEO data
 * This module provides functionality to interact with DataForSEO APIs for technical SEO analysis
 */

import crypto from 'crypto';

// DataForSEO API interfaces
interface DataForSEOCredentials {
  login: string;
  password: string;
}

interface DataForSEOResponse {
  version?: string;
  status_code?: number;
  status_message?: string;
  time?: string;
  cost?: number;
  tasks_count?: number;
  tasks_error?: number;
  tasks?: any[];
}

interface OnPageTask {
  domain: string;
  limit?: number;
  crawl_max_pages?: number;
  load_resources?: boolean;
  enable_javascript?: boolean;
  enable_browser_rendering?: boolean;
}

interface KeywordResearchTask {
  keywords: string[];
  language_name: string;
  location_name: string;
  include_serp_info?: boolean;
  include_clickstream_data?: boolean;
}

/**
 * DataForSEO API Client
 */
export class DataForSEOClient {
  private credentials: DataForSEOCredentials;
  private baseUrl = 'https://api.dataforseo.com/v3';

  constructor() {
    this.credentials = {
      login: process.env.DATAFORSEO_LOGIN || '',
      password: process.env.DATAFORSEO_PASSWORD || ''
    };

    if (!this.credentials.login || !this.credentials.password) {
      console.warn('DataForSEO credentials not found. API calls will use placeholder data.');
    }
  }

  /**
   * Generate basic auth header
   */
  private getAuthHeader(): string {
    const auth = Buffer.from(`${this.credentials.login}:${this.credentials.password}`).toString('base64');
    return `Basic ${auth}`;
  }

  /**
   * Make authenticated request to DataForSEO API
   */
  private async makeRequest(endpoint: string, data?: any): Promise<DataForSEOResponse> {
    if (!this.credentials.login || !this.credentials.password) {
      // Return placeholder data when credentials are not available
      return this.getPlaceholderResponse(endpoint);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`DataForSEO API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('DataForSEO API error:', error);
      return this.getPlaceholderResponse(endpoint);
    }
  }

  /**
   * Get placeholder response for development/testing
   */
  private getPlaceholderResponse(endpoint: string): DataForSEOResponse {
    const baseResponse = {
      version: '0.1.20240814',
      status_code: 20000,
      status_message: 'Ok. (placeholder response)',
      time: new Date().toISOString(),
      cost: 0,
      tasks_count: 1,
      tasks_error: 0,
    };

    if (endpoint.includes('/on_page/')) {
      return {
        ...baseResponse,
        tasks: [{
          id: 'placeholder_onpage_' + Date.now(),
          status_code: 20000,
          status_message: 'Ok. (placeholder)',
          time: new Date().toISOString(),
          cost: 0,
          result_count: 1,
          path: [endpoint],
          data: {
            api: 'on_page',
            function: 'task_post',
            se_type: 'task_post',
            result: {
              crawl_progress: 'finished',
              crawl_status: {
                max_crawl_pages: 100,
                pages_crawled: 50,
                pages_summary: {
                  '2xx': 45,
                  '3xx': 3,
                  '4xx': 2,
                  '5xx': 0
                }
              },
              items_count: 50,
              items: [
                {
                  resource_type: 'html',
                  status_code: 200,
                  page_timing: {
                    time_to_interactive: 2500,
                    dom_complete: 2200,
                    largest_contentful_paint: 1800,
                    first_input_delay: 100,
                    cumulative_layout_shift: 0.1
                  },
                  page_metrics: {
                    links_internal: 25,
                    links_external: 8,
                    duplicate_title: false,
                    duplicate_description: false,
                    duplicate_content: false,
                    click_depth: 2
                  },
                  on_page_score: 85,
                  checks: {
                    no_h1_tag: false,
                    low_content_rate: false,
                    high_loading_time: true,
                    is_redirect: false,
                    is_4xx: false,
                    is_5xx: false
                  }
                }
              ]
            }
          }
        }]
      };
    }

    if (endpoint.includes('/keywords_data/')) {
      return {
        ...baseResponse,
        tasks: [{
          id: 'placeholder_keywords_' + Date.now(),
          status_code: 20000,
          status_message: 'Ok. (placeholder)',
          result: [{
            keyword: 'example seo',
            location_code: 2840,
            language_code: 'en',
            search_partners: false,
            competition: 'MEDIUM',
            competition_index: 45,
            search_volume: 8900,
            low_top_of_page_bid: 1.2,
            high_top_of_page_bid: 3.8,
            cpc: 2.5,
            monthly_searches: [
              { year: 2024, month: 7, search_volume: 8900 },
              { year: 2024, month: 6, search_volume: 9200 },
              { year: 2024, month: 5, search_volume: 8700 }
            ]
          }]
        }]
      };
    }

    return baseResponse;
  }

  /**
   * Perform On-Page SEO audit
   */
  async onPageAudit(domain: string, options: Partial<OnPageTask> = {}): Promise<any> {
    const taskData = {
      domain: domain.replace(/^https?:\/\//, ''),
      limit: options.limit || 100,
      crawl_max_pages: options.crawl_max_pages || 50,
      load_resources: options.load_resources || true,
      enable_javascript: options.enable_javascript || true,
      enable_browser_rendering: options.enable_browser_rendering || true,
      custom_js: """// Check for Core Web Vitals
                    window.performance && window.performance.getEntriesByType('navigation');""",
      tag: `audit_${domain.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
    };

    return await this.makeRequest('/on_page/task_post', [taskData]);
  }

  /**
   * Get keyword research data
   */
  async keywordResearch(keywords: string[], location: string = 'United States', language: string = 'English'): Promise<any> {
    const taskData: KeywordResearchTask = {
      keywords,
      language_name: language,
      location_name: location,
      include_serp_info: true,
      include_clickstream_data: true
    };

    return await this.makeRequest('/keywords_data/google/search_volume/task_post', [taskData]);
  }

  /**
   * Analyze competitor backlinks (placeholder implementation)
   */
  async backlinkAnalysis(domain: string, limit: number = 100): Promise<any> {
    console.log(`[PLACEHOLDER] Backlink analysis for ${domain} (limit: ${limit})`);
    
    return {
      placeholder: true,
      message: 'Backlink analysis placeholder - implement actual DataForSEO backlink API',
      domain,
      suggested_implementation: {
        endpoint: '/backlinks/summary/live',
        description: 'Use DataForSEO Backlinks API to get comprehensive backlink data',
        data_points: [
          'Total backlinks count',
          'Referring domains',
          'Backlinks by anchor text',
          'Top referring domains',
          'Backlink quality metrics',
          'Lost and new backlinks'
        ]
      },
      mock_data: {
        backlinks_count: 15420,
        referring_domains: 890,
        referring_domains_nofollow: 234,
        referring_main_domains: 567,
        referring_ips: 445,
        rank: 45.2,
        trust_score: 32.1
      }
    };
  }

  /**
   * Get SERP analysis for keywords
   */
  async serpAnalysis(keyword: string, location: string = 'United States', language: string = 'English'): Promise<any> {
    console.log(`[PLACEHOLDER] SERP analysis for "${keyword}" in ${location}`);

    return {
      placeholder: true,
      message: 'SERP analysis placeholder - implement actual DataForSEO SERP API',
      keyword,
      location,
      suggested_implementation: {
        endpoint: '/serp/google/organic/task_post',
        description: 'Use DataForSEO SERP API to get search results analysis',
        data_points: [
          'Top ranking pages',
          'Featured snippets',
          'Local pack results',
          'Knowledge graph data',
          'Related questions',
          'Competitor analysis in SERPs'
        ]
      },
      mock_data: {
        organic_results_count: 10,
        paid_results_count: 4,
        featured_snippets_count: 1,
        local_pack_count: 1,
        knowledge_graph_count: 1,
        top_competitors: [
          'competitor1.com',
          'competitor2.com',
          'competitor3.com'
        ]
      }
    };
  }

  /**
   * Get comprehensive SEO metrics for a domain
   */
  async getDomainMetrics(domain: string): Promise<any> {
    console.log(`[PLACEHOLDER] Getting domain metrics for ${domain}`);

    // In a real implementation, this would combine multiple API calls:
    // - On-page audit
    // - Backlink profile
    // - Keyword rankings
    // - Technical SEO issues

    return {
      placeholder: true,
      domain,
      message: 'Comprehensive domain metrics placeholder',
      metrics: {
        domain_rank: 42.5,
        organic_traffic: 125000,
        organic_keywords: 8940,
        backlinks: 15420,
        referring_domains: 890,
        technical_score: 78,
        content_score: 85,
        user_experience_score: 72,
        mobile_score: 88
      },
      top_issues: [
        'Page speed optimization needed',
        'Missing schema markup',
        'Broken internal links found',
        'Duplicate meta descriptions'
      ],
      opportunities: [
        'Target long-tail keywords',
        'Improve Core Web Vitals',
        'Build quality backlinks',
        'Optimize for local search'
      ]
    };
  }

  /**
   * Check API status and remaining credits
   */
  async getStatus(): Promise<any> {
    if (!this.credentials.login) {
      return {
        placeholder: true,
        message: 'DataForSEO credentials not configured',
        status: 'Configuration needed'
      };
    }

    try {
      return await this.makeRequest('/user');
    } catch (error) {
      return {
        error: 'Failed to get API status',
        details: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

/**
 * Default export for easy importing
 */
export default DataForSEOClient;

/**
 * Helper function to create a configured DataForSEO client
 */
export function createDataForSEOClient(): DataForSEOClient {
  return new DataForSEOClient();
}
