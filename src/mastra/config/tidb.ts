import mysql from 'mysql2/promise';

export interface ClinicalCase {
  id: number;
  title: string;
  description: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  outcome: string;
  patient_age: number;
  patient_gender: string;
  medical_history: string;
  embedding: number[];
  created_at: Date;
  updated_at: Date;
}

export class TiDBConnection {
  public connection: mysql.Connection | null = null;

  async connect(): Promise<void> {
    try {
      this.connection = await mysql.createConnection({
        host: process.env.TIDB_HOST || 'gateway01.us-west-2.prod.aws.tidbcloud.com',
        port: parseInt(process.env.TIDB_PORT || '4000'),
        user: process.env.TIDB_USER,
        password: process.env.TIDB_PASSWORD,
        database: process.env.TIDB_DATABASE,
        ssl: {
          rejectUnauthorized: true
        }
      });
      
      console.log('✅ Connected to TiDB successfully');
    } catch (error) {
      console.error('❌ Failed to connect to TiDB:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log('🔌 Disconnected from TiDB');
    }
  }

  async initializeTables(): Promise<void> {
    if (!this.connection) {
      throw new Error('Not connected to TiDB');
    }

    try {
      // Create clinical_cases table with vector support
      await this.connection.execute(`
        CREATE TABLE IF NOT EXISTS clinical_cases (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          symptoms TEXT NOT NULL,
          diagnosis VARCHAR(500) NOT NULL,
          treatment TEXT NOT NULL,
          outcome TEXT,
          patient_age INT,
          patient_gender ENUM('male', 'female', 'other'),
          medical_history TEXT,
          embedding VECTOR(1024),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_diagnosis (diagnosis),
          INDEX idx_age (patient_age),
          INDEX idx_gender (patient_gender)
        )
      `);

      // Create vector index for similarity search using proper TiDB vector index syntax
      try {
        await this.connection.execute(`
          ALTER TABLE clinical_cases ADD VECTOR INDEX idx_embedding_vector ((VEC_COSINE_DISTANCE(embedding))) ADD_COLUMNAR_REPLICA_ON_DEMAND
        `);
      } catch (error: any) {
        // Index might already exist, check if it's a duplicate key error
        if (!error.message.includes('Duplicate key name')) {
          console.warn('Vector index creation warning:', error.message);
        }
      }

      console.log('✅ TiDB tables initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize TiDB tables:', error);
      throw error;
    }
  }

  async insertClinicalCase(caseData: Omit<ClinicalCase, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    if (!this.connection) {
      throw new Error('Not connected to TiDB');
    }

    try {
      const [result] = await this.connection.execute(
        `INSERT INTO clinical_cases 
         (title, description, symptoms, diagnosis, treatment, outcome, 
          patient_age, patient_gender, medical_history, embedding) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          caseData.title,
          caseData.description,
          caseData.symptoms,
          caseData.diagnosis,
          caseData.treatment,
          caseData.outcome,
          caseData.patient_age,
          caseData.patient_gender,
          caseData.medical_history,
          `[${caseData.embedding.join(',')}]`
        ]
      );

      const insertId = (result as any).insertId;
      console.log(`✅ Inserted clinical case with ID: ${insertId}`);
      return insertId;
    } catch (error) {
      console.error('❌ Failed to insert clinical case:', error);
      throw error;
    }
  }

  async searchSimilarCases(queryEmbedding: number[], limit: number = 5): Promise<ClinicalCase[]> {
    if (!this.connection) {
      throw new Error('Not connected to TiDB');
    }

    try {
      // Use TiDB's vector similarity search
      const [rows] = await this.connection.execute(
        `SELECT *, 
         VEC_COSINE_DISTANCE(embedding, ?) as similarity_score
         FROM clinical_cases 
         ORDER BY similarity_score ASC 
         LIMIT ${limit}`,
        [`[${queryEmbedding.join(',')}]`]
      );

      const cases = (rows as any[]).map(row => ({
        ...row,
        embedding: Array.isArray(row.embedding) ? row.embedding : JSON.parse(row.embedding || '[]'),
        similarity_score: row.similarity_score
      }));

      console.log(`✅ Found ${cases.length} similar cases`);
      return cases;
    } catch (error) {
      console.error('❌ Failed to search similar cases:', error);
      throw error;
    }
  }

  async getAllCases(): Promise<ClinicalCase[]> {
    if (!this.connection) {
      throw new Error('Not connected to TiDB');
    }

    try {
      const [rows] = await this.connection.execute(
        'SELECT * FROM clinical_cases ORDER BY created_at DESC'
      );

      const cases = (rows as any[]).map(row => ({
        ...row,
        embedding: JSON.parse(row.embedding)
      }));

      return cases;
    } catch (error) {
      console.error('❌ Failed to get all cases:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const tidb = new TiDBConnection();
