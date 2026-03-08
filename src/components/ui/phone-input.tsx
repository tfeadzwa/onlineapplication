import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const COUNTRY_CODES = [
  { code: "+263", country: "ZW", flag: "🇿🇼", name: "Zimbabwe" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+258", country: "MZ", flag: "🇲🇿", name: "Mozambique" },
  { code: "+260", country: "ZM", flag: "🇿🇲", name: "Zambia" },
  { code: "+267", country: "BW", flag: "🇧🇼", name: "Botswana" },
  { code: "+265", country: "MW", flag: "🇲🇼", name: "Malawi" },
  { code: "+255", country: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "+256", country: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "+233", country: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  defaultCountryCode?: string;
}

const PhoneInput = ({
  value,
  onChange,
  placeholder = "Phone number",
  required = false,
  defaultCountryCode = "+263",
}: PhoneInputProps) => {
  const [open, setOpen] = useState(false);

  // Parse value into code + number
  const parsed = useMemo(() => {
    if (!value) return { code: defaultCountryCode, number: "" };
    // Try to match a country code at the start
    const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
    for (const cc of sorted) {
      if (value.startsWith(cc.code)) {
        return { code: cc.code, number: value.slice(cc.code.length).trim() };
      }
    }
    return { code: defaultCountryCode, number: value };
  }, [value, defaultCountryCode]);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === parsed.code) || COUNTRY_CODES[0];

  const handleCodeChange = (newCode: string) => {
    onChange(newCode + (parsed.number ? " " + parsed.number : ""));
    setOpen(false);
  };

  const handleNumberChange = (num: string) => {
    // Strip leading zeros/spaces for cleanliness
    const cleaned = num.replace(/^\s+/, "");
    onChange(parsed.code + (cleaned ? " " + cleaned : ""));
  };

  return (
    <div className="flex gap-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="shrink-0 rounded-r-none border-r-0 px-2.5 font-normal min-w-[90px] justify-between"
            type="button"
          >
            <span className="flex items-center gap-1.5 text-sm">
              <span>{selectedCountry.flag}</span>
              <span className="text-muted-foreground">{selectedCountry.code}</span>
            </span>
            <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {COUNTRY_CODES.map((cc) => (
                  <CommandItem
                    key={cc.country}
                    value={`${cc.name} ${cc.code}`}
                    onSelect={() => handleCodeChange(cc.code)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        parsed.code === cc.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="mr-2">{cc.flag}</span>
                    <span className="flex-1 truncate">{cc.name}</span>
                    <span className="text-muted-foreground text-xs ml-auto">{cc.code}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Input
        type="tel"
        value={parsed.number}
        onChange={(e) => handleNumberChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="rounded-l-none"
      />
    </div>
  );
};

export default PhoneInput;
