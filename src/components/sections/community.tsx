import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
export const CommunitySection = () => {
  const t = useTranslations("CommunitySection");

  return (
    <section id="community" style={{
      backgroundImage: 'url("https://canal21huancayo.com/wp-content/uploads/2023/07/WhatsApp-Image-2023-07-17-at-5.38.07-PM-2-1024x614.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <hr className="border-secondary" />
      <div className="container py-20 sm:py-20">
        <div className="lg:w-[60%] mx-auto">
          <Card className="bg-background border-none shadow-none text-center flex flex-col items-center justify-center">
            <h2>
              {t("titlePart1")}{" "}
              <span className="text-transparent bg-gradient-to-r from-[#31bd46] to-primary bg-clip-text">
                {t("titlePart2")}
              </span>
            </h2>

            <CardContent className="lg:w-[80%] text-xl text-muted-foreground">
              {t("description")}
            </CardContent>

            <CardFooter>
              <Button asChild>
                <a href="https://discord.com/" target="_blank">
                  {t("button")}
                </a>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <hr className="border-secondary" />
    </section>
  );
};
