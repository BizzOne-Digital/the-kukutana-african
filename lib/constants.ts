export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Booking", href: "/booking" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
];

export const FOOTER_LINKS = NAV_LINKS;

export const GROUP_TYPES = [
  "School",
  "Church",
  "Corporate",
  "Fraternity / Sorority",
  "Tour Group",
  "Nonprofit / Civil Organization",
  "Family / Private Group",
  "Other",
] as const;

export const COLLECTION_CATEGORIES = [
  "African Heritage",
  "Civil Rights",
  "Culture",
  "Icons",
  "Military History",
  "Education",
  "General",
] as const;

export const BOOKING_STATUSES = ["new", "contacted", "confirmed", "completed", "cancelled"] as const;
