import { evalQuestions, runEval } from "./v2-data";
import type { EvalQuestion, EvalResult } from "./v2-types";

export type EvalFailureType =
  | "top1-miss"
  | "top3-miss"
  | "top5-miss"
  | "low-precision-at-3"
  | "refusal-false-positive"
  | "refusal-false-negative"
  | "citation-failure";

export interface EvalFailure {
  questionId: string;
  category: EvalQuestion["category"];
  failureType: EvalFailureType;
  question: string;
  acceptableDocumentIds: string[];
  retrievedDocumentIds: string[];
  answerRefused: boolean;
  citationMarkers: string[];
  precisionAt3: number;
}

export interface EvalFailureAnalysis {
  runId: string;
  metrics: ReturnType<typeof runEval>["metrics"];
  failures: EvalFailure[];
  countsByType: Record<EvalFailureType, number>;
}

const failureTypes: EvalFailureType[] = [
  "top1-miss",
  "top3-miss",
  "top5-miss",
  "low-precision-at-3",
  "refusal-false-positive",
  "refusal-false-negative",
  "citation-failure",
];

export function analyzeEvalFailures(): EvalFailureAnalysis {
  const run = runEval();
  const questionById = new Map(evalQuestions.map((question) => [question.id, question]));
  const failures = run.results.flatMap((result) => classifyFailures(result, questionById.get(result.questionId)));
  const countsByType = Object.fromEntries(failureTypes.map((type) => [type, 0])) as Record<EvalFailureType, number>;

  for (const failure of failures) {
    countsByType[failure.failureType] += 1;
  }

  return {
    runId: run.id,
    metrics: run.metrics,
    failures,
    countsByType,
  };
}

function classifyFailures(result: EvalResult, question: EvalQuestion | undefined): EvalFailure[] {
  const failures: EvalFailure[] = [];
  const hasRetrievalTarget = result.acceptableDocumentIds.length > 0;
  const shouldRefuse = question?.shouldRefuse ?? false;

  if (hasRetrievalTarget && !result.top1Hit) {
    failures.push(toFailure(result, "top1-miss"));
  }

  if (hasRetrievalTarget && !result.top3Hit) {
    failures.push(toFailure(result, "top3-miss"));
  }

  if (hasRetrievalTarget && !result.top5Hit) {
    failures.push(toFailure(result, "top5-miss"));
  }

  if (hasRetrievalTarget && result.precisionAt3 < 0.34) {
    failures.push(toFailure(result, "low-precision-at-3"));
  }

  if (!shouldRefuse && result.answerRefused) {
    failures.push(toFailure(result, "refusal-false-positive"));
  }

  if (shouldRefuse && !result.answerRefused) {
    failures.push(toFailure(result, "refusal-false-negative"));
  }

  if (!result.citationPassed) {
    failures.push(toFailure(result, "citation-failure"));
  }

  return failures;
}

function toFailure(result: EvalResult, failureType: EvalFailureType): EvalFailure {
  return {
    questionId: result.questionId,
    category: result.category,
    failureType,
    question: result.question,
    acceptableDocumentIds: result.acceptableDocumentIds,
    retrievedDocumentIds: result.retrievedDocumentIds,
    answerRefused: result.answerRefused,
    citationMarkers: result.citationMarkers,
    precisionAt3: result.precisionAt3,
  };
}
