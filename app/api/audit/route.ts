import { NextRequest, NextResponse } from 'next/server';
import { perplexityChat } from '../../../lib/perplexity';
import { DataForSEOClient } from '../../../lib/dataforseo';

interface AuditRequest {
  domain: string;
  market: string;
}

interface AuditResult {
  domain: string;
  market: string;
  seoAnalysis?: any;
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
      // Step 1: Get basic SEO analysis using Perplexity AI
      const seoPrompt = `Analyze the SEO status of ${domain} for the ${market} market. 
      Provide insights on:
      1. Technical SEO basics
      2. Content strategy recommendations
      3. Market-specific optimization tips
      4. Common issues to check
      
      Return a structured analysis.`;
      
      const seoAnalysis = await perplexityChat(seoPrompt);
      auditResult.seoAnalysis = seoAnalysis;
    } catch (error) {
      console.error('Perplexity API error:', error);
      auditResult.seoAnalysis = { error: 'Failed to get AI analysis' };
    }

    try {
      // Step 2: Get technical audit data using DataForSEO
      const dataForSEO = new DataForSEOClient();
      
      // Placeholder: In a real implementation, you would call DataForSEO APIs
      // Example calls that would be implemented:
      // const technicalAudit = await dataForSEO.onPageAPI(domain);
      // const keywordData = await dataForSEO.keywordResearch(domain, market);
      // const backlinks = await dataForSEO.backlinkAnalysis(domain);
      
      auditResult.technicalAudit = {
        message: 'DataForSEO integration placeholder - implement actual API calls',
        suggestedChecks: [
          'Page speed analysis',
          'Mobile responsiveness',
          'Meta tags optimization',
          'Internal linking structure',
          'Schema markup implementation'
        ]
      };
      
      auditResult.contentAnalysis = {
        message: 'Content analysis placeholder',
        suggestions: [
          'Keyword density analysis',
          'Content gap analysis',
          'Readability assessment',
          'Content freshness evaluation'
        ]
      };
      
      auditResult.competitorAnalysis = {
        message: 'Competitor analysis placeholder',
        tasks: [
          'Identify top competitors in ' + market,
          'Analyze competitor keywords',
          'Compare backlink profiles',
          'Content strategy comparison'
        ]
      };
    } catch (error) {
      console.error('DataForSEO API error:', error);
      auditResult.technicalAudit = { error: 'Failed to get technical audit data' };
    }

    // Generate recommendations based on analysis
    auditResult.recommendations = [
      `Optimize for ${market} market-specific keywords`,
      'Improve page loading speed',
      'Implement proper schema markup',
      'Optimize meta titles and descriptions',
      'Build quality backlinks relevant to ' + market,
      'Create market-specific content',
      'Ensure mobile-first optimization'
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
      message: 'SEO Live Audit API',
      endpoints: {
        POST: 'Submit domain and market for audit',
        parameters: {
          domain: 'string - The domain to audit (e.g., "example.com")',
          market: 'string - Target market/country (e.g., "US", "UK", "DE")'
        }
      }
    },
    { status: 200 }
  );
}
