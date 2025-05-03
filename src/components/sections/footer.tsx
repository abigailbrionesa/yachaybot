import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

const footerLinks = [
  {
    titleKey: "contact",
    links: ["email", "whatsapp", "press"],
  },
  {
    titleKey: "allies",
    links: ["eibSchools", "ministry", "localNGOs"],
  },
  {
    titleKey: "contribute",
    links: ["shareKnowledge", "translateContent", "donate"],
  },
];

export const FooterSection = () => {
  const t = useTranslations("footer");

  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <Image
                src="/images/logo/yachaybot_logo2.png"
                alt="logo"
                width={100}
                height={100}
                className="h-auto mr-4 w-auto max-w-10"
              />
              <h3>YachayBot</h3>
            </Link>
            <p className="mt-4 opacity-80">{t("description")}</p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.titleKey} className="flex flex-col gap-2">
              <h3>{t(section.titleKey)}</h3>
              {section.links.map((labelKey) => (
                <Link
                  key={labelKey}
                  href="#"
                  className="opacity-60 hover:opacity-100"
                >
                  {t(labelKey)}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-6" />
        <section>
          <h3>
            &copy; 2024 YachayBot - {t("footerTitle")}
            <Link
              target="_blank"
              href="#"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              {t("hashtag")}
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
