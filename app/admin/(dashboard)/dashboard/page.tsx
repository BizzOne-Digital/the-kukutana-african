import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Collection from "@/models/Collection";
import Booking from "@/models/Booking";
import Testimonial from "@/models/Testimonial";
import StoredUpload from "@/models/StoredUpload";
import ContactSubmission from "@/models/ContactSubmission";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectToDatabase();
  const [collections, bookings, testimonials, media, unreadMessages, recentBookings, recentMessages] =
    await Promise.all([
      Collection.countDocuments(),
      Booking.countDocuments(),
      Testimonial.countDocuments(),
      StoredUpload.countDocuments(),
      ContactSubmission.countDocuments({ read: false }),
      Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
      ContactSubmission.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  return {
    collections,
    bookings,
    testimonials,
    media,
    unreadMessages,
    recentBookings: JSON.parse(JSON.stringify(recentBookings)),
    recentMessages: JSON.parse(JSON.stringify(recentMessages)),
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Collections", value: stats.collections, href: "/admin/services" },
    { label: "Bookings", value: stats.bookings, href: "/admin/bookings" },
    { label: "Testimonials", value: stats.testimonials, href: "/admin/testimonials" },
    { label: "Media Files", value: stats.media, href: "/admin/media" },
    { label: "Unread Messages", value: stats.unreadMessages, href: "/admin/messages" },
  ];

  return (
    <div>
      <h1 className="font-serif-heading text-ivory text-3xl mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-gold/20 rounded-sm p-6 hover:border-gold/50 transition-colors bg-background-brown/30"
          >
            <p className="text-3xl font-serif-heading text-gold-light">{c.value}</p>
            <p className="mt-2 text-xs uppercase tracking-wider text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="border border-gold/20 rounded-sm bg-background-brown/30">
          <div className="px-6 py-4 border-b border-gold/15 flex items-center justify-between">
            <h2 className="text-cream font-medium">Recent Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-gold-light">View all</Link>
          </div>
          <ul className="divide-y divide-gold/10">
            {stats.recentBookings.length === 0 && (
              <li className="px-6 py-6 text-sm text-muted">No bookings yet.</li>
            )}
            {stats.recentBookings.map((b: { _id: string; fullName: string; groupType: string; status: string }) => (
              <li key={b._id} className="px-6 py-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-cream">{b.fullName}</p>
                  <p className="text-xs text-muted">{b.groupType}</p>
                </div>
                <span className="text-xs uppercase tracking-wider text-gold-light">{b.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-gold/20 rounded-sm bg-background-brown/30">
          <div className="px-6 py-4 border-b border-gold/15 flex items-center justify-between">
            <h2 className="text-cream font-medium">Recent Messages</h2>
            <Link href="/admin/messages" className="text-xs text-gold-light">View all</Link>
          </div>
          <ul className="divide-y divide-gold/10">
            {stats.recentMessages.length === 0 && (
              <li className="px-6 py-6 text-sm text-muted">No messages yet.</li>
            )}
            {stats.recentMessages.map((m: { _id: string; name: string; subject: string; read: boolean }) => (
              <li key={m._id} className="px-6 py-4 flex items-center justify-between text-sm">
                <div>
                  <p className="text-cream">{m.name}</p>
                  <p className="text-xs text-muted">{m.subject || "No subject"}</p>
                </div>
                {!m.read && <span className="text-xs uppercase tracking-wider text-gold">New</span>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
