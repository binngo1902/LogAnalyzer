import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"
import { use } from "react";
import { blogPosts, getBlogPostById, getBlogPostParams } from "../data"


export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getBlogPostParams()
}

export default function BlogPostPage({ params }:  {params: Promise<{ id: string }>}) {
  const { id } =  use(params);
  const post = getBlogPostById(id)

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

  const relatedPosts = blogPosts.filter(item => item.id !== post.id).slice(0, 2)

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
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/insights">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Insights
          </Link>
        </Button>

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

            <Card className="mt-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.map(related => (
                    <Link
                      key={related.id}
                      href={`/insights/${related.id}`}
                      className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-foreground hover:text-primary">
                        {related.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {related.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  )
}
