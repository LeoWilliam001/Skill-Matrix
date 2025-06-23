import schedule from 'node-schedule';
import { AppDataSource } from '../data-source';
import { Assessment } from '../entity/Assessment';

export const scheduleAssessmentCloser = (assessmentId: number, initiatedAt: Date) => {
  // const closeTime = new Date(initiatedAt.getTime() + 3 * 24 * 60 * 60 * 1000);
  const closeTime = new Date(initiatedAt.getTime() + 8 * 60 * 60 * 1000);

  schedule.scheduleJob(`close-assessment-${assessmentId}`, closeTime, async () => {
    const repo = AppDataSource.getRepository(Assessment);
    const assessment = await repo.findOne({ where: { assessment_id: assessmentId } });
    
    if (assessment && assessment.is_active == true) {
      assessment.is_active = false;
      await repo.save(assessment);
      console.log(`[JOB] Assessment ${assessmentId} auto-closed at ${new Date().toISOString()}`);
    }
  });

  console.log(`[JOB CREATED] Assessment ${assessmentId} scheduled to close at ${closeTime}`);
};

