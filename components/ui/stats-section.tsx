function StatsSection() {
  const stats = [
    {
      number: "99.7%",
      label: "Diagnostic Accuracy",
      description: "Validated across 10,000+ clinical cases"
    },
    {
      number: "< 2s",
      label: "Response Time",
      description: "Real-time analysis and recommendations"
    },
    {
      number: "500K+",
      label: "Medical Cases",
      description: "Comprehensive database for case matching"
    },
    {
      number: "24/7",
      label: "Availability",
      description: "Always-on clinical decision support"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Proven Clinical Excellence
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Our AI platform delivers measurable results that healthcare professionals trust
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-4">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-blue-100 mb-2">
                {stat.label}
              </div>
              <div className="text-blue-200 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { StatsSection };
