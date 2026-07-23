import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, ImageIcon, Newspaper } from "lucide-react";
import Link from "next/link";

export default function MultimediaOverview() {
  const cards = [
    {
      title: "Theme",
      description: "Manage site theme and colors.",
      icon: Palette,
      href: "/multimedia/theme",
      color: "text-blue-500",
    },
    {
      title: "Banner",
      description: "Update the homepage banner image and text.",
      icon: ImageIcon,
      href: "/multimedia/banner",
      color: "text-purple-500",
    },
    {
      title: "News",
      description: "Add, edit, or delete news articles.",
      icon: Newspaper,
      href: "/multimedia/news",
      color: "text-green-500",
    },
    {
      title: "Gallery",
      description: "Manage gallery images and descriptions.",
      icon: ImageIcon,
      href: "/multimedia/gallery",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Manage your site's multimedia content, theme settings, and announcements from here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="block transition-transform hover:scale-105">
              <Card className="h-full border-border/50 glass hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <CardDescription>{card.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
