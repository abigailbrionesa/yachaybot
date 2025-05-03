"use client";

import { HeroSection } from "@/components/sections/hero";
import { useSession } from "next-auth/react";
import { BenefitsSection } from "@/components/sections/benefits";
import { FeaturesSection } from "@/components/sections/features";
import { ServicesSection } from "@/components/sections/services";
import { CommunitySection } from "@/components/sections/community";
import { PricingSection } from "@/components/sections/pricing";
import { ContactSection } from "@/components/sections/contact";
import { FAQSection } from "@/components/sections/faq";
import { FooterSection } from "@/components/sections/footer";
import { Navbar } from "@/components/global/navbar";

export default function MainPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex h-screen items-center justify-center">
        <p>...</p>
      </main>
    );
  }

  return (
    <>
      <Navbar/>
      <HeroSection />
      <BenefitsSection /> 
      <FeaturesSection />
      <ServicesSection />
      <CommunitySection />
      <PricingSection />
      <ContactSection />
      <FAQSection />
      <FooterSection />
    </>
  );
}