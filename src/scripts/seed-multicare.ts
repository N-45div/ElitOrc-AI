#!/usr/bin/env tsx
import dotenv from 'dotenv';
import { ParquetReader } from '@dsnp/parquetjs';
import { tidb } from '../mastra/config/tidb';
import { embeddingService } from '../mastra/services/embeddingService';

dotenv.config();

// --- Configuration ---
const PARQUET_FILE_PATH = './src/mastra/data/cases.parquet';
const BATCH_SIZE = 50; // Number of cases to process in each batch
const MAX_CASES_TO_PROCESS = 200; // Total number of cases to process. Set to 0 for all.

interface ParquetRecord {
  article_id: string;
  cases: {
    list: Array<{ 
      element: {
        age: number;
        case_id: string;
        case_text: string;
        gender: string;
      };
    }>;
  };
}

// --- Helper function to extract info from text (very basic) ---
function extractInfo(text: string): { description: string, symptoms: string, diagnosis: string, treatment: string } {
  const description = text.slice(0, 500) + '...'; // First 500 chars as description
  
  const symptomsMatch = text.match(/symptoms[:\s](.*)/i);
  const symptoms = symptomsMatch ? symptomsMatch[1].split('.')[0] : 'Not specified';

  const diagnosisMatch = text.match(/diagnosis[:\s](.*)/i);
  const diagnosis = diagnosisMatch ? diagnosisMatch[1].split('.')[0] : 'Not specified';

  const treatmentMatch = text.match(/treatment[:\s](.*)/i);
  const treatment = treatmentMatch ? treatmentMatch[1].split('.')[0] : 'Not specified';

  return { description, symptoms, diagnosis, treatment };
}

async function seedMultiCaRe() {
  console.log(`🌱 Starting database seeding from MultiCaRe dataset (up to ${MAX_CASES_TO_PROCESS} cases in batches of ${BATCH_SIZE})...`);

  try {
    await tidb.connect();
    await tidb.initializeTables();

    const reader = await ParquetReader.openFile(PARQUET_FILE_PATH);
    const cursor = reader.getCursor();
    
    let seededCount = 0;
    let eof = false; // End of file flag

    while (!eof && seededCount < MAX_CASES_TO_PROCESS) { // Simplified condition
      const casesForBatch: any[] = [];
      const textsToEmbed: string[] = [];

      // 1. Accumulate a batch of individual cases from the nested structure
      while (casesForBatch.length < BATCH_SIZE) {
        const record = await cursor.next() as ParquetRecord; // Cast record
        if (!record) {
          eof = true;
          break;
        }

        if (record.cases && Array.isArray(record.cases.list)) {
          for (const caseItem of record.cases.list) {
            // Access the data inside the 'element' property
            const caseElement = caseItem.element;

            if (caseElement && caseElement.case_text) {
              const title = `Case ${caseElement.case_id || 'N/A'} from article ${record.article_id}`;
              const gender = (caseElement.gender || '').toLowerCase();

              const caseData = {
                title: title,
                description: caseElement.case_text.slice(0, 1000) + '...', 
                symptoms: 'See description',
                diagnosis: 'See description',
                treatment: 'See description',
                outcome: 'Not specified',
                patient_age: parseInt(caseElement.age as any) || 0,
                patient_gender: ['male', 'female'].includes(gender) ? gender : 'other',
                medical_history: 'Not specified',
              };

              casesForBatch.push(caseData);

              textsToEmbed.push(embeddingService.createCaseText({
                  title: title,
                  description: caseElement.case_text,
                  symptoms: '',
                  diagnosis: '',
                  treatment: '',
                  patient_age: caseData.patient_age,
                  patient_gender: caseData.patient_gender,
              }));

              if (casesForBatch.length >= BATCH_SIZE || seededCount + casesForBatch.length >= MAX_CASES_TO_PROCESS) {
                break;
              }
            }
          }
        }
        if (casesForBatch.length >= BATCH_SIZE || seededCount + casesForBatch.length >= MAX_CASES_TO_PROCESS) {
            break;
        }
      }

      if (casesForBatch.length === 0) {
        if (!eof) continue;
        console.log('No more valid cases to process.');
        break;
      }

      console.log(`\nProcessing batch of ${casesForBatch.length} cases...`);

      // 2. Generate embeddings for the batch
      const embeddings = await embeddingService.generateEmbeddings(textsToEmbed);

      if (embeddings.length !== casesForBatch.length) {
        console.warn(`Warning: Mismatch between cases in batch (${casesForBatch.length}) and embeddings received (${embeddings.length}). Skipping batch.`);
        continue;
      }

      // 3. Insert the batch into the database
      for (let i = 0; i < casesForBatch.length; i++) {
        await tidb.insertClinicalCase({
          ...casesForBatch[i],
          embedding: embeddings[i],
        });
      }
      seededCount += casesForBatch.length;
      console.log(`✅ Seeded batch. Total cases seeded: ${seededCount}`);
    }

    await reader.close();
    await tidb.disconnect();
    console.log(`\n🎉 Successfully seeded ${seededCount} cases from the MultiCaRe dataset!`);

  } catch (error) {
    console.error('❌ Failed to seed database from MultiCaRe dataset:', error);
    process.exit(1);
  }
}

async function main() {
  try {
    await seedMultiCaRe();
    process.exit(0);
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

main();
