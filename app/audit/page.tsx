'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface AuditData {
  stage: string
  message: string
  data?: any
  error?: string
  completed?: boolean
}

export default function AuditPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [auditData, setAuditData] = useState<AuditData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const domain = searchParams.get('domain')
  const country = searchParams.get('country')
  const language = searchParams.get('language')

  useEffect(() => {
    if (!domain) {
      router.push('/')
      return
    }

    const runAudit = async () => {
      try {
        const response = await fetch('/api/audit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            domain: domain,
            country: country || 'US',
            language: language || 'en'
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
          throw new Error('No response body reader available')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                setAuditData(prev => [...prev, data])
                
                if (data.completed) {
                  setIsLoading(false)
                }
              } catch (e) {
                console.error('Error parsing SSE data:', e)
              }
            }
          }
        }
      } catch (err) {
        console.error('Audit error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
        setIsLoading(false)
      }
    }

    runAudit()
  }, [domain, country, language, router])

  if (!domain) {
    return null // Will redirect to home
  }

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'validation': return '✅'
      case 'perplexity': return '🔍'
      case 'dataforseo-keywords': return '🔑'
      case 'dataforseo-serp': return '📊'
      case 'complete': return '🎉'
      case 'error': return '❌'
      default: return '⏳'
    }
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'complete': return 'text-green-600'
      case 'error': return 'text-red-600'
      default: return 'text-blue-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                SEO Audit Results
              </h1>
              <div className="text-lg text-gray-600">
                Domain: <span className="font-semibold text-blue-600">{domain}</span>
                {country && country !== 'US' && (
                  <span className="ml-4">Country: <span className="font-semibold">{country}</span></span>
                )}
                {language && language !== 'en' && (
                  <span className="ml-4">Language: <span className="font-semibold">{language}</span></span>
                )}
              </div>
            </div>
            <Link 
              href="/"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
            >
              New Audit
            </Link>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">❌</span>
                <h3 className="text-lg font-semibold text-red-800">Audit Failed</h3>
              </div>
              <p className="text-red-700">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {auditData.map((item, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-all duration-300 ${
                    item.error 
                      ? 'border-red-200 bg-red-50' 
                      : item.completed
                      ? 'border-green-200 bg-green-50'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{getStageIcon(item.stage)}</span>
                    <h3 className={`text-lg font-semibold ${getStageColor(item.stage)}`}>
                      {item.stage.charAt(0).toUpperCase() + item.stage.slice(1).replace('-', ' ')}
                    </h3>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{item.message}</p>
                  
                  {item.error && (
                    <div className="bg-red-100 border border-red-300 rounded p-3 text-red-800">
                      <strong>Error:</strong> {item.error}
                    </div>
                  )}
                  
                  {item.data && (
                    <div className="bg-gray-100 rounded p-4 mt-3">
                      <details className="cursor-pointer">
                        <summary className="font-medium text-gray-700 hover:text-gray-900">
                          View Data
                        </summary>
                        <pre className="mt-2 text-sm text-gray-600 whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(item.data, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Running audit...</span>
                </div>
              )}
            </div>
          )}
          
          {!isLoading && !error && auditData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No audit data received. Please try again.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
