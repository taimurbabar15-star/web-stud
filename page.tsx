import { prisma } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeClient from "@/components/HomeClient";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  // Fetch required data for landing page sections
  const [faqs, testimonials, blogPosts] = await Promise.all([
    prisma.fAQ.findMany({
      where: { category: { in: ["General", "Trading", "Photography"] } },
      orderBy: { order: "asc" },
      take: 6,
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HomeClient 
          initialFaqs={faqs} 
          initialTestimonials={testimonials} 
          initialBlogPosts={blogPosts} 
        />
      </main>
      <Footer />
    </div>
  );
}
