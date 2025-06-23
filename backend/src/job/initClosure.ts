import { AppDataSource } from '../data-source';
import { Assessment } from '../entity/Assessment';
import { scheduleAssessmentCloser } from './scheduleClosure';

export const initScheduledClosers = async () => {
  const repo = AppDataSource.getRepository(Assessment);
  const activeAssessments = await repo.find({ where: { is_active:true } });

  for (const a of activeAssessments) {
    // const closeTime = new Date(a.initiated_at.getTime() + 1 * 24 * 60 * 60 * 1000);
    const closeTime = new Date(a.initiated_at.getTime() + 8 * 60 * 60 * 1000);
    if (closeTime > new Date()) {
      scheduleAssessmentCloser(a.assessment_id, a.initiated_at);
    }
  }

  console.log(`Re-scheduled ${activeAssessments.length} assessment closers.`);
};
