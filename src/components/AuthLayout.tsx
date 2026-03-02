import { GraduationCap } from "lucide-react";

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-heading font-bold text-primary-foreground">Great Zimbabwe</h1>
              <p className="text-sm text-primary-foreground/70">University</p>
            </div>
          </div>
        </div>
        <div className="relative z-10 space-y-4">
          <h2 className="text-3xl font-heading font-bold text-primary-foreground leading-tight">
            Your journey to<br />academic excellence<br />starts here.
          </h2>
          <p className="text-primary-foreground/70 max-w-sm">
            Apply online for admission to Great Zimbabwe University. Complete your application in minutes.
          </p>
        </div>
        <div className="relative z-10">
          <p className="text-primary-foreground/50 text-sm">© {new Date().getFullYear()} Great Zimbabwe University</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg">Great Zimbabwe University</span>
          </div>
          <h2 className="text-2xl font-heading font-bold mb-1">{title}</h2>
          <p className="text-muted-foreground mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
