import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight, FileCheck, Clock, ShieldCheck, BookOpen, Users, Award, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sm leading-tight">Great Zimbabwe</span>
              <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">University</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button size="sm" className="rounded-full px-5 shadow-sm" asChild>
              <Link to="/register">Apply Now</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="absolute inset-0 opacity-[0.07]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        
        <div className="relative container px-4 sm:px-6 py-24 sm:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/15 rounded-full px-4 py-1.5 mb-8 animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-medium text-primary-foreground/90 tracking-wide">Applications Now Open for 2026</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-primary-foreground leading-[1.1] mb-6 animate-fade-in">
              Shape Your
              <span className="block text-accent">Future Here</span>
            </h1>
            <p className="text-base sm:text-lg text-primary-foreground/70 max-w-xl mb-10 leading-relaxed animate-fade-in">
              Join a community of scholars and innovators. Apply online for admission to Great Zimbabwe University — complete your application in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-base px-8 shadow-lg shadow-accent/20 font-semibold" asChild>
                <Link to="/register">
                  Start Your Application <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full text-base px-8 border-primary-foreground/20 text-primary-foreground bg-primary-foreground/5 hover:bg-primary-foreground/10 hover:text-primary-foreground backdrop-blur-sm" asChild>
                <Link to="/login">Continue Application</Link>
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-16 sm:mt-24 max-w-2xl animate-fade-in">
            {[
              { value: "15,000+", label: "Students Enrolled" },
              { value: "120+", label: "Programmes Offered" },
              { value: "95%", label: "Graduate Employment" },
            ].map((stat, i) => (
              <div key={i} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-accent">{stat.value}</div>
                <div className="text-xs sm:text-sm text-primary-foreground/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent">Simple Process</span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-3 mb-4">Apply in Three Steps</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Our streamlined application process makes it easy to begin your academic journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: FileCheck, title: "Create Account", desc: "Register with your email and national ID to get started with your application.", step: "01" },
            { icon: Clock, title: "Complete Application", desc: "Fill in your qualifications, programme choices, and personal details step by step.", step: "02" },
            { icon: ShieldCheck, title: "Submit & Track", desc: "Submit your application, make payment, and track your status from your dashboard.", step: "03" },
          ].map((item, i) => (
            <div key={i} className="group relative p-8 rounded-2xl border border-border/80 bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 animate-fade-in">
              <span className="absolute top-6 right-6 text-5xl font-heading font-bold text-muted/60">{item.step}</span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why GZU */}
      <section className="bg-muted/40 border-y border-border/50">
        <div className="container px-4 sm:px-6 py-20 sm:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-xs font-semibold tracking-widest uppercase text-accent">Why Choose Us</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold mt-3 mb-6">A Legacy of Academic Excellence</h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Great Zimbabwe University is committed to providing quality education that prepares students for the challenges of the modern world. Our diverse range of programmes and experienced faculty ensure you receive the best education.
              </p>
              <Button variant="outline" className="rounded-full group" asChild>
                <Link to="/register">
                  Learn More <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, title: "Quality Education", desc: "Accredited programmes with industry-relevant curricula" },
                { icon: Users, title: "Vibrant Community", desc: "A diverse student body from across the region" },
                { icon: Award, title: "Research Excellence", desc: "Cutting-edge research in multiple disciplines" },
                { icon: GraduationCap, title: "Career Support", desc: "Dedicated career services and alumni networks" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl border border-border/80 bg-card animate-fade-in">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-heading font-semibold text-sm mb-1">{item.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container px-4 sm:px-6 py-20 sm:py-28">
        <div className="relative max-w-4xl mx-auto text-center p-12 sm:p-16 rounded-3xl bg-primary overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--accent)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--accent)) 0%, transparent 50%)`
          }} />
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-primary-foreground mb-4">
              Ready to Begin?
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8">
              Don't miss the opportunity to join one of Zimbabwe's leading universities. Start your application today.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full text-base px-10 shadow-lg shadow-accent/20 font-semibold" asChild>
              <Link to="/register">
                Apply Now <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50">
        <div className="container px-4 sm:px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-heading font-semibold text-sm">Great Zimbabwe University</span>
            </div>
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Great Zimbabwe University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
