import { Separator } from "@/components/ui/separator";
import { ChevronsDownIcon } from "lucide-react";
import Link from "next/link";

export const FooterSection = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="p-10 bg-card border border-secondary rounded-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8">
          <div className="col-span-full xl:col-span-2">
            <Link href="#" className="flex font-bold items-center">
              <ChevronsDownIcon className="w-9 h-9 mr-2 bg-gradient-to-tr from-primary via-primary/70 to-primary rounded-lg border border-secondary" />

              <h3 className="text-2xl">YachayBot</h3>
            </Link>
            <p className="mt-4 opacity-80">
              Tecnología que preserva saberes ancestrales en quechua, aimara y español.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contacto</h3>
            <div>
              <Link href="mailto:saberes@yachaybot.org" className="opacity-60 hover:opacity-100">
                Correo
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                WhatsApp Comunidades
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Prensa
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Plataformas</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Web App
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Android (Offline)
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                SMS para zonas rurales
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Aliados</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Escuelas EIB
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Ministerio de Cultura
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                ONGs Locales
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-lg">Contribuye</h3>
            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Comparte saberes
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Traduce contenidos
              </Link>
            </div>

            <div>
              <Link href="#" className="opacity-60 hover:opacity-100">
                Donaciones
              </Link>
            </div>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">
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