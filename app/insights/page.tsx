"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, TrendingUp, FileText, Star, Clock, User } from "lucide-react"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: 'guides' | 'trends' | 'news'
  author: string
  publishDate: string
  readTime: string
  featured: boolean
  tags: string[]
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Complete Guide to Server Log Analysis for SEO',
    excerpt: 'Learn how to analyze server logs to identify crawl issues, optimize crawl budget, and improve your site\'s SEO performance.',
    category: 'guides',
    author: 'LogInsight Team',
    publishDate: '2025-09-01',
    readTime: '8 min read',
    featured: true,
    tags: ['SEO', 'Log Analysis', 'Technical SEO']
  },
  {
    id: '2',
    title: 'Top SEO Trends to Watch in 2025',
    excerpt: 'Discover the latest SEO trends and algorithm updates that will shape search engine optimization strategies this year.',
    category: 'trends',
    author: 'Sarah Johnson',
    publishDate: '2025-08-28',
    readTime: '6 min read',
    featured: true,
    tags: ['SEO Trends', '2025', 'Algorithm Updates']
  },
  {
    id: '3',
    title: 'Google Announces New Core Web Vitals Update',
    excerpt: 'Google has announced significant changes to Core Web Vitals metrics that will impact search rankings starting next month.',
    category: 'news',
    author: 'Mike Chen',
    publishDate: '2025-08-25',
    readTime: '4 min read',
    featured: false,
    tags: ['Google', 'Core Web Vitals', 'Page Speed']
  },
  {
    id: '4',
    title: 'How to Optimize Crawl Budget for Large Websites',
    excerpt: 'Best practices for managing crawl budget on enterprise websites with millions of pages.',
    category: 'guides',
    author: 'Emma Davis',
    publishDate: '2025-08-22',
    readTime: '10 min read',
    featured: false,
    tags: ['Crawl Budget', 'Enterprise SEO', 'Technical SEO']
  },
  {
    id: '5',
    title: 'AI-Powered SEO Tools: The Future is Here',
    excerpt: 'Explore how artificial intelligence is revolutionizing SEO analysis and what it means for digital marketers.',
    category: 'trends',
    author: 'Alex Rodriguez',
    publishDate: '2025-08-20',
    readTime: '7 min read',
    featured: false,
    tags: ['AI', 'SEO Tools', 'Machine Learning']
  },
  {
    id: '6',
    title: 'Understanding Bot Traffic in Your Server Logs',
    excerpt: 'Learn to identify and analyze different types of bot traffic to improve your site\'s performance and security.',
    category: 'guides',
    author: 'LogInsight Team',
    publishDate: '2025-08-18',
    readTime: '9 min read',
    featured: false,
    tags: ['Bot Traffic', 'Security', 'Log Analysis']
  }
]

export default function InsightsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  const filteredPosts = mockBlogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory
    const matchesTag = selectedTag === 'all' || post.tags.some(tag => 
      tag.toLowerCase().includes(selectedTag.toLowerCase())
    )
    return matchesSearch && matchesCategory && matchesTag
  })

  const featuredPosts = filteredPosts.filter(post => post.featured)
  const regularPosts = filteredPosts.filter(post => !post.featured)

  const allTags = Array.from(new Set(mockBlogPosts.flatMap(post => post.tags)))

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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Insights Hub
          </h1>
          <p className="text-xl text-muted-foreground">
            Stay updated with the latest SEO guides, trends, and industry news
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="h-5 w-5 mr-2" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="guides">Guides</SelectItem>
                  <SelectItem value="trends">Trends</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>

              {/* Tag Filter */}
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tags</SelectItem>
                  {allTags.map(tag => (
                    <SelectItem key={tag} value={tag.toLowerCase()}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`${getCategoryColor(post.category)} flex items-center`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1 capitalize">{post.category}</span>
                      </Badge>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                    <CardTitle className="text-xl hover:text-primary transition-colors">
                      <Link href={`/insights/${post.id}`}>
                        {post.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-base">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        {post.author}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            All Articles ({filteredPosts.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map(post => (
              <Card key={post.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getCategoryColor(post.category)} flex items-center text-xs`}>
                      {getCategoryIcon(post.category)}
                      <span className="ml-1 capitalize">{post.category}</span>
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-lg hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/insights/${post.id}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-3">
                    {post.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(post.publishDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {post.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{post.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No articles found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedTag('all')
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Newsletter Signup */}
        <Card className="bg-primary text-white mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with SEO Insights
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get the latest SEO guides, trends, and industry news delivered to your inbox weekly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white text-foreground"
              />
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-50">
                Subscribe
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}