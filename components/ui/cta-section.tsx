"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight, PhoneCall } from "lucide-react";

function CTASection() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Transform Your Clinical Practice?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who trust ElitorcAI for accurate, 
            fast, and reliable clinical decision support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="gap-4 bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
              Start Free Trial
              <MoveRight className="w-5 h-5" />
            </Button>
            <Button size="lg" className="gap-4 px-8 py-6 text-lg" variant="outline">
              Book Consultation
              <PhoneCall className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center max-w-2xl mx-auto">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">Free 30-Day Trial</div>
              <p className="text-gray-600 dark:text-gray-300">No credit card required</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">24/7 Support</div>
              <p className="text-gray-600 dark:text-gray-300">Expert assistance when you need it</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { CTASection };
