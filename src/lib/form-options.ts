import type { SearchableSelectOption } from "@/components/ui/searchable-select";

export const ZW_PROVINCES: SearchableSelectOption[] = [
  "Bulawayo", "Harare", "Manicaland", "Mashonaland Central", "Mashonaland East",
  "Mashonaland West", "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands",
].map((p) => ({ label: p, value: p.toLowerCase().replace(/\s+/g, "_") }));

export const ZW_CITIES: SearchableSelectOption[] = [
  "Beitbridge", "Bindura", "Bulawayo", "Chinhoyi", "Chipinge", "Chiredzi", "Chitungwiza",
  "Epworth", "Gwanda", "Gweru", "Harare", "Hwange", "Kadoma", "Kariba", "Karoi",
  "Kwekwe", "Lupane", "Marondera", "Masvingo", "Mutare", "Mutoko", "Norton", "Nyanga",
  "Plumtree", "Redcliff", "Rusape", "Ruwa", "Shurugwi", "Victoria Falls", "Zvishavane",
].map((c) => ({ label: c, value: c.toLowerCase().replace(/\s+/g, "_") }));

export const GENDERS: SearchableSelectOption[] = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export const MARITAL_STATUSES: SearchableSelectOption[] = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
];

export const O_LEVEL_SUBJECTS: SearchableSelectOption[] = [
  "Mathematics", "English Language", "Shona", "Ndebele", "Science", "Combined Science",
  "Physics", "Chemistry", "Biology", "Geography", "History", "Commerce", "Accounts",
  "Economics", "Computer Science", "Agriculture", "Food and Nutrition", "Fashion and Fabrics",
  "Woodwork", "Metalwork", "Technical Graphics", "Music", "Art", "Physical Education",
  "French", "Portuguese", "Literature in English", "Integrated Science", "Business Studies",
  "Religious Studies", "Sociology", "Statistics",
].map((s) => ({ label: s, value: s.toLowerCase().replace(/\s+/g, "_") }));

export const A_LEVEL_SUBJECTS: SearchableSelectOption[] = [
  "Mathematics", "Further Mathematics", "Physics", "Chemistry", "Biology",
  "English Literature", "History", "Geography", "Economics", "Accounting",
  "Business Studies", "Computer Science", "Sociology", "Divinity", "Law",
  "Art", "Music", "French", "Portuguese", "Management of Business",
  "Pure Mathematics", "Statistics", "Agricultural Science",
].map((s) => ({ label: s, value: s.toLowerCase().replace(/\s+/g, "_") }));

export const GRADES: SearchableSelectOption[] = [
  "A*", "A", "B", "C", "D", "E", "U",
].map((g) => ({ label: g, value: g.toLowerCase().replace(/[^a-z]/g, "_") }));

export const EXAM_BOARDS: SearchableSelectOption[] = [
  "ZIMSEC", "Cambridge (CIE)", "Edexcel", "AQA", "OCR", "IB",
].map((b) => ({ label: b, value: b.toLowerCase().replace(/[^a-z]/g, "_") }));

export const FACULTIES: SearchableSelectOption[] = [
  "Faculty of Arts and Humanities",
  "Faculty of Commerce",
  "Faculty of Education",
  "Faculty of Law",
  "Faculty of Natural Sciences",
  "Faculty of Social Sciences",
  "Faculty of Agriculture and Environmental Sciences",
].map((f) => ({ label: f, value: f }));

const _programmes: Record<string, string[]> = {
  "Faculty of Arts and Humanities": ["BA English", "BA History", "BA Linguistics", "BA Religious Studies"],
  "Faculty of Commerce": ["B.Com Accounting", "B.Com Marketing", "B.Com Finance", "B.Com Business Management"],
  "Faculty of Education": ["B.Ed Primary", "B.Ed Secondary", "B.Ed Early Childhood"],
  "Faculty of Law": ["LLB Honours"],
  "Faculty of Natural Sciences": ["BSc Mathematics", "BSc Computer Science", "BSc Biology", "BSc Chemistry", "BSc Physics"],
  "Faculty of Social Sciences": ["BSc Psychology", "BSc Sociology", "BSc Economics", "BSc Political Science"],
  "Faculty of Agriculture and Environmental Sciences": ["BSc Agriculture", "BSc Environmental Science", "BSc Geography"],
};

export const PROGRAMMES: Record<string, SearchableSelectOption[]> = Object.fromEntries(
  Object.entries(_programmes).map(([key, vals]) => [
    key,
    vals.map((p) => ({ label: p, value: p })),
  ])
);

export const QUALIFICATIONS: SearchableSelectOption[] = [
  "National Diploma", "Higher National Diploma", "National Certificate",
  "Bachelor's Degree", "Honours Degree", "Master's Degree", "Doctorate",
  "Postgraduate Diploma", "Professional Certificate", "Trade Certificate",
].map((q) => ({ label: q, value: q.toLowerCase().replace(/[^a-z]/g, "_") }));

export const INSTITUTIONS: SearchableSelectOption[] = [
  "University of Zimbabwe", "Great Zimbabwe University", "Midlands State University",
  "National University of Science and Technology", "Chinhoyi University of Technology",
  "Bindura University of Science Education", "Lupane State University",
  "Zimbabwe Open University", "Harare Institute of Technology",
  "Harare Polytechnic", "Bulawayo Polytechnic", "Kwekwe Polytechnic",
  "Mutare Polytechnic", "Masvingo Polytechnic",
].map((i) => ({ label: i, value: i.toLowerCase().replace(/\s+/g, "_") }));

export const RELATIONSHIPS: SearchableSelectOption[] = [
  "Parent", "Sibling", "Spouse", "Guardian", "Uncle", "Aunt", "Grandparent", "Friend", "Other",
].map((r) => ({ label: r, value: r.toLowerCase() }));
