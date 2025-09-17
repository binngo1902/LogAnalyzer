import Link from "next/link"
import { BarChart3, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">LogInsight</span>
            </Link>
            <p className="text-muted-foreground mb-4 max-w-md">
              Professional log file analysis tool with AI-powered insights for SEO professionals and data analysts.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/analyzer" className="text-muted-foreground hover:text-primary">
                  Log Analyzer
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-primary">
                  Insights Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-primary">
                  SEO Guides
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-primary">
                  Industry News
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-muted-foreground hover:text-primary">
                  Trends
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 LogInsight. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
