import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
enum ProService {
  YES = 1,
  NO = 0,
}
interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}

export const ServicesSection = () => {
  const t = useTranslations("ServicesSection");
  
  const serviceList: ServiceProps[] = [
    {
      title: t("services.multilingualAccess.title"),
      description: t("services.multilingualAccess.description"),
      pro: ProService.NO,
    },
    {
      title: t("services.interculturalEducation.title"),
      description: t("services.interculturalEducation.description"),
      pro: ProService.NO,
    },
    {
      title: t("services.ethicalPreservation.title"),
      description: t("services.ethicalPreservation.description"),
      pro: ProService.YES,
    },
    {
      title: t("services.generationalConnection.title"),
      description: t("services.generationalConnection.description"),
      pro: ProService.YES,
    },
  ];

  return (
    <section id="services" className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t("impactTitle")}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t("mainTitle")}
      </h2>
      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
        {t("subtitle")}
      </h3>

      <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
        {serviceList.map(({ title, description, pro }) => (
          <Card
            key={title}
            className="bg-muted/60 dark:bg-card h-full relative"
          >
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <Badge
              data-pro={ProService.YES === pro}
              variant="secondary"
              className="absolute -top-2 -right-3 data-[pro=false]:hidden"
            >
              {t("innovationBadge")}
            </Badge>
          </Card>
        ))}
      </div>
    </section>
  );
};
