/**
 * Perplexity API client for SEO analysis
 * This module provides functionality to interact with Perplexity AI for SEO insights
 */

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Chat with Perplexity AI for SEO analysis
 * @param prompt - The prompt to send to Perplexity
 * @param model - The model to use (default: sonar-small-online)
 * @returns Promise with the AI response
 */
export async function perplexityChat(
  prompt: string,
  model: string = 'sonar-small-online'
): Promise<any> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY environment variable is required');
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert SEO consultant. Provide detailed, actionable SEO analysis and recommendations. Focus on technical SEO, content optimization, and market-specific strategies.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.2,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Perplexity API error: ${response.status} ${response.statusText}${errorData ? ` - ${errorData.error?.message || JSON.stringify(errorData)}` : ''}`
      );
    }

    const data: PerplexityResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Perplexity API');
    }

    // Return the structured response
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
      model: model,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Perplexity API error:', error);
    
    // Return a graceful fallback response
    return {
      content: 'SEO Analysis temporarily unavailable. Please check your API configuration and try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Generate SEO analysis prompts for different aspects
 */
export const seoPrompts = {
  technical: (domain: string, market: string) => 
    `Analyze the technical SEO aspects for ${domain} targeting the ${market} market. Focus on:
    1. Page speed optimization recommendations
    2. Mobile responsiveness requirements for ${market}
    3. Core Web Vitals improvements
    4. Schema markup opportunities
    5. Technical crawling and indexing issues
    Provide specific, actionable recommendations.`,

  content: (domain: string, market: string) => 
    `Analyze content strategy for ${domain} in the ${market} market. Consider:
    1. Keyword research and targeting strategies
    2. Content gaps and opportunities
    3. Market-specific content preferences
    4. Competitor content analysis
    5. Content optimization recommendations
    Provide detailed content strategy recommendations.`,

  competitor: (domain: string, market: string) => 
    `Perform competitor analysis for ${domain} in the ${market} market. Include:
    1. Top competitors identification
    2. Competitive keyword opportunities
    3. Content strategy comparison
    4. Backlink profile analysis
    5. Market positioning insights
    Provide strategic competitive recommendations.`,

  local: (domain: string, market: string) => 
    `Analyze local SEO opportunities for ${domain} in the ${market} market:
    1. Local search optimization strategies
    2. Google My Business optimization
    3. Local citation opportunities
    4. Market-specific local ranking factors
    5. Geo-targeted content recommendations
    Provide location-specific SEO advice.`
};

/**
 * Batch analysis function for comprehensive SEO audit
 */
export async function comprehensiveSEOAnalysis(
  domain: string,
  market: string
): Promise<{
  technical: any;
  content: any;
  competitor: any;
  local: any;
}> {
  const results = await Promise.allSettled([
    perplexityChat(seoPrompts.technical(domain, market)),
    perplexityChat(seoPrompts.content(domain, market)),
    perplexityChat(seoPrompts.competitor(domain, market)),
    perplexityChat(seoPrompts.local(domain, market))
  ]);

  return {
    technical: results[0].status === 'fulfilled' ? results[0].value : { error: 'Technical analysis failed' },
    content: results[1].status === 'fulfilled' ? results[1].value : { error: 'Content analysis failed' },
    competitor: results[2].status === 'fulfilled' ? results[2].value : { error: 'Competitor analysis failed' },
    local: results[3].status === 'fulfilled' ? results[3].value : { error: 'Local analysis failed' }
  };
}
