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
  { code: "+93", country: "AF", flag: "🇦🇫", name: "Afghanistan" },
  { code: "+355", country: "AL", flag: "🇦🇱", name: "Albania" },
  { code: "+213", country: "DZ", flag: "🇩🇿", name: "Algeria" },
  { code: "+376", country: "AD", flag: "🇦🇩", name: "Andorra" },
  { code: "+244", country: "AO", flag: "🇦🇴", name: "Angola" },
  { code: "+1268", country: "AG", flag: "🇦🇬", name: "Antigua and Barbuda" },
  { code: "+54", country: "AR", flag: "🇦🇷", name: "Argentina" },
  { code: "+374", country: "AM", flag: "🇦🇲", name: "Armenia" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+43", country: "AT", flag: "🇦🇹", name: "Austria" },
  { code: "+994", country: "AZ", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+1242", country: "BS", flag: "🇧🇸", name: "Bahamas" },
  { code: "+973", country: "BH", flag: "🇧🇭", name: "Bahrain" },
  { code: "+880", country: "BD", flag: "🇧🇩", name: "Bangladesh" },
  { code: "+1246", country: "BB", flag: "🇧🇧", name: "Barbados" },
  { code: "+375", country: "BY", flag: "🇧🇾", name: "Belarus" },
  { code: "+32", country: "BE", flag: "🇧🇪", name: "Belgium" },
  { code: "+501", country: "BZ", flag: "🇧🇿", name: "Belize" },
  { code: "+229", country: "BJ", flag: "🇧🇯", name: "Benin" },
  { code: "+975", country: "BT", flag: "🇧🇹", name: "Bhutan" },
  { code: "+591", country: "BO", flag: "🇧🇴", name: "Bolivia" },
  { code: "+387", country: "BA", flag: "🇧🇦", name: "Bosnia and Herzegovina" },
  { code: "+267", country: "BW", flag: "🇧🇼", name: "Botswana" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+673", country: "BN", flag: "🇧🇳", name: "Brunei" },
  { code: "+359", country: "BG", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+226", country: "BF", flag: "🇧🇫", name: "Burkina Faso" },
  { code: "+257", country: "BI", flag: "🇧🇮", name: "Burundi" },
  { code: "+238", country: "CV", flag: "🇨🇻", name: "Cabo Verde" },
  { code: "+855", country: "KH", flag: "🇰🇭", name: "Cambodia" },
  { code: "+237", country: "CM", flag: "🇨🇲", name: "Cameroon" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+236", country: "CF", flag: "🇨🇫", name: "Central African Republic" },
  { code: "+235", country: "TD", flag: "🇹🇩", name: "Chad" },
  { code: "+56", country: "CL", flag: "🇨🇱", name: "Chile" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+57", country: "CO", flag: "🇨🇴", name: "Colombia" },
  { code: "+269", country: "KM", flag: "🇰🇲", name: "Comoros" },
  { code: "+242", country: "CG", flag: "🇨🇬", name: "Congo (Brazzaville)" },
  { code: "+243", country: "CD", flag: "🇨🇩", name: "Congo (DRC)" },
  { code: "+506", country: "CR", flag: "🇨🇷", name: "Costa Rica" },
  { code: "+385", country: "HR", flag: "🇭🇷", name: "Croatia" },
  { code: "+53", country: "CU", flag: "🇨🇺", name: "Cuba" },
  { code: "+357", country: "CY", flag: "🇨🇾", name: "Cyprus" },
  { code: "+420", country: "CZ", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+45", country: "DK", flag: "🇩🇰", name: "Denmark" },
  { code: "+253", country: "DJ", flag: "🇩🇯", name: "Djibouti" },
  { code: "+1767", country: "DM", flag: "🇩🇲", name: "Dominica" },
  { code: "+1809", country: "DO", flag: "🇩🇴", name: "Dominican Republic" },
  { code: "+593", country: "EC", flag: "🇪🇨", name: "Ecuador" },
  { code: "+20", country: "EG", flag: "🇪🇬", name: "Egypt" },
  { code: "+503", country: "SV", flag: "🇸🇻", name: "El Salvador" },
  { code: "+240", country: "GQ", flag: "🇬🇶", name: "Equatorial Guinea" },
  { code: "+291", country: "ER", flag: "🇪🇷", name: "Eritrea" },
  { code: "+372", country: "EE", flag: "🇪🇪", name: "Estonia" },
  { code: "+268", country: "SZ", flag: "🇸🇿", name: "Eswatini" },
  { code: "+251", country: "ET", flag: "🇪🇹", name: "Ethiopia" },
  { code: "+679", country: "FJ", flag: "🇫🇯", name: "Fiji" },
  { code: "+358", country: "FI", flag: "🇫🇮", name: "Finland" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+241", country: "GA", flag: "🇬🇦", name: "Gabon" },
  { code: "+220", country: "GM", flag: "🇬🇲", name: "Gambia" },
  { code: "+995", country: "GE", flag: "🇬🇪", name: "Georgia" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+233", country: "GH", flag: "🇬🇭", name: "Ghana" },
  { code: "+30", country: "GR", flag: "🇬🇷", name: "Greece" },
  { code: "+1473", country: "GD", flag: "🇬🇩", name: "Grenada" },
  { code: "+502", country: "GT", flag: "🇬🇹", name: "Guatemala" },
  { code: "+224", country: "GN", flag: "🇬🇳", name: "Guinea" },
  { code: "+245", country: "GW", flag: "🇬🇼", name: "Guinea-Bissau" },
  { code: "+592", country: "GY", flag: "🇬🇾", name: "Guyana" },
  { code: "+509", country: "HT", flag: "🇭🇹", name: "Haiti" },
  { code: "+504", country: "HN", flag: "🇭🇳", name: "Honduras" },
  { code: "+36", country: "HU", flag: "🇭🇺", name: "Hungary" },
  { code: "+354", country: "IS", flag: "🇮🇸", name: "Iceland" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+62", country: "ID", flag: "🇮🇩", name: "Indonesia" },
  { code: "+98", country: "IR", flag: "🇮🇷", name: "Iran" },
  { code: "+964", country: "IQ", flag: "🇮🇶", name: "Iraq" },
  { code: "+353", country: "IE", flag: "🇮🇪", name: "Ireland" },
  { code: "+972", country: "IL", flag: "🇮🇱", name: "Israel" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+225", country: "CI", flag: "🇨🇮", name: "Ivory Coast" },
  { code: "+1876", country: "JM", flag: "🇯🇲", name: "Jamaica" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+962", country: "JO", flag: "🇯🇴", name: "Jordan" },
  { code: "+7", country: "KZ", flag: "🇰🇿", name: "Kazakhstan" },
  { code: "+254", country: "KE", flag: "🇰🇪", name: "Kenya" },
  { code: "+686", country: "KI", flag: "🇰🇮", name: "Kiribati" },
  { code: "+965", country: "KW", flag: "🇰🇼", name: "Kuwait" },
  { code: "+996", country: "KG", flag: "🇰🇬", name: "Kyrgyzstan" },
  { code: "+856", country: "LA", flag: "🇱🇦", name: "Laos" },
  { code: "+371", country: "LV", flag: "🇱🇻", name: "Latvia" },
  { code: "+961", country: "LB", flag: "🇱🇧", name: "Lebanon" },
  { code: "+266", country: "LS", flag: "🇱🇸", name: "Lesotho" },
  { code: "+231", country: "LR", flag: "🇱🇷", name: "Liberia" },
  { code: "+218", country: "LY", flag: "🇱🇾", name: "Libya" },
  { code: "+423", country: "LI", flag: "🇱🇮", name: "Liechtenstein" },
  { code: "+370", country: "LT", flag: "🇱🇹", name: "Lithuania" },
  { code: "+352", country: "LU", flag: "🇱🇺", name: "Luxembourg" },
  { code: "+261", country: "MG", flag: "🇲🇬", name: "Madagascar" },
  { code: "+265", country: "MW", flag: "🇲🇼", name: "Malawi" },
  { code: "+60", country: "MY", flag: "🇲🇾", name: "Malaysia" },
  { code: "+960", country: "MV", flag: "🇲🇻", name: "Maldives" },
  { code: "+223", country: "ML", flag: "🇲🇱", name: "Mali" },
  { code: "+356", country: "MT", flag: "🇲🇹", name: "Malta" },
  { code: "+692", country: "MH", flag: "🇲🇭", name: "Marshall Islands" },
  { code: "+222", country: "MR", flag: "🇲🇷", name: "Mauritania" },
  { code: "+230", country: "MU", flag: "🇲🇺", name: "Mauritius" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+691", country: "FM", flag: "🇫🇲", name: "Micronesia" },
  { code: "+373", country: "MD", flag: "🇲🇩", name: "Moldova" },
  { code: "+377", country: "MC", flag: "🇲🇨", name: "Monaco" },
  { code: "+976", country: "MN", flag: "🇲🇳", name: "Mongolia" },
  { code: "+382", country: "ME", flag: "🇲🇪", name: "Montenegro" },
  { code: "+212", country: "MA", flag: "🇲🇦", name: "Morocco" },
  { code: "+258", country: "MZ", flag: "🇲🇿", name: "Mozambique" },
  { code: "+95", country: "MM", flag: "🇲🇲", name: "Myanmar" },
  { code: "+264", country: "NA", flag: "🇳🇦", name: "Namibia" },
  { code: "+674", country: "NR", flag: "🇳🇷", name: "Nauru" },
  { code: "+977", country: "NP", flag: "🇳🇵", name: "Nepal" },
  { code: "+31", country: "NL", flag: "🇳🇱", name: "Netherlands" },
  { code: "+64", country: "NZ", flag: "🇳🇿", name: "New Zealand" },
  { code: "+505", country: "NI", flag: "🇳🇮", name: "Nicaragua" },
  { code: "+227", country: "NE", flag: "🇳🇪", name: "Niger" },
  { code: "+234", country: "NG", flag: "🇳🇬", name: "Nigeria" },
  { code: "+850", country: "KP", flag: "🇰🇵", name: "North Korea" },
  { code: "+389", country: "MK", flag: "🇲🇰", name: "North Macedonia" },
  { code: "+47", country: "NO", flag: "🇳🇴", name: "Norway" },
  { code: "+968", country: "OM", flag: "🇴🇲", name: "Oman" },
  { code: "+92", country: "PK", flag: "🇵🇰", name: "Pakistan" },
  { code: "+680", country: "PW", flag: "🇵🇼", name: "Palau" },
  { code: "+970", country: "PS", flag: "🇵🇸", name: "Palestine" },
  { code: "+507", country: "PA", flag: "🇵🇦", name: "Panama" },
  { code: "+675", country: "PG", flag: "🇵🇬", name: "Papua New Guinea" },
  { code: "+595", country: "PY", flag: "🇵🇾", name: "Paraguay" },
  { code: "+51", country: "PE", flag: "🇵🇪", name: "Peru" },
  { code: "+63", country: "PH", flag: "🇵🇭", name: "Philippines" },
  { code: "+48", country: "PL", flag: "🇵🇱", name: "Poland" },
  { code: "+351", country: "PT", flag: "🇵🇹", name: "Portugal" },
  { code: "+974", country: "QA", flag: "🇶🇦", name: "Qatar" },
  { code: "+40", country: "RO", flag: "🇷🇴", name: "Romania" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
  { code: "+250", country: "RW", flag: "🇷🇼", name: "Rwanda" },
  { code: "+1869", country: "KN", flag: "🇰🇳", name: "Saint Kitts and Nevis" },
  { code: "+1758", country: "LC", flag: "🇱🇨", name: "Saint Lucia" },
  { code: "+1784", country: "VC", flag: "🇻🇨", name: "Saint Vincent and the Grenadines" },
  { code: "+685", country: "WS", flag: "🇼🇸", name: "Samoa" },
  { code: "+378", country: "SM", flag: "🇸🇲", name: "San Marino" },
  { code: "+239", country: "ST", flag: "🇸🇹", name: "Sao Tome and Principe" },
  { code: "+966", country: "SA", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+221", country: "SN", flag: "🇸🇳", name: "Senegal" },
  { code: "+381", country: "RS", flag: "🇷🇸", name: "Serbia" },
  { code: "+248", country: "SC", flag: "🇸🇨", name: "Seychelles" },
  { code: "+232", country: "SL", flag: "🇸🇱", name: "Sierra Leone" },
  { code: "+65", country: "SG", flag: "🇸🇬", name: "Singapore" },
  { code: "+421", country: "SK", flag: "🇸🇰", name: "Slovakia" },
  { code: "+386", country: "SI", flag: "🇸🇮", name: "Slovenia" },
  { code: "+677", country: "SB", flag: "🇸🇧", name: "Solomon Islands" },
  { code: "+252", country: "SO", flag: "🇸🇴", name: "Somalia" },
  { code: "+27", country: "ZA", flag: "🇿🇦", name: "South Africa" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+211", country: "SS", flag: "🇸🇸", name: "South Sudan" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+94", country: "LK", flag: "🇱🇰", name: "Sri Lanka" },
  { code: "+249", country: "SD", flag: "🇸🇩", name: "Sudan" },
  { code: "+597", country: "SR", flag: "🇸🇷", name: "Suriname" },
  { code: "+46", country: "SE", flag: "🇸🇪", name: "Sweden" },
  { code: "+41", country: "CH", flag: "🇨🇭", name: "Switzerland" },
  { code: "+963", country: "SY", flag: "🇸🇾", name: "Syria" },
  { code: "+886", country: "TW", flag: "🇹🇼", name: "Taiwan" },
  { code: "+992", country: "TJ", flag: "🇹🇯", name: "Tajikistan" },
  { code: "+255", country: "TZ", flag: "🇹🇿", name: "Tanzania" },
  { code: "+66", country: "TH", flag: "🇹🇭", name: "Thailand" },
  { code: "+670", country: "TL", flag: "🇹🇱", name: "Timor-Leste" },
  { code: "+228", country: "TG", flag: "🇹🇬", name: "Togo" },
  { code: "+676", country: "TO", flag: "🇹🇴", name: "Tonga" },
  { code: "+1868", country: "TT", flag: "🇹🇹", name: "Trinidad and Tobago" },
  { code: "+216", country: "TN", flag: "🇹🇳", name: "Tunisia" },
  { code: "+90", country: "TR", flag: "🇹🇷", name: "Turkey" },
  { code: "+993", country: "TM", flag: "🇹🇲", name: "Turkmenistan" },
  { code: "+688", country: "TV", flag: "🇹🇻", name: "Tuvalu" },
  { code: "+256", country: "UG", flag: "🇺🇬", name: "Uganda" },
  { code: "+380", country: "UA", flag: "🇺🇦", name: "Ukraine" },
  { code: "+971", country: "AE", flag: "🇦🇪", name: "UAE" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+598", country: "UY", flag: "🇺🇾", name: "Uruguay" },
  { code: "+998", country: "UZ", flag: "🇺🇿", name: "Uzbekistan" },
  { code: "+678", country: "VU", flag: "🇻🇺", name: "Vanuatu" },
  { code: "+379", country: "VA", flag: "🇻🇦", name: "Vatican City" },
  { code: "+58", country: "VE", flag: "🇻🇪", name: "Venezuela" },
  { code: "+84", country: "VN", flag: "🇻🇳", name: "Vietnam" },
  { code: "+967", country: "YE", flag: "🇾🇪", name: "Yemen" },
  { code: "+260", country: "ZM", flag: "🇿🇲", name: "Zambia" },
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
