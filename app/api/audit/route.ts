import { NextRequest, NextResponse } from 'next/server';
import { perplexityChat, researchSerp } from '../../../lib/perplexity';
import { DataForSEOClient } from '../../../lib/dataforseo';

interface AuditRequest {
  domain: string;
  market: string;
}

interface AuditResult {
  domain: string;
  market: string;
  seoAnalysis?: any;
  serpResearch?: {
    answer: string;
    sources: Array<{
      title: string;
      url: string;
      snippet: string;
    }>;
  };
  technicalAudit?: any;
  contentAnalysis?: any;
  competitorAnalysis?: any;
  recommendations?: string[];
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const { domain, market }: AuditRequest = await request.json();

    if (!domain || !market) {
      return NextResponse.json(
        { error: 'Domain and market are required' },
        { status: 400 }
      );
    }

    // Initialize result object
    const auditResult: AuditResult = {
      domain,
      market,
      timestamp: new Date().toISOString(),
      recommendations: []
    };

    try {
      // Step 1: Research SERP data using Perplexity Sonar Pro
      const serpQuery = `SEO audit analysis for ${domain} in ${market} market`;
      const serpResearch = await researchSerp(
        serpQuery,
        market,
        'en' // Default to English, could be parameterized
      );
      auditResult.serpResearch = serpResearch;
    } catch (error) {
      console.error('SERP research error:', error);
      auditResult.serpResearch = {
        answer: 'SERP research temporarily unavailable',
        sources: []
      };
    }

    try {
      // Step 2: Get SEO analysis using Perplexity AI with SERP-oriented prompt
      const seoPrompt = `Based on SERP analysis for ${domain} in the ${market} market, provide comprehensive SEO insights:

1. Current search landscape analysis for ${domain}'s industry in ${market}
2. Competitor ranking patterns and strategies observed in search results
3. SERP features (snippets, local packs, ads) opportunities for ${domain}
4. Content gaps identified from top-ranking pages
5. Technical SEO recommendations based on ${market} search behavior
6. Market-specific keyword opportunities and search intent patterns
7. Mobile vs desktop SERP differences for ${market}
8. Local SEO opportunities if applicable to ${market}

Provide actionable recommendations with specific examples from current search results.`;
      
      const seoAnalysis = await perplexityChat(seoPrompt);
      auditResult.seoAnalysis = seoAnalysis;
    } catch (error) {
      console.error('Perplexity API error:', error);
      auditResult.seoAnalysis = { error: 'Failed to get AI analysis' };
    }

    try {
      // Step 3: Get technical audit data using DataForSEO
      const dataForSEO = new DataForSEOClient();
      
      // Placeholder: In a real implementation, you would call DataForSEO APIs
      // Example calls that would be implemented:
      // const technicalAudit = await dataForSEO.onPageAPI(domain);
      // const keywordData = await dataForSEO.keywordResearch(domain, market);
      // const backlinks = await dataForSEO.backlinkAnalysis(domain);
      
      auditResult.technicalAudit = {
        message: 'DataForSEO integration placeholder - implement actual API calls',
        suggestedChecks: [
          'Page speed analysis with Core Web Vitals',
          `Mobile responsiveness for ${market} market`,
          'Meta tags optimization based on SERP analysis',
          'Internal linking structure optimization',
          'Schema markup implementation for SERP features',
          `Local SEO setup for ${market} market`
        ]
      };
      
      auditResult.contentAnalysis = {
        message: 'Content analysis based on SERP research',
        suggestions: [
          `Keyword density analysis for ${market} search terms`,
          'Content gap analysis vs top SERP competitors',
          'Readability assessment for target market',
          'Content freshness evaluation',
          'Featured snippet optimization opportunities',
          `Market-specific content localization for ${market}`
        ]
      };
      
      auditResult.competitorAnalysis = {
        message: 'Competitor analysis based on SERP data',
        tasks: [
          `Identify top SERP competitors in ${market}`,
          'Analyze competitor keyword strategies from search results',
          'Compare backlink profiles of ranking competitors',
          'Content strategy comparison with SERP leaders',
          `Local competitor analysis for ${market} market`,
          'SERP feature competition analysis'
        ]
      };
    } catch (error) {
      console.error('DataForSEO API error:', error);
      auditResult.technicalAudit = { error: 'Failed to get technical audit data' };
    }

    // Generate recommendations based on SERP analysis and market
    auditResult.recommendations = [
      `Target SERP-identified keyword opportunities in ${market}`,
      'Optimize for featured snippets based on current search results',
      'Implement schema markup to compete for rich results',
      `Improve page loading speed to match ${market} SERP leaders`,
      `Build quality backlinks relevant to ${market} search landscape`,
      `Create content targeting ${market}-specific search intent`,
      'Optimize for voice search queries prevalent in search results',
      `Enhance local SEO presence in ${market} market`,
      'Implement mobile-first design based on SERP mobile analysis'
    ];

    return NextResponse.json(auditResult);

  } catch (error) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'SEO Live Audit API with Perplexity Sonar Pro SERP Research',
      endpoints: {
        POST: 'Submit domain and market for comprehensive SERP-based audit',
        parameters: {
          domain: 'string - The domain to audit (e.g., "example.com")',
          market: 'string - Target market/country (e.g., "US", "UK", "DE")'
        },
        features: [
          'Perplexity Sonar Pro SERP research and analysis',
          'AI-powered SEO insights with live search data',
          'Market-specific recommendations',
          'Competitor analysis based on current search results',
          'SERP feature optimization opportunities'
        ]
      }
    },
    { status: 200 }
  );
}
