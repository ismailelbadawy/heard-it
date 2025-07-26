import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, CheckSquare, Lightbulb, Clock, Zap, Users, ArrowRight, MessageSquare, Target, Brain } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Mic className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-xl">HeardIt</span>
          </div>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
            How it Works
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
        </nav>
        <div className="ml-4 flex gap-2">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
          <Button size="sm">Get Started</Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Badge variant="secondary" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                AI-Powered Voice Processing
              </Badge>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Turn Voice Notes Into
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                    {" "}
                    Actionable Tasks
                  </span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Transform your voice recordings into organized tasks, key insights, and actionable items with AI.
                  Never lose track of important ideas again.
                </p>
              </div>
              <div className="w-full max-w-md space-y-2">
                <form className="flex gap-2">
                  <Input type="email" placeholder="Enter your email" className="flex-1" required />
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    Join Waitlist
                  </Button>
                </form>
                <p className="text-xs text-muted-foreground text-center">Be the first to know when HeardIt launches</p>
              </div>
              <div className="pt-8">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width={600}
                  height={400}
                  alt="HeardIt App Interface"
                  className="mx-auto rounded-lg shadow-2xl border"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Everything You Need to Stay Organized
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  HeardIt uses advanced AI to understand your voice and extract meaningful, actionable content
                  automatically.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <CheckSquare className="h-10 w-10 text-purple-600" />
                  <CardTitle>Smart Task Extraction</CardTitle>
                  <CardDescription>
                    Automatically identify and create actionable tasks from your voice notes with due dates and
                    priorities.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Lightbulb className="h-10 w-10 text-pink-600" />
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>
                    Extract important points, decisions, and insights from meetings, brainstorming sessions, and
                    personal notes.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-purple-600" />
                  <CardTitle>Smart Categorization</CardTitle>
                  <CardDescription>
                    Automatically organize your content into relevant categories like work, personal, ideas, and
                    follow-ups.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Clock className="h-10 w-10 text-pink-600" />
                  <CardTitle>Time Tracking</CardTitle>
                  <CardDescription>
                    Track time spent on different topics and get insights into your productivity patterns.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Brain className="h-10 w-10 text-purple-600" />
                  <CardTitle>Context Understanding</CardTitle>
                  <CardDescription>
                    AI understands context and relationships between different voice notes for better organization.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-pink-600" />
                  <CardTitle>Multi-format Export</CardTitle>
                  <CardDescription>
                    Export your processed content to popular tools like Notion, Todoist, or as simple text files.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple. Fast. Effective.</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Get from voice to action in just three simple steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold">Record Your Voice</h3>
                <p className="text-muted-foreground">
                  Simply hit record and speak naturally. Share your thoughts, meeting notes, or brainstorm ideas.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold">AI Processing</h3>
                <p className="text-muted-foreground">
                  Our advanced AI analyzes your voice, understands context, and extracts actionable content.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold">Get Organized Results</h3>
                <p className="text-muted-foreground">
                  Receive structured tasks, key points, and insights ready to be acted upon or exported.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Perfect For Every Scenario</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Whether you're in meetings, brainstorming, or capturing personal thoughts, HeardIt adapts to your
                  needs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-purple-600" />
                  <CardTitle>Team Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Record meeting discussions and automatically extract action items, decisions, and follow-ups for
                    each team member.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lightbulb className="h-8 w-8 text-pink-600" />
                  <CardTitle>Brainstorming Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Capture creative ideas and automatically organize them into themes, priorities, and next steps.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Target className="h-8 w-8 text-purple-600" />
                  <CardTitle>Personal Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Voice your daily thoughts and goals, then get them organized into actionable personal tasks and
                    reminders.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <MessageSquare className="h-8 w-8 text-pink-600" />
                  <CardTitle>Client Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Record client conversations and extract key requirements, commitments, and deliverables
                    automatically.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-purple-600 to-pink-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Transform Your Voice Notes?
                </h2>
                <p className="mx-auto max-w-[600px] text-purple-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of productive professionals who never miss an important task again.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button type="submit" variant="secondary">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
                <p className="text-xs text-purple-100">Start your free trial. No credit card required.</p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="flex items-center space-x-1">
                  <CheckSquare className="h-4 w-4" />
                  <span className="text-sm">Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckSquare className="h-4 w-4" />
                  <span className="text-sm">Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-md flex items-center justify-center">
            <Mic className="h-3 w-3 text-white" />
          </div>
          <span className="text-sm font-medium">HeardIt</span>
        </div>
        <p className="text-xs text-muted-foreground sm:ml-4">© 2024 HeardIt. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  )
}