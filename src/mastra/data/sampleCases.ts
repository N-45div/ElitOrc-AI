import { embeddingService } from '../services/embeddingService';
import { tidb, ClinicalCase } from '../config/tidb';

export const sampleClinicalCases = [
  {
    title: "Acute Myocardial Infarction in 52-year-old Male Smoker",
    description: "Patient presented with severe chest pain radiating to left arm, accompanied by diaphoresis and nausea.",
    symptoms: "Severe crushing chest pain, left arm radiation, diaphoresis, nausea, shortness of breath",
    diagnosis: "ST-elevation myocardial infarction (STEMI)",
    treatment: "Emergency PCI, dual antiplatelet therapy, beta-blocker, ACE inhibitor, statin",
    outcome: "Successful revascularization, patient stable post-procedure",
    patient_age: 52,
    patient_gender: "male" as const,
    medical_history: "20-year smoking history, hypertension, hyperlipidemia"
  },
  {
    title: "Pneumonia in 67-year-old Female with COPD",
    description: "Elderly patient with known COPD presented with worsening dyspnea and productive cough.",
    symptoms: "Productive cough with purulent sputum, fever, dyspnea, chest pain",
    diagnosis: "Community-acquired pneumonia with COPD exacerbation",
    treatment: "Antibiotics (levofloxacin), bronchodilators, corticosteroids, oxygen therapy",
    outcome: "Clinical improvement after 5 days, discharged on oral antibiotics",
    patient_age: 67,
    patient_gender: "female" as const,
    medical_history: "COPD, 30-year smoking history (quit 5 years ago), osteoporosis"
  },
  {
    title: "Gastroesophageal Reflux Disease in 45-year-old Male",
    description: "Patient complained of burning chest pain worse after meals and when lying down.",
    symptoms: "Burning chest pain, heartburn, regurgitation, nocturnal cough",
    diagnosis: "Gastroesophageal reflux disease (GERD)",
    treatment: "Proton pump inhibitor, lifestyle modifications, dietary changes",
    outcome: "Significant symptom improvement after 4 weeks of treatment",
    patient_age: 45,
    patient_gender: "male" as const,
    medical_history: "Obesity, occasional alcohol use, sedentary lifestyle"
  },
  {
    title: "Pulmonary Embolism in 38-year-old Female",
    description: "Young woman with sudden onset chest pain and dyspnea following long flight.",
    symptoms: "Sharp chest pain, sudden dyspnea, tachycardia, anxiety",
    diagnosis: "Acute pulmonary embolism",
    treatment: "Anticoagulation with heparin then warfarin, supportive care",
    outcome: "Complete resolution of symptoms, continued on anticoagulation",
    patient_age: 38,
    patient_gender: "female" as const,
    medical_history: "Oral contraceptive use, recent long-haul flight, family history of thrombosis"
  },
  {
    title: "Costochondritis in 29-year-old Male Athlete",
    description: "Young athlete with chest wall pain following intense training session.",
    symptoms: "Sharp, localized chest wall pain, tenderness over costal cartilages, pain with movement",
    diagnosis: "Costochondritis",
    treatment: "NSAIDs, rest, ice application, gradual return to activity",
    outcome: "Complete resolution within 2 weeks",
    patient_age: 29,
    patient_gender: "male" as const,
    medical_history: "Otherwise healthy, regular intense physical training"
  },
  {
    title: "Heart Failure Exacerbation in 72-year-old Male",
    description: "Elderly patient with known heart failure presented with worsening shortness of breath and ankle swelling.",
    symptoms: "Progressive dyspnea, orthopnea, paroxysmal nocturnal dyspnea, bilateral ankle edema, fatigue",
    diagnosis: "Acute on chronic heart failure exacerbation",
    treatment: "Diuretics, ACE inhibitor optimization, beta-blocker, dietary sodium restriction",
    outcome: "Significant improvement with diuresis, discharged on optimized heart failure medications",
    patient_age: 72,
    patient_gender: "male" as const,
    medical_history: "Ischemic cardiomyopathy, diabetes mellitus, chronic kidney disease"
  },
  {
    title: "Anxiety-Related Chest Pain in 34-year-old Female",
    description: "Young professional with recurrent episodes of chest tightness and palpitations during stressful periods.",
    symptoms: "Chest tightness, palpitations, shortness of breath, dizziness, sweating",
    diagnosis: "Anxiety disorder with panic attacks",
    treatment: "Cognitive behavioral therapy, selective serotonin reuptake inhibitor, stress management techniques",
    outcome: "Significant reduction in symptoms with therapy and medication",
    patient_age: 34,
    patient_gender: "female" as const,
    medical_history: "High-stress job, family history of anxiety disorders, no cardiac risk factors"
  },
  {
    title: "Aortic Dissection in 58-year-old Hypertensive Male",
    description: "Patient presented with sudden onset severe chest and back pain, described as tearing sensation.",
    symptoms: "Severe tearing chest and back pain, hypertension, pulse differential between arms",
    diagnosis: "Type A aortic dissection",
    treatment: "Emergency surgical repair, blood pressure control, intensive care monitoring",
    outcome: "Successful surgical repair, prolonged recovery but stable",
    patient_age: 58,
    patient_gender: "male" as const,
    medical_history: "Long-standing hypertension, bicuspid aortic valve, family history of aortic disease"
  }
];

export async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');
    
    await tidb.connect();
    await tidb.initializeTables();
    
    for (const caseData of sampleClinicalCases) {
      // Create combined text for embedding
      const caseText = embeddingService.createCaseText(caseData);
      
      // Generate embedding
      const embedding = await embeddingService.generateEmbedding(caseText);
      
      // Insert case with embedding
      await tidb.insertClinicalCase({
        ...caseData,
        embedding
      });
      
      console.log(`✅ Seeded case: ${caseData.title}`);
    }
    
    await tidb.disconnect();
    console.log('🎉 Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to seed database:', error);
    throw error;
  }
}
