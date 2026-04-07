import React, { useEffect, useMemo, useState } from "react";
import { fetchJson, QuizCheckResult, QuizQuestion } from "../lib/api";

type Props = {
  sectionId: number;
};

type AnswerState = {
  selectedOption: number;
  result: QuizCheckResult;
};

const Quiz: React.FC<Props> = ({ sectionId }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setCurrentIdx(0);
    setAnswers({});
    fetchJson<QuizQuestion[]>(`/sections/${sectionId}/quiz`)
      .then((data) => {
        if (!cancelled) setQuestions(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Ошибка загрузки викторины");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sectionId]);

  const current = questions[currentIdx];
  const answered = current ? answers[current.id] : undefined;

  const correctCount = useMemo(() => {
    return Object.values(answers).filter((a) => a.result.correct).length;
  }, [answers]);

  const total = questions.length;
  const isFinished = total > 0 && Object.keys(answers).length === total;

  const submitAnswer = async (questionId: number, selectedOption: number) => {
    if (answers[questionId] || checking) return;
    setChecking(true);
    try {
      const result = await fetchJson<QuizCheckResult>("/quiz/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id: questionId, selected_option: selectedOption }),
      });
      setAnswers((prev) => ({ ...prev, [questionId]: { selectedOption, result } }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Ошибка проверки ответа");
    } finally {
      setChecking(false);
    }
  };

  const optionClass = (opt: number) => {
    if (!answered) return "border-accent-silver/40 hover:border-accent-gold hover:bg-slate-900/70";
    const isCorrect = answered.result.correct_option === opt;
    const isSelected = answered.selectedOption === opt;
    if (isCorrect) return "border-emerald-400/70 bg-emerald-500/15";
    if (isSelected && !answered.result.correct) return "border-rose-400/70 bg-rose-500/15";
    return "border-accent-silver/30 opacity-70";
  };

  if (loading) {
    return (
      <div className="bg-slate-900/70 border border-accent-silver/40 rounded-xl p-5">
        <p className="text-sm text-accent-silver/90">Загрузка викторины...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900/70 border border-accent-silver/40 rounded-xl p-5">
        <p className="text-sm text-accent-silver/90">{error}</p>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="bg-slate-900/70 border border-accent-silver/40 rounded-2xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold">Викторина</h3>
          <p className="mt-1 text-xs text-accent-silver/80">
            Вопрос {currentIdx + 1} из {total}
          </p>
        </div>
        <div className="text-xs text-accent-silver/80">
          Правильных: <span className="text-white font-semibold">{correctCount}</span> / {total}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium">{current.question}</p>
        <div className="mt-4 grid gap-2">
          {[1, 2, 3].map((opt) => {
            const label = opt === 1 ? current.option1 : opt === 2 ? current.option2 : current.option3;
            return (
              <button
                key={opt}
                disabled={!!answered || checking}
                onClick={() => submitAnswer(current.id, opt)}
                className={`text-left px-4 py-3 rounded-xl border transition-colors ${optionClass(opt)}`}
              >
                <span className="text-sm">{label}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-4 text-sm">
            <p className={answered.result.correct ? "text-emerald-300" : "text-rose-300"}>
              {answered.result.correct ? "Верно" : "Неверно"}
            </p>
            {answered.result.explanation ? (
              <p className="mt-2 text-xs text-accent-silver/85 whitespace-pre-line">
                {answered.result.explanation}
              </p>
            ) : null}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <button
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
            className="text-xs px-3 py-2 rounded-full border border-accent-silver/40 text-accent-silver disabled:opacity-40"
          >
            ← Назад
          </button>

          {isFinished ? (
            <div className="text-xs text-accent-gold">Результат: {correctCount} / {total}</div>
          ) : (
            <button
              onClick={() => setCurrentIdx((i) => Math.min(total - 1, i + 1))}
              disabled={!answered || currentIdx === total - 1}
              className="text-xs px-4 py-2 rounded-full border border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-space-dark disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-accent-gold"
            >
              Далее →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

