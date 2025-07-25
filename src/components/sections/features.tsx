import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Laptop, BadgeCheck, Goal, PictureInPicture, MousePointerClick, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
interface FeaturesProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const FeaturesSection = () => {
  const t = useTranslations("FeaturesSection");
  
  const featureList: FeaturesProps[] = [
    {
      icon: Laptop,
      title: t("features.offline.title"),
      description: t("features.offline.description")
    },
    {
      icon: BadgeCheck,
      title: t("features.validated.title"),
      description: t("features.validated.description")
    },
    {
      icon: Goal,
      title: t("features.multilingual.title"),
      description: t("features.multilingual.description")
    },
    {
      icon: PictureInPicture,
      title: t("features.interface.title"),
      description: t("features.interface.description")
    },
    {
      icon: MousePointerClick,
      title: t("features.impact.title"),
      description: t("features.impact.description")
    },
    {
      icon: Newspaper,
      title: t("features.alliance.title"),
      description: t("features.alliance.description")
    }
  ];

  return (
    <section id="features" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t("subtitle")}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t("title")}
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        {t("description")}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featureList.map(({ icon: IconComponent, title, description }) => (
          <div key={title}>
            <Card className="h-full bg-background border-0 shadow-none">
              <CardHeader className="flex flex-col justify-center items-center">
                <div className="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
                  <IconComponent size={24} />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground text-center">
                {description}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};
