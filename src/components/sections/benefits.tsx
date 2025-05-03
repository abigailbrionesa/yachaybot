import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
interface BenefitsProps {
  icon: string;
  title: string;
  description: string;
}

export const BenefitsSection = () => {
  const t = useTranslations("BenefitsSection");
  const benefits = t.raw("benefits") as BenefitsProps[];

  return (
    <section id="benefits" className="container py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 place-items-center lg:gap-24">
        <div>
          <h2 className="text-lg text-primary mb-2 tracking-wider">
            {t("subtitle")}
          </h2>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("title")}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t("description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 w-full">
          {benefits.map(({ title, description }, index) => (
            <Card
              key={title}
              className="bg-muted/50 dark:bg-card hover:bg-background transition-all delay-75 group/number"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <span className="text-5xl text-primary font-medium transition-all delay-75 group-hover/number:text-muted-foreground/30">
                    0{index + 1}
                  </span>
                </div>

                <CardTitle>{title}</CardTitle>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};