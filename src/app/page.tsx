"use client";

import { HeroSection } from "@/components/sections/hero";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { BenefitsSection } from "@/components/sections/benefits";
import { FeaturesSection } from "@/components/sections/features";
import { ServicesSection } from "@/components/sections/services";
import { TeamSection } from "@/components/sections/team";
import { CommunitySection } from "@/components/sections/community";
import { PricingSection } from "@/components/sections/pricing";
import { ContactSection } from "@/components/sections/contact";
import { FAQSection } from "@/components/sections/faq";
import { FooterSection } from "@/components/sections/footer";
export default function MainPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status]);

  if (status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center">
        <p>...</p>
      </main>
    );
  }

  return (
    <>
      {/*<h1>Bienvenido</h1>
      <button type="button" onClick={() => router.push("/sign-in")}>
        Inicia sesión
      </button> */}
      <HeroSection />
      <BenefitsSection /> 
      <FeaturesSection />
      <ServicesSection />
      <TeamSection />
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}