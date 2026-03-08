import { GraduationCap } from "lucide-react";
import campusHero from "@/assets/campus-hero.jpg";

const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel — campus image with overlay */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0">
          <img src={campusHero} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/70 to-primary/50" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-heading font-bold text-primary-foreground">Great Zimbabwe</h1>
              <p className="text-[10px] text-primary-foreground/60 font-medium tracking-widest uppercase">University</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <h2 className="text-4xl xl:text-5xl font-heading font-bold text-primary-foreground leading-[1.1]">
            Your journey to
            <span className="block text-accent">excellence</span>
            starts here.
          </h2>
          <p className="text-primary-foreground/60 max-w-sm leading-relaxed">
            Apply online for admission to Great Zimbabwe University. Complete your application in minutes from anywhere.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-primary-foreground/40 text-xs">© {new Date().getFullYear()} Great Zimbabwe University. All rights reserved.</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md animate-fade-in">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-sm leading-tight">Great Zimbabwe</span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-widest uppercase">University</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-2">{title}</h2>
              <p className="text-muted-foreground text-sm">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
