"use client";

import { useEffect, useMemo, useState } from "react";

const questions = [
  "名前は？",
  "ニックネームは？",
  "誕生日は？",
  "出身地は？",
  "今住んでいる場所は？",
  "血液型は？",
  "兄弟・姉妹はいる？",
  "好きな季節は？",
  "好きな色は？",
  "好きな動物は？",
  "好きな食べ物は？",
  "嫌いな食べ物は？",
  "好きな飲み物は？",
  "好きなコンビニは？",
  "好きな料理は？",
  "好きなお菓子は？",
  "好きな音楽は？",
  "好きなアーティストは？",
  "最近よく聴く曲は？",
  "好きな映画・ドラマは？",
  "好きなスポーツは？",
  "好きなスポーツ選手は？",
  "好きなゲームは？",
  "好きな漫画・アニメは？",
  "好きなYouTuberは？",
  "好きなSNSは？",
  "趣味は？",
  "休日は何してる？",
  "最近ハマっていることは？",
  "行ってみたい場所は？",
  "自分の性格を一言でいうと？",
  "長所は？",
  "短所は？",
  "人見知りする？",
  "朝型？夜型？",
  "インドア派？アウトドア派？",
  "友達は多い方？",
  "初対面の人と話すのは得意？",
  "周りからどんな人と言われる？",
  "自分の好きなところは？",
  "大切にしていることは？",
  "今一番欲しいものは？",
  "今一番やりたいことは？",
  "将来やってみたいことは？",
  "行ってみたい国は？",
  "宝くじで1億円当たったら何する？",
  "無人島に1つ持っていくなら？",
  "過去に戻れるならいつに戻りたい？",
  "人生で一番楽しかったことは？",
  "最後に、自分を一言で表すなら？",
];

const STORAGE_KEY = "100q-public-answers-v4";

type Mode =
  | "home"
  | "questions"
  | "review"
  | "complete"
  | "profile";

export default function Home() {
  const [mode, setMode] = useState<Mode>("home");
  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState<string[]>(
    () => Array(questions.length).fill("")
  );

  const [saved, setSaved] = useState(false);

  // localStorageから回答を読み込む
  useEffect(() => {
    const savedAnswers = localStorage.getItem(STORAGE_KEY);

    if (!savedAnswers) return;

    try {
      const parsed = JSON.parse(savedAnswers);

      if (
        Array.isArray(parsed) &&
        parsed.length === questions.length
      ) {
        setAnswers(parsed);
      }
    } catch {
      // 読み込み失敗時は何もしない
    }
  }, []);

  // 回答を自動保存
  useEffect(() => {
    if (mode !== "questions") return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(answers)
    );

    setSaved(true);

    const timer = setTimeout(() => {
      setSaved(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [answers, mode]);

  // 回答済み数
  const answeredCount = useMemo(() => {
    return answers.filter(
      (answer) => answer.trim() !== ""
    ).length;
  }, [answers]);

  // 進捗
  const progress =
    ((current + 1) / questions.length) * 100;

  // 上に戻る
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 回答変更
  const updateAnswer = (value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = value;
      return next;
    });
  };

  // 回答開始
  const startQuestions = () => {
    const firstUnanswered = answers.findIndex(
      (answer) => answer.trim() === ""
    );

    if (firstUnanswered === -1) {
      setCurrent(0);
    } else {
      setCurrent(firstUnanswered);
    }

    setMode("questions");
    scrollTop();
  };

  // 次へ
  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1);
      scrollTop();
      return;
    }

    setMode("review");
    scrollTop();
  };

  // 前へ
  const previousQuestion = () => {
    if (current === 0) return;

    setCurrent((prev) => prev - 1);
    scrollTop();
  };

  // 回答一覧
  const goToReview = () => {
    setMode("review");
    scrollTop();
  };

  // 質問を編集
  const editQuestion = (index: number) => {
    setCurrent(index);
    setMode("questions");
    scrollTop();
  };

  // 完成
  const completeQuestions = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(answers)
    );

    setMode("complete");
    scrollTop();
  };

  // プロフィール
  const openProfile = () => {
    setMode("profile");
    scrollTop();
  };

  // ホーム
  const goHome = () => {
    setMode("home");
    scrollTop();
  };

  // リセット
  const resetAnswers = () => {
    const ok = window.confirm(
      "入力した回答をすべて削除しますか？\nこの操作は元に戻せません。"
    );

    if (!ok) return;

    const emptyAnswers = Array(
      questions.length
    ).fill("");

    setAnswers(emptyAnswers);
    setCurrent(0);

    localStorage.removeItem(STORAGE_KEY);

    setMode("home");
    scrollTop();
  };

  // URL共有
  const shareProfile = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert("プロフィールURLをコピーしました！");
    } catch {
      alert(
        "URLをコピーできませんでした。"
      );
    }
  };

  // ==================================================
  // HOME
  // ==================================================

  if (mode === "home") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f4f7ff] via-[#f8f7ff] to-[#f3f0ff] text-[#172033]">
        <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 py-8">

          <div className="mb-12 text-center">
            <div className="mb-2 text-4xl font-black tracking-[-0.05em] text-[#4f46e5]">
              100Q
            </div>

            <p className="text-sm text-[#64748b]">
              100問で、あなたがわかる。
            </p>
          </div>

          <section className="flex flex-1 flex-col justify-center">

            <div className="mb-8">
              <p className="mb-3 text-sm font-bold text-[#818cf8]">
                YOUR PROFILE
              </p>

              <h1 className="text-[34px] font-black leading-[1.15] tracking-[-0.04em]">
                あなたのことを
                <br />
                <span className="text-[#4f46e5]">
                  100問で教えて。
                </span>
              </h1>

              <p className="mt-5 text-[15px] leading-7 text-[#64748b]">
                好きなもの、性格、考えていること。
                <br />
                100個の質問に答えて、
                <br />
                あなたらしいプロフィールを作ろう。
              </p>
            </div>

            {answeredCount > 0 && (
              <div className="mb-5 rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_8px_30px_rgba(79,70,229,0.08)] backdrop-blur">

                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-bold">
                    回答済み
                  </span>

                  <span className="text-sm font-bold text-[#64748b]">
                    {answeredCount} / {questions.length}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-[#e8eaff]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all"
                    style={{
                      width: `${
                        (answeredCount /
                          questions.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

              </div>
            )}

            <div className="space-y-3">

              <button
                type="button"
                onClick={startQuestions}
                className="w-full rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-6 py-5 text-base font-bold text-white shadow-[0_10px_25px_rgba(79,70,229,0.22)] transition active:scale-[0.98]"
              >
                {answeredCount === 0
                  ? "100Qをはじめる"
                  : answeredCount === questions.length
                  ? "100Qをやり直す"
                  : "続きから回答する"}
              </button>

              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={openProfile}
                  className="w-full rounded-2xl border border-[#e0e7ff] bg-white px-6 py-5 text-base font-bold text-[#334155] shadow-sm transition active:scale-[0.98]"
                >
                  自分の100Qを見る
                </button>
              )}

            </div>
          </section>

          {answeredCount > 0 && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={resetAnswers}
                className="text-xs text-[#94a3b8] underline underline-offset-4"
              >
                回答をすべて削除
              </button>
            </div>
          )}

        </div>
      </main>
    );
  }

  // ==================================================
  // QUESTIONS
  // ==================================================

  if (mode === "questions") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f4f7ff] via-[#f8f7ff] to-[#f3f0ff] text-[#172033]">

        <div className="sticky top-0 z-20 border-b border-[#e5e7eb]/80 bg-[#f7f8ff]/95 backdrop-blur">

          <div className="mx-auto w-full max-w-[520px] px-5 pb-4 pt-4">

            <div className="mb-4 flex items-center justify-between">

              <button
                type="button"
                onClick={goHome}
                className="flex min-h-[44px] items-center text-sm font-bold text-[#64748b]"
              >
                ← 戻る
              </button>

              <div className="text-sm font-black text-[#4f46e5]">
                {current + 1} / {questions.length}
              </div>

              <div className="w-[50px] text-right text-xs text-[#94a3b8]">
                {saved ? "保存済み" : "保存済み"}
              </div>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#e3e7f7]">

              <div
                className="h-full rounded-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>
        </div>

        <div className="mx-auto w-full max-w-[520px] px-5 pb-12 pt-10">

          <div className="mb-10">

            <div className="mb-4 text-sm font-bold text-[#818cf8]">
              QUESTION{" "}
              {String(current + 1).padStart(2, "0")}
            </div>

            <h1 className="text-[30px] font-black leading-[1.25] tracking-[-0.04em]">
              {questions[current]}
            </h1>

          </div>

          <textarea
            value={answers[current]}
            onChange={(event) =>
              updateAnswer(event.target.value)
            }
            placeholder="ここに回答を入力..."
            rows={6}
            autoFocus
            className="w-full resize-none rounded-3xl border border-[#e2e8f0] bg-white p-6 text-[17px] leading-8 text-[#172033] outline-none transition placeholder:text-[#cbd5e1] focus:border-[#818cf8] focus:ring-4 focus:ring-[#818cf8]/10"
          />

          <div className="mt-3 flex items-center justify-between px-1">

            <span className="text-xs text-[#94a3b8]">
              {answers[current]?.length || 0}文字
            </span>

            {answers[current]?.trim() && (
              <span className="text-xs font-bold text-[#6366f1]">
                ✓ 回答済み
              </span>
            )}

          </div>

          <div className="mt-8 flex gap-3">

            <button
              type="button"
              onClick={previousQuestion}
              disabled={current === 0}
              className="min-h-[58px] flex-1 rounded-2xl border border-[#e2e8f0] bg-white px-3 text-sm font-bold text-[#475569] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
            >
              ← 前の質問
            </button>

            <button
              type="button"
              onClick={nextQuestion}
              className="min-h-[58px] flex-[1.4] rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(79,70,229,0.18)] transition active:scale-[0.98]"
            >
              {current === questions.length - 1
                ? "回答を確認する"
                : "次の質問 →"}
            </button>

          </div>

          <button
            type="button"
            onClick={goToReview}
            className="mt-5 w-full py-3 text-center text-sm font-bold text-[#94a3b8] underline underline-offset-4"
          >
            回答一覧を確認する
          </button>

        </div>
      </main>
    );
  }

  // ==================================================
  // REVIEW
  // ==================================================

  if (mode === "review") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f4f7ff] via-[#f8f7ff] to-[#f3f0ff] text-[#172033]">

        <div className="mx-auto w-full max-w-[520px] px-5 py-8">

          <button
            type="button"
            onClick={startQuestions}
            className="mb-8 min-h-[44px] text-sm font-bold text-[#64748b]"
          >
            ← 回答に戻る
          </button>

          <div className="mb-8">

            <p className="mb-3 text-sm font-bold text-[#818cf8]">
              CHECK
            </p>

            <h1 className="text-[32px] font-black leading-tight tracking-[-0.04em]">
              回答を確認しよう
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#64748b]">
              未回答の質問があっても、そのまま完成できます。
            </p>

          </div>

          <div className="space-y-3">

            {questions.map((question, index) => (
              <button
                key={index}
                type="button"
                onClick={() => editQuestion(index)}
                className="w-full rounded-2xl border border-[#e2e8f0] bg-white p-5 text-left shadow-sm transition active:scale-[0.99]"
              >

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-xs font-bold text-[#818cf8]">
                    Q{String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-xs font-bold text-[#94a3b8]">
                    編集 →
                  </span>

                </div>

                <div className="mb-2 text-sm font-bold">
                  {question}
                </div>

                <div
                  className={`whitespace-pre-wrap break-words text-sm leading-6 ${
                    answers[index]
                      ? "text-[#475569]"
                      : "text-[#cbd5e1]"
                  }`}
                >
                  {answers[index] || "未回答"}
                </div>

              </button>
            ))}

          </div>

          <button
            type="button"
            onClick={completeQuestions}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-6 py-5 text-base font-bold text-white shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition active:scale-[0.98]"
          >
            100Qを完成させる
          </button>

        </div>
      </main>
    );
  }

  // ==================================================
  // COMPLETE
  // ==================================================

  if (mode === "complete") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f4f7ff] via-[#f8f7ff] to-[#f3f0ff] text-[#172033]">

        <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col px-5 py-8">

          <div className="flex flex-1 flex-col items-center justify-center text-center">

            <div className="mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] text-3xl font-bold text-white shadow-[0_12px_30px_rgba(79,70,229,0.25)]">
              ✓
            </div>

            <p className="mb-3 text-sm font-bold text-[#818cf8]">
              COMPLETE
            </p>

            <h1 className="text-[36px] font-black leading-tight tracking-[-0.05em]">
              100Q
              <br />
              完成！
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#64748b]">
              あなたの100問プロフィールが完成しました。
            </p>

            <div className="mt-10 w-full space-y-3">

              <button
                type="button"
                onClick={openProfile}
                className="w-full rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] px-6 py-5 text-base font-bold text-white shadow-[0_10px_25px_rgba(79,70,229,0.2)] transition active:scale-[0.98]"
              >
                自分の100Qを見る
              </button>

              <button
                type="button"
                onClick={goHome}
                className="w-full rounded-2xl border border-[#e2e8f0] bg-white px-6 py-5 text-base font-bold text-[#475569] transition active:scale-[0.98]"
              >
                ホームに戻る
              </button>

            </div>

          </div>

        </div>
      </main>
    );
  }

  // ==================================================
  // PROFILE
  // ==================================================

  if (mode === "profile") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#f4f7ff] via-[#f8f7ff] to-[#f3f0ff] text-[#172033]">

        <div className="mx-auto w-full max-w-[520px] px-5 py-8">

          <button
            type="button"
            onClick={goHome}
            className="mb-8 min-h-[44px] text-sm font-bold text-[#64748b]"
          >
            ← ホーム
          </button>

          <div className="mb-8">

            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#4f46e5] to-[#8b5cf6] text-xl font-black text-white shadow-[0_10px_25px_rgba(79,70,229,0.2)]">
              100Q
            </div>

            <h1 className="text-[32px] font-black tracking-[-0.04em]">
              {answers[0] || "あなたの100Q"}
            </h1>

            {answers[1] && (
              <p className="mt-1 text-sm text-[#64748b]">
                @{answers[1]}
              </p>
            )}

            <p className="mt-4 text-sm leading-6 text-[#64748b]">
              100問の質問から見るプロフィール
            </p>

          </div>

          <div className="mb-8 grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={shareProfile}
              className="min-h-[52px] rounded-2xl bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] text-sm font-bold text-white shadow-[0_8px_20px_rgba(79,70,229,0.18)] transition active:scale-[0.98]"
            >
              共有する
            </button>

            <button
              type="button"
              onClick={() => {
                alert(
                  "「もっと知りたい！」機能は、次の段階で実装します。"
                );
              }}
              className="min-h-[52px] rounded-2xl border border-[#fbcfe8] bg-[#fff1f7] text-sm font-bold text-[#be185d] transition active:scale-[0.98]"
            >
              もっと知りたい！
            </button>

          </div>

          <div className="space-y-3">

            {questions.map((question, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#e8eaf4] bg-white p-5 shadow-sm"
              >

                <div className="mb-3 text-xs font-bold text-[#818cf8]">
                  Q{String(index + 1).padStart(2, "0")}
                </div>

                <div className="mb-3 text-sm font-bold leading-6">
                  {question}
                </div>

                <div
                  className={`whitespace-pre-wrap break-words text-[15px] leading-7 ${
                    answers[index]
                      ? "text-[#475569]"
                      : "text-[#cbd5e1]"
                  }`}
                >
                  {answers[index] || "未回答"}
                </div>

              </div>
            ))}

          </div>

          <div className="mt-8 space-y-3">

            <button
              type="button"
              onClick={startQuestions}
              className="w-full rounded-2xl border border-[#e2e8f0] bg-white px-6 py-5 text-sm font-bold text-[#475569] transition active:scale-[0.98]"
            >
              回答を編集する
            </button>

            <button
              type="button"
              onClick={goHome}
              className="w-full py-4 text-sm font-bold text-[#94a3b8]"
            >
              ホームへ戻る
            </button>

          </div>

        </div>
      </main>
    );
  }

  return null;
}