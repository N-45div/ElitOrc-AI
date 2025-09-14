import { Brain, FileText, Search, Zap, Shield, Users } from "lucide-react";

function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnosis",
      description: "Advanced machine learning algorithms analyze symptoms and medical data to provide accurate diagnostic suggestions with confidence scores."
    },
    {
      icon: Search,
      title: "Vector Case Matching",
      description: "Instantly find similar cases from our comprehensive medical database using state-of-the-art vector similarity search technology."
    },
    {
      icon: FileText,
      title: "Multimodal Analysis",
      description: "Process text, images, audio, and documents simultaneously for comprehensive clinical assessment and decision support."
    },
    {
      icon: Zap,
      title: "Real-time Processing",
      description: "Get instant results with our optimized AI pipeline, enabling rapid clinical decision-making when time is critical."
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and privacy protection ensuring all patient data remains confidential and secure."
    },
    {
      icon: Users,
      title: "Collaborative Platform",
      description: "Share insights and collaborate with healthcare teams while maintaining complete audit trails and access controls."
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Revolutionizing Clinical Decision Making
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our advanced AI platform combines cutting-edge technology with clinical expertise 
            to deliver unprecedented accuracy and efficiency in healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { FeaturesSection };
