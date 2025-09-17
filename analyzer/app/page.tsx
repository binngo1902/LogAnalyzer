import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Search, Globe, Award, CheckCircle, ArrowRight, FileText, Users, Target } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Professional Log Analysis for{" "}
              <span className="text-primary">SEO Experts</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your log files into actionable insights with AI-powered analysis. 
              Get comprehensive data visualization and automated summaries to optimize your SEO strategy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-white hover:bg-primary/90" asChild>
                <Link href="/analyzer">
                  Start Analyzing <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/insights">View Insights Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                  About LogInsight
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Built specifically for SEO professionals who need to analyze server logs, 
                  track user behavior, and identify optimization opportunities. Our platform 
                  combines advanced data processing with intuitive visualization tools.
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Whether you're analyzing crawl patterns, identifying technical SEO issues, 
                  or tracking performance metrics, LogInsight provides the insights you need 
                  to make data-driven decisions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Log Analysis</Badge>
                  <Badge variant="secondary">SEO Optimization</Badge>
                  <Badge variant="secondary">Data Visualization</Badge>
                  <Badge variant="secondary">AI Insights</Badge>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Advanced Analytics</h3>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Performance Tracking</h3>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Search className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">SEO Insights</h3>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Global Analysis</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Key Features
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to analyze log files and gain actionable SEO insights
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <FileText className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>File Upload & Processing</CardTitle>
                  <CardDescription>
                    Upload .txt log files and process them instantly with our advanced parsing engine
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Data Visualization</CardTitle>
                  <CardDescription>
                    View your data through interactive charts: bar charts, pie charts, and line graphs
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Target className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Smart Filtering</CardTitle>
                  <CardDescription>
                    Filter by time range, exclude specific URLs, or analyze data by country
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <TrendingUp className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>AI-Powered Insights</CardTitle>
                  <CardDescription>
                    Get automated summaries and insights to quickly understand your data patterns
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Search className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>SEO Analysis</CardTitle>
                  <CardDescription>
                    Identify crawl patterns, bot behavior, and technical SEO opportunities
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>User Behavior Tracking</CardTitle>
                  <CardDescription>
                    Understand user journeys and identify high-performing content areas
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Skills */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                SEO Expertise
              </h2>
              <p className="text-xl text-muted-foreground">
                Specialized skills for comprehensive SEO analysis and optimization
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Technical SEO</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Server log analysis and optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Crawl budget optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Site speed and performance analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>URL structure optimization</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Data Analysis</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Traffic pattern identification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Bot and crawler behavior analysis</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Geographic performance insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-primary mr-3" />
                    <span>Content performance metrics</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Trusted by SEO Professionals
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Built with industry best practices and proven methodologies
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Industry Standards</h3>
                <p className="text-muted-foreground text-center">
                  Follows SEO industry best practices and guidelines
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Proven Results</h3>
                <p className="text-muted-foreground text-center">
                  Tested and validated by SEO professionals worldwide
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 rounded-full p-6 mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Global Reach</h3>
                <p className="text-muted-foreground text-center">
                  Supports international SEO analysis and optimization
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Analyze Your Logs?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Start getting actionable insights from your log files today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-50" asChild>
                <Link href="/analyzer">
                  Try Log Analyzer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/insights">Explore Insights</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
