import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
enum PopularPlan {
  NO = 0,
  YES = 1,
}

interface PlanProps {
  title: string;
  popular: PopularPlan;
  price: number;
  description: string;
  buttonText: string;
  benefitList: string[];
}


export const PricingSection = () => {
  const t = useTranslations("PricingSection");

  const plans: PlanProps[] = [
    {
      title: t("plans.Comunidad.title"),
      popular: 0,
      price: 0,
      description: t("plans.Comunidad.description"),
      buttonText: t("plans.Comunidad.buttonText"),
      benefitList: t("plans.Comunidad.benefits").split(",")
    },
    {
      title: t("plans.EducadorEIB.title"),
      popular: 1,
      price: 9,
      description: t("plans.EducadorEIB.description"),
      buttonText: t("plans.EducadorEIB.buttonText"),
      benefitList: t("plans.EducadorEIB.benefits").split(",")
    },
    {
      title: t("plans.AliadoInstitucional.title"),
      popular: 0,
      price: 120,
      description: t("plans.AliadoInstitucional.description"),
      buttonText: t("plans.AliadoInstitucional.buttonText"),
      benefitList: t("plans.AliadoInstitucional.benefits").split(",")
    }
  ];

  return (
    <section className="container py-24 sm:py-32">
      <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
        {t("title")}
      </h2>

      <h2 className="text-3xl md:text-4xl text-center font-bold mb-4">
        {t("heading")}
      </h2>

      <h3 className="md:w-1/2 mx-auto text-xl text-center text-muted-foreground pb-14">
        {t("subheading")}
      </h3>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-4">
        {plans.map(
          ({ title, popular, price, description, buttonText, benefitList }) => (
            <Card
              key={title}
              className={
                popular === PopularPlan?.YES
                  ? "drop-shadow-xl shadow-black/10 dark:shadow-white/10 border-[1.5px] border-primary lg:scale-[1.1]"
                  : ""
              }
            >
              <CardHeader>
                <CardTitle className="pb-2">{title}</CardTitle>

                <CardDescription className="pb-4">
                  {description}
                </CardDescription>

                <div>
                  <span className="text-3xl font-bold">${price}</span>
                  <span className="text-muted-foreground"> {t("priceSuffix")}</span>
                </div>
              </CardHeader>

              <CardContent className="flex">
                <div className="space-y-4">
                  {benefitList.map((benefit) => (
                    <span key={benefit} className="flex">
                      <Check className="text-primary mr-2" />
                      <h3>{benefit}</h3>
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  variant={
                    popular === PopularPlan?.YES ? "default" : "secondary"
                  }
                  className="w-full"
                >
                  {buttonText}
                </Button>
              </CardFooter>
            </Card>
          )
        )}
      </div>
    </section>
  );
};