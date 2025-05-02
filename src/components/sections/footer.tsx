import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  {
    title: "Contacto",
    links: ["Correo", "WhatsApp Comunidades", "Prensa"],
  },
  {
    title: "Aliados",
    links: ["Escuelas EIB", "Ministerio de Cultura", "ONGs Locales"],
  },
  {
    title: "Contribuye",
    links: ["Comparte saberes", "Traduce contenidos", "Donaciones"],
  },
];

export const FooterSection = () => {
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
            <p className="mt-4 opacity-80">
              Tecnología que preserva saberes ancestrales en quechua, aimara y español.
            </p>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <h3>{section.title}</h3>
              {section.links.map((label) => (
                <Link
                  key={label}
                  href="#"
                  className="opacity-60 hover:opacity-100"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-6" />
        <section>
          <h3>
            &copy; 2024 YachayBot - Saberes Ancestrales con IA
            <Link
              target="_blank"
              href="#"
              className="text-primary transition-all border-primary hover:border-b-2 ml-1"
            >
              #TecnologíaConIdentidad
            </Link>
          </h3>
        </section>
      </div>
    </footer>
  );
};
