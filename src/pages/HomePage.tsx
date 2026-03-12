import * as React from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "../app/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../app/components/ui/card"
import { Badge } from "../app/components/ui/badge"
import { ThemeToggle } from "../app/components/theme-toggle"
import { 
  ArrowRight, 
  Shield, 
  Zap,
  CheckCircle,
  Sparkles,
  Activity,
  FileText,
  Users,
  Brain,
  Stethoscope,
  User,
  Calendar,
} from "lucide-react"
import { ICON_STROKE_WIDTH } from "../lib/constants"
import { useAuth } from "../lib/auth-context"

const features = [
  {
    title: "DICOM Viewer",
    description: "Advanced medical image viewing with MPR, 3D reconstruction, and measurement tools",
    icon: Activity,
  },
  {
    title: "Study Management",
    description: "Efficient worklist management with priority queuing and smart routing",
    icon: FileText,
  },
  {
    title: "Reporting System",
    description: "Structured reporting with templates, voice dictation, and peer review",
    icon: Brain,
  },
  {
    title: "PACS Integration",
    description: "Seamless integration with existing PACS and RIS systems",
    icon: Zap,
  },
]

const benefits = [
  "HL7 & DICOM compliant",
  "Cloud-based or on-premise deployment",
  "Multi-modality support (CT, MRI, X-Ray, US)",
  "AI-powered diagnostic assistance",
  "Mobile access for on-call radiologists",
  "HIPAA compliant security",
]

// Role quick access links
const roleAccess = [
  {
    role: "Radiologist",
    description: "View analytics and access reporting worklist",
    icon: Stethoscope,
    href: "/dashboard/radiologist",
    color: "bg-blue-500",
  },
  {
    role: "Senior Radiologist",
    description: "Review and authorize reports from junior radiologists",
    icon: Activity,
    href: "/senior-radiologist/worklist",
    color: "bg-indigo-500",
  },
  {
    role: "Admin",
    description: "Monitor facility metrics and manage operations",
    icon: Shield,
    href: "/dashboard/admin",
    color: "bg-purple-500",
  },
  {
    role: "Technician",
    description: "Track cases and manage imaging studies",
    icon: Users,
    href: "/dashboard/technician",
    color: "bg-green-500",
  },
  {
    role: "Referring Physician",
    description: "View and download radiology reports",
    icon: FileText,
    href: "/physician/reports",
    color: "bg-teal-500",
  },
]

export function HomePage() {
  const navigate = useNavigate()
  const { isAuthenticated, userRole } = useAuth()

  // Redirect authenticated users to their dashboard
  React.useEffect(() => {
    if (isAuthenticated && userRole) {
      const roleHomePaths: Record<string, string> = {
        radiologist: "/dashboard/radiologist",
        senior_radiologist: "/senior-radiologist/worklist",
        admin: "/dashboard/admin",
        technician: "/dashboard/technician",
        physician: "/physician/reports",
      }
      navigate(roleHomePaths[userRole], { replace: true })
    }
  }, [isAuthenticated, userRole, navigate])

  // Show landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Activity strokeWidth={ICON_STROKE_WIDTH} className="size-4" />
            </div>
            <span className="text-lg font-semibold">RadiologyIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <Badge variant="secondary" className="px-4 py-1.5">
            <Brain strokeWidth={ICON_STROKE_WIDTH} className="mr-1.5 h-3 w-3" />
            Next-Generation Radiology Platform
          </Badge>
          
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Advanced Radiology
            <br />
            <span className="text-primary">Information System</span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Streamline your radiology workflow with our comprehensive platform featuring advanced 
            DICOM viewing, AI-assisted diagnosis, and seamless PACS integration.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                Start 
                <ArrowRight strokeWidth={ICON_STROKE_WIDTH} className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Role-Based Access Section - NEW */}
      <section className="container mx-auto px-6 py-20 bg-muted/50">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="outline" className="px-4 py-1.5">
              <Shield strokeWidth={ICON_STROKE_WIDTH} className="mr-1.5 h-3 w-3" />
              Role-Based Access Control
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight">
              Choose Your Role
            </h2>
            <p className="text-lg text-muted-foreground">
              Quick access to role-specific workflows and features
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {roleAccess.map((item) => {
              const Icon = item.icon
              return (
                <Card 
                  key={item.role} 
                  className="relative overflow-hidden border-2 hover:border-primary/50 transition-all cursor-pointer group"
                  onClick={() => navigate(item.href)}
                >
                  <CardHeader className="space-y-3">
                    <div className={`inline-flex rounded-lg ${item.color} p-3 w-fit`}>
                      <Icon strokeWidth={ICON_STROKE_WIDTH} className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {item.role}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </CardContent>
                  <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5 text-primary" />
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Complete Radiology Solution
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for modern radiology practice
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                      <Icon strokeWidth={ICON_STROKE_WIDTH} className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Card className="border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Why Choose RadiologyIQ?</CardTitle>
              <CardDescription>
                Industry-leading features and compliance standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle strokeWidth={ICON_STROKE_WIDTH} className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Transform Your Radiology Practice?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join leading healthcare institutions using RadiologyIQ for efficient, accurate diagnostic imaging.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/signup">
                Start Free Trial
                <ArrowRight strokeWidth={ICON_STROKE_WIDTH} className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Activity strokeWidth={ICON_STROKE_WIDTH} className="size-3" />
              </div>
              <span className="text-sm font-medium">RadiologyIQ</span>
            </div>
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} RadiologyIQ. All rights reserved. HIPAA Compliant.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage