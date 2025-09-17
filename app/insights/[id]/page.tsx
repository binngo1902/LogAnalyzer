"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

interface BlogPost {
  id: string
  title: string
  content: string
  category: 'guides' | 'trends' | 'news'
  author: string
  publishDate: string
  readTime: string
  tags: string[]
  tableOfContents: { id: string; title: string; level: number }[]
}

const mockBlogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'Complete Guide to Server Log Analysis for SEO',
    content: `
# Introduction

Server log analysis is one of the most powerful yet underutilized techniques in SEO. By examining your server logs, you can gain unprecedented insights into how search engines crawl your site, identify technical issues, and optimize your crawl budget.

## What Are Server Logs?

Server logs are files that record every request made to your web server. They contain valuable information including:

- IP addresses of visitors and bots
- Requested URLs
- HTTP status codes
- User agents
- Timestamps
- Response sizes

## Why Server Log Analysis Matters for SEO

### 1. Crawl Budget Optimization

Understanding how search engine bots crawl your site helps you optimize your crawl budget. You can identify:

- Pages that are being crawled too frequently
- Important pages that aren't being crawled enough
- Crawl errors that waste budget

### 2. Technical SEO Issues

Server logs reveal technical problems that might not be visible through other tools:

- 404 errors that need fixing
- Redirect chains
- Server errors (5xx codes)
- Slow-loading pages

### 3. Bot Behavior Analysis

Different search engines have different crawling patterns. By analyzing bot behavior, you can:

- Understand which pages are prioritized by each search engine
- Identify crawling anomalies
- Optimize for specific search engines

## How to Analyze Server Logs

### Step 1: Collect Your Logs

Most web servers (Apache, Nginx, IIS) generate logs automatically. Common log formats include:

- Common Log Format (CLF)
- Extended Log Format
- W3C Extended Log Format

### Step 2: Parse and Filter the Data

Use tools like LogInsight to parse your log files and filter for:

- Search engine bots (Googlebot, Bingbot, etc.)
- Specific time periods
- Particular URLs or sections
- HTTP status codes

### Step 3: Analyze Key Metrics

Focus on these important metrics:

- **Crawl frequency**: How often are pages being crawled?
- **Status codes**: Are there errors that need attention?
- **Response times**: Which pages are slow to load?
- **Bot distribution**: Which search engines are crawling most?

## Common Issues and Solutions

### Issue 1: Wasted Crawl Budget

**Problem**: Bots are crawling unimportant pages too frequently.

**Solution**: 
- Use robots.txt to block unnecessary pages
- Implement proper internal linking
- Fix duplicate content issues

### Issue 2: Important Pages Not Being Crawled

**Problem**: Key pages aren't being discovered by search engines.

**Solution**:
- Improve internal linking structure
- Submit XML sitemaps
- Increase page authority through quality backlinks

### Issue 3: High Error Rates

**Problem**: Many 404 or 5xx errors in crawl data.

**Solution**:
- Fix broken internal links
- Implement proper redirects
- Address server performance issues

## Advanced Techniques

### Log Segmentation

Segment your analysis by:

- Device type (mobile vs desktop crawlers)
- Geographic location
- Time of day
- Search engine

### Correlation Analysis

Compare log data with:

- Google Search Console data
- Analytics traffic data
- Ranking changes

## Tools and Resources

While you can analyze logs manually, specialized tools make the process much easier:

- **LogInsight**: AI-powered log analysis with visualization
- **Screaming Frog Log File Analyser**: Desktop tool for log analysis
- **Custom scripts**: Python or R scripts for advanced analysis

## Conclusion

Server log analysis is an essential skill for technical SEO professionals. By understanding how search engines interact with your site, you can make data-driven decisions to improve crawlability, fix technical issues, and ultimately boost your search rankings.

Regular log analysis should be part of your SEO routine, helping you stay ahead of issues and optimize your site's performance for search engines.
    `,
    category: 'guides',
    author: 'LogInsight Team',
    publishDate: '2025-09-01',
    readTime: '8 min read',
    tags: ['SEO', 'Log Analysis', 'Technical SEO'],
    tableOfContents: [
      { id: 'introduction', title: 'Introduction', level: 1 },
      { id: 'what-are-server-logs', title: 'What Are Server Logs?', level: 2 },
      { id: 'why-server-log-analysis-matters', title: 'Why Server Log Analysis Matters for SEO', level: 2 },
      { id: 'crawl-budget-optimization', title: 'Crawl Budget Optimization', level: 3 },
      { id: 'technical-seo-issues', title: 'Technical SEO Issues', level: 3 },
      { id: 'bot-behavior-analysis', title: 'Bot Behavior Analysis', level: 3 },
      { id: 'how-to-analyze-server-logs', title: 'How to Analyze Server Logs', level: 2 },
      { id: 'common-issues-and-solutions', title: 'Common Issues and Solutions', level: 2 },
      { id: 'advanced-techniques', title: 'Advanced Techniques', level: 2 },
      { id: 'tools-and-resources', title: 'Tools and Resources', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 }
    ]
  },
  '2': {
    id: '2',
    title: 'Top SEO Trends to Watch in 2025',
    content: `
# The SEO Landscape in 2025

As we progress through 2025, the SEO landscape continues to evolve at a rapid pace. Search engines are becoming more sophisticated, user expectations are rising, and new technologies are reshaping how we approach search optimization.

## 1. AI-Powered Content and Search

### The Rise of AI-Generated Content

Artificial intelligence has fundamentally changed content creation. However, search engines are getting better at detecting and evaluating AI-generated content.

**Key considerations:**
- Focus on AI-assisted rather than AI-generated content
- Maintain human oversight and expertise
- Ensure content provides genuine value

### AI Search Features

Search engines are integrating more AI features:
- Enhanced featured snippets
- Conversational search results
- Personalized search experiences

## 2. Core Web Vitals Evolution

Google continues to refine Core Web Vitals, with new metrics on the horizon:

### New Metrics to Watch
- **Interaction to Next Paint (INP)**: Replacing First Input Delay
- **Time to Interactive (TTI)**: Enhanced measurement
- **Visual Stability**: Beyond Cumulative Layout Shift

### Optimization Strategies
- Implement advanced caching strategies
- Optimize JavaScript execution
- Prioritize critical rendering path

## 3. Voice and Visual Search Growth

### Voice Search Optimization
- Focus on conversational keywords
- Optimize for local search queries
- Create FAQ-style content

### Visual Search Trends
- Image SEO becomes more critical
- Video content optimization
- AR/VR search experiences

## 4. E-A-T and Content Quality

Expertise, Authoritativeness, and Trustworthiness remain crucial:

### Building E-A-T
- Author bylines and credentials
- Expert reviews and citations
- Transparent business information
- Quality backlink profiles

## 5. Technical SEO Advances

### JavaScript SEO
- Better crawling of dynamic content
- Improved rendering capabilities
- Client-side vs server-side considerations

### Mobile-First Indexing
- Mobile page speed optimization
- Touch-friendly design
- Progressive Web Apps (PWAs)

## 6. Local SEO Evolution

### Google Business Profile Optimization
- Enhanced local features
- Review management strategies
- Local content creation

### Hyperlocal Targeting
- Neighborhood-level optimization
- Local event marketing
- Community engagement

## Preparing for the Future

### Stay Informed
- Follow search engine announcements
- Monitor algorithm updates
- Engage with SEO communities

### Focus on Fundamentals
- Quality content creation
- Technical excellence
- User experience optimization

### Embrace Change
- Test new features early
- Adapt strategies quickly
- Maintain flexibility

## Conclusion

2025 promises to be an exciting year for SEO professionals. By staying ahead of these trends and maintaining focus on user value, you can ensure your SEO strategies remain effective in this evolving landscape.
    `,
    category: 'trends',
    author: 'Sarah Johnson',
    publishDate: '2025-08-28',
    readTime: '6 min read',
    tags: ['SEO Trends', '2025', 'Algorithm Updates'],
    tableOfContents: [
      { id: 'the-seo-landscape-in-2025', title: 'The SEO Landscape in 2025', level: 1 },
      { id: 'ai-powered-content-and-search', title: 'AI-Powered Content and Search', level: 2 },
      { id: 'core-web-vitals-evolution', title: 'Core Web Vitals Evolution', level: 2 },
      { id: 'voice-and-visual-search-growth', title: 'Voice and Visual Search Growth', level: 2 },
      { id: 'e-a-t-and-content-quality', title: 'E-A-T and Content Quality', level: 2 },
      { id: 'technical-seo-advances', title: 'Technical SEO Advances', level: 2 },
      { id: 'local-seo-evolution', title: 'Local SEO Evolution', level: 2 },
      { id: 'preparing-for-the-future', title: 'Preparing for the Future', level: 2 },
      { id: 'conclusion', title: 'Conclusion', level: 2 }
    ]
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const postId = params.id as string
  const post = mockBlogPosts[postId]

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
          <Button asChild>
            <Link href="/insights">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Insights
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'guides': return <FileText className="h-4 w-4" />
      case 'trends': return <TrendingUp className="h-4 w-4" />
      case 'news': return <Calendar className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'guides': return 'bg-blue-100 text-blue-800'
      case 'trends': return 'bg-green-100 text-green-800'
      case 'news': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/insights">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Insights
          </Link>
        </Button>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge className={`${getCategoryColor(post.category)} flex items-center`}>
              {getCategoryIcon(post.category)}
              <span className="ml-1 capitalize">{post.category}</span>
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Table of Contents
                </h3>
                <nav className="space-y-2">
                  {post.tableOfContents.map(item => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm hover:text-primary transition-colors ${
                        item.level === 1 ? 'font-medium' : 
                        item.level === 2 ? 'ml-2' : 'ml-4'
                      } ${
                        item.level === 1 ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                    >
                      {item.title}
                    </a>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-ul:text-muted-foreground prose-ol:text-muted-foreground"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content
                      .split('\n')
                      .map(line => {
                        if (line.startsWith('# ')) {
                          const id = line.substring(2).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                          return `<h1 id="${id}">${line.substring(2)}</h1>`
                        }
                        if (line.startsWith('## ')) {
                          const id = line.substring(3).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                          return `<h2 id="${id}">${line.substring(3)}</h2>`
                        }
                        if (line.startsWith('### ')) {
                          const id = line.substring(4).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
                          return `<h3 id="${id}">${line.substring(4)}</h3>`
                        }
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return `<p><strong>${line.substring(2, line.length - 2)}</strong></p>`
                        }
                        if (line.startsWith('- ')) {
                          return `<li>${line.substring(2)}</li>`
                        }
                        if (line.trim() === '') {
                          return '<br>'
                        }
                        return `<p>${line}</p>`
                      })
                      .join('')
                  }}
                />
              </CardContent>
            </Card>

            {/* Author Bio */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">About the Author</h3>
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 rounded-full p-3">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">{post.author}</h4>
                    <p className="text-muted-foreground text-sm mt-1">
                      {post.author === 'LogInsight Team' 
                        ? 'The LogInsight team consists of SEO experts and data analysts passionate about helping professionals optimize their websites through advanced log analysis.'
                        : 'SEO specialist with over 8 years of experience in technical SEO, content optimization, and data analysis.'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Related Articles</h3>
                <div className="space-y-4">
                  <Link href="/insights/2" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-foreground hover:text-primary">
                      Top SEO Trends to Watch in 2025
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Discover the latest SEO trends and algorithm updates...
                    </p>
                  </Link>
                  <Link href="/insights/3" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h4 className="font-medium text-foreground hover:text-primary">
                      Google Announces New Core Web Vitals Update
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Google has announced significant changes to Core Web Vitals...
                    </p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}