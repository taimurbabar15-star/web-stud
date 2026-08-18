"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  PlayCircle, FileText, CheckCircle, ChevronLeft, 
  ChevronRight, Award, HelpCircle, Save, Download, Sparkles, BookOpen 
} from "lucide-react";
import { toggleLessonCompletionAction } from "@/app/actions/progress";
import confetti from "canvas-confetti";

interface LMSPlayerClientProps {
  course: any;
  activeLesson: any;
  completedLessonIds: string[];
  certificate: any;
  progressPercent: number;
}

export default function LMSPlayerClient({ 
  course, activeLesson, completedLessonIds, certificate, progressPercent 
}: LMSPlayerClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"progress" | "notes" | "resources">("progress");
  const [completedIds, setCompletedIds] = useState<string[]>(completedLessonIds);
  const [currentProgress, setCurrentProgress] = useState(progressPercent);
  const [studentCert, setStudentCert] = useState<any>(certificate);

  // Quiz-specific states
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizGrade, setQuizGrade] = useState<{ score: number; passed: boolean } | null>(null);

  // Notes state
  const [noteContent, setNoteContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("Unsaved changes");

  // Load persistent note on lesson change
  useEffect(() => {
    const saved = localStorage.getItem(`bkmsfx_notes_${activeLesson.id}`);
    setNoteContent(saved || "");
    setSaveStatus(saved ? "All notes saved" : "No notes written");

    // Reset Quiz states
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizGrade(null);
  }, [activeLesson.id]);

  // Fire confetti if progress reaches 100% and a certificate is active
  useEffect(() => {
    if (currentProgress === 100) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#D4AF37", "#146BFF", "#FFFFFF"]
      });
    }
  }, [currentProgress]);

  const saveNote = () => {
    localStorage.setItem(`bkmsfx_notes_${activeLesson.id}`, noteContent);
    setSaveStatus("All notes saved");
  };

  const isCompleted = completedIds.includes(activeLesson.id);

  const handleToggleComplete = () => {
    startTransition(async () => {
      const nextState = !isCompleted;
      const result = await toggleLessonCompletionAction(course.id, activeLesson.id, nextState);
      
      if (result?.success) {
        if (nextState) {
          setCompletedIds(prev => [...prev, activeLesson.id]);
        } else {
          setCompletedIds(prev => prev.filter(id => id !== activeLesson.id));
        }
        
        setCurrentProgress(result.progress);
        
        if (result.progress === 100) {
          // Fetch newly created certificate
          const certResult = await fetch(`/api/certificates?courseId=${course.id}`).then(res => res.json());
          if (certResult?.certificate) {
            setStudentCert(certResult.certificate);
          }
        }
        router.refresh();
      }
    });
  };

  // Find curriculum order list to calculate Prev & Next routes
  const flatLessons = course.modules.flatMap((m: any) => m.lessons);
  const activeIdx = flatLessons.findIndex((l: any) => l.id === activeLesson.id);
  const prevLesson = activeIdx > 0 ? flatLessons[activeIdx - 1] : null;
  const nextLesson = activeIdx < flatLessons.length - 1 ? flatLessons[activeIdx + 1] : null;

  // Render Quiz Questions
  let quizQuestions: any[] = [];
  if (activeLesson.type === "QUIZ" && activeLesson.content) {
    try {
      quizQuestions = JSON.parse(activeLesson.content);
    } catch (e) {
      console.error("Quiz parsing error:", e);
    }
  }

  const handleQuizSubmit = () => {
    if (quizQuestions.length === 0) return;
    
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) {
        correctCount++;
      }
    });

    const score = (correctCount / quizQuestions.length) * 100;
    setQuizGrade({ score, passed: score >= 70 });
    setQuizSubmitted(true);

    if (score >= 70 && !isCompleted) {
      handleToggleComplete(); // Automatically mark quiz lesson complete upon passing
    }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-80px)] overflow-hidden">
      
      {/* 1. LEFT PANE: CURRICULUM TREE */}
      <aside className="w-full md:w-80 border-r border-white/[0.05] bg-brand-black-rich flex flex-col h-1/3 md:h-full overflow-y-auto shrink-0">
        <div className="p-4 border-b border-white/[0.05] bg-brand-black-deep flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-brand-text-white uppercase tracking-wider truncate max-w-[200px]">
              {course.title}
            </h4>
            <span className="text-[10px] text-brand-blue-bright uppercase font-semibold mt-1 block">
              Progress: {currentProgress.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex-grow divide-y divide-white/[0.03] p-2 space-y-4 overflow-y-auto">
          {course.modules.map((mod: any) => (
            <div key={mod.id} className="pt-2">
              <span className="text-[10px] font-bold text-brand-text-secondary-gray uppercase tracking-wider block px-2 mb-2">
                Mod {mod.order}: {mod.title}
              </span>
              <div className="space-y-1">
                {mod.lessons.map((les: any) => {
                  const isActive = les.id === activeLesson.id;
                  const isDone = completedIds.includes(les.id);
                  const isQ = les.type === "QUIZ";
                  
                  return (
                    <Link
                      key={les.id}
                      href={`/learn/${course.id}/${les.id}`}
                      className={`flex items-center gap-3.5 px-3 py-2.5 rounded-md text-xs transition-colors ${
                        isActive 
                          ? "bg-brand-blue-electric/15 text-brand-blue-bright font-semibold border-l-2 border-brand-blue-electric" 
                          : "text-brand-text-primary-gray hover:bg-white/[0.02]"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      ) : isQ ? (
                        <HelpCircle className="h-4 w-4 text-brand-gold-premium shrink-0" />
                      ) : (
                        <PlayCircle className="h-4 w-4 text-brand-text-secondary-gray shrink-0" />
                      )}
                      <span className="truncate leading-none">{les.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. CENTER PANE: VIDEO / CONTENT PLAYER */}
      <section className="flex-grow flex flex-col justify-between h-2/3 md:h-full overflow-y-auto bg-brand-black-deep">
        <div className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          
          {/* Lesson Header */}
          <div className="border-b border-white/[0.04] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-brand-gold-premium uppercase tracking-widest block mb-1">
                {activeLesson.type} Lesson
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-brand-text-white tracking-wide">
                {activeLesson.title}
              </h1>
            </div>
          </div>

          {/* Achievement Celebrator banner */}
          {currentProgress === 100 && studentCert && (
            <div className="glass-panel-gold rounded-lg p-5 border-brand-gold-premium/45 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex gap-3 items-center">
                <Award className="h-10 w-10 text-brand-gold-premium animate-bounce" />
                <div>
                  <h4 className="text-xs font-bold text-brand-text-white uppercase tracking-wider">Congratulations!</h4>
                  <p className="text-[10px] text-brand-text-secondary-gray mt-0.5 leading-normal">
                    You graduated! Your certificate <span className="font-semibold text-brand-gold-premium">{studentCert.certificateNumber}</span> is ready.
                  </p>
                </div>
              </div>
              <Link
                href={`/dashboard/certificates`}
                className="px-4 py-2 rounded bg-gold-gradient text-brand-black-deep text-xs font-bold uppercase tracking-wider shrink-0 hover:shadow-lg transition-all"
              >
                View Certificate
              </Link>
            </div>
          )}

          {/* Interactive Player */}
          <div className="w-full">
            {activeLesson.type === "VIDEO" ? (
              <div className="aspect-video rounded-xl overflow-hidden border border-white/[0.05] bg-black shadow-2xl">
                <video
                  src={activeLesson.videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4"}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            ) : activeLesson.type === "QUIZ" ? (
              <div className="glass-panel border-white/[0.05] rounded-xl p-6 sm:p-8 space-y-6">
                <h3 className="text-sm font-bold text-brand-text-white uppercase tracking-wider flex items-center gap-2">
                  <HelpCircle className="h-4.5 w-4.5 text-brand-gold-premium" />
                  Lesson Comprehension Quiz
                </h3>

                {quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <p className="text-xs font-semibold text-brand-text-white">
                      Question {qIdx + 1}: {q.question}
                    </p>
                    <div className="grid grid-cols-1 gap-2.5">
                      {q.options.map((opt: string, oIdx: number) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = oIdx === q.correct;
                        
                        let optionStyle = "border-white/[0.06] bg-brand-black-rich text-brand-text-primary-gray hover:bg-white/[0.02]";
                        if (isSelected) optionStyle = "border-brand-blue-electric bg-brand-blue-electric/10 text-brand-blue-bright";
                        if (quizSubmitted) {
                          if (isCorrect) optionStyle = "border-emerald-500 bg-emerald-950/20 text-emerald-400";
                          else if (isSelected) optionStyle = "border-red-500 bg-red-950/20 text-red-400";
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIdx]: oIdx }))}
                            className={`w-full text-left p-3 rounded-md border text-xs transition-colors flex justify-between items-center ${optionStyle}`}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <span className="text-[10px] font-bold text-emerald-400">✓ Correct</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {quizGrade && (
                  <div className={`p-4 rounded-md text-xs border ${
                    quizGrade.passed 
                      ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400" 
                      : "bg-red-950/20 border-red-900/30 text-red-400"
                  }`}>
                    <p className="font-bold">Quiz Results: {quizGrade.score.toFixed(0)}%</p>
                    <p className="mt-1 leading-normal">
                      {quizGrade.passed 
                        ? "Congratulations! You passed the quiz. Lesson is marked as complete." 
                        : "Score at least 70% to pass. Please try again."}
                    </p>
                  </div>
                )}

                {!quizSubmitted ? (
                  <button
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(selectedAnswers).length < quizQuestions.length}
                    className="px-6 py-2.5 rounded bg-brand-blue-electric text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-blue-bright transition-colors disabled:opacity-40"
                  >
                    Submit Quiz Answers
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                      setQuizGrade(null);
                    }}
                    className="px-6 py-2.5 rounded border border-white/[0.08] text-brand-text-white text-xs font-bold uppercase tracking-wider hover:bg-white/[0.02]"
                  >
                    Retake Quiz
                  </button>
                )}
              </div>
            ) : (
              // HTML/Text content
              <div 
                className="prose prose-invert max-w-none text-xs sm:text-sm text-brand-text-primary-gray leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: activeLesson.content || "" }}
              />
            )}
          </div>
        </div>

        {/* Bottom Curriculum Navigation Pager */}
        <div className="p-4 sm:p-6 border-t border-white/[0.04] bg-brand-black-rich flex items-center justify-between">
          {prevLesson ? (
            <Link
              href={`/learn/${course.id}/${prevLesson.id}`}
              className="flex items-center gap-1 text-xs font-semibold text-brand-text-secondary-gray hover:text-brand-text-white transition-colors"
            >
              <ChevronLeft className="h-4.5 w-4.5" />
              Prev
            </Link>
          ) : (
            <span className="opacity-20 flex items-center gap-1 text-xs text-brand-text-secondary-gray cursor-not-allowed">
              <ChevronLeft className="h-4.5 w-4.5" /> Prev
            </span>
          )}

          {nextLesson ? (
            <Link
              href={`/learn/${course.id}/${nextLesson.id}`}
              className="flex items-center gap-1 text-xs font-semibold text-brand-text-secondary-gray hover:text-brand-text-white transition-colors"
            >
              Next
              <ChevronRight className="h-4.5 w-4.5" />
            </Link>
          ) : (
            <span className="opacity-20 flex items-center gap-1 text-xs text-brand-text-secondary-gray cursor-not-allowed">
              Next <ChevronRight className="h-4.5 w-4.5" />
            </span>
          )}
        </div>
      </section>

      {/* 3. RIGHT PANE: SIDEBAR DETAIL PANELS */}
      <aside className="w-full md:w-80 border-l border-white/[0.05] bg-brand-black-rich flex flex-col h-1/3 md:h-full shrink-0">
        
        {/* Tab Headers */}
        <div className="flex border-b border-white/[0.05] text-[11px] font-bold uppercase tracking-wider bg-brand-black-deep shrink-0">
          <button
            onClick={() => setActiveTab("progress")}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === "progress" 
                ? "border-brand-blue-electric text-brand-blue-bright" 
                : "border-transparent text-brand-text-secondary-gray hover:text-brand-text-white"
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === "notes" 
                ? "border-brand-blue-electric text-brand-blue-bright" 
                : "border-transparent text-brand-text-secondary-gray hover:text-brand-text-white"
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === "resources" 
                ? "border-brand-blue-electric text-brand-blue-bright" 
                : "border-transparent text-brand-text-secondary-gray hover:text-brand-text-white"
            }`}
          >
            Resources
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-grow p-4 overflow-y-auto">
          {activeTab === "progress" ? (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-brand-black-deep border border-white/[0.03] space-y-3">
                <span className="text-[10px] font-bold text-brand-text-secondary-gray uppercase tracking-widest block">
                  Lesson Status
                </span>
                <p className="text-xs text-brand-text-primary-gray leading-normal">
                  {isCompleted 
                    ? "You have completed this lesson. Progress counts towards certification." 
                    : "This lesson is currently incomplete. Mark as complete once review is done."}
                </p>
                <button
                  id="toggle-completion-btn"
                  onClick={handleToggleComplete}
                  disabled={isPending || activeLesson.type === "QUIZ"}
                  className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded transition-all text-center flex justify-center items-center gap-1.5 ${
                    isCompleted
                      ? "bg-emerald-950/20 border border-emerald-900/30 text-emerald-400"
                      : "bg-brand-blue-electric text-white hover:bg-brand-blue-bright shadow-lg shadow-brand-blue-electric/10"
                  } disabled:opacity-50`}
                >
                  <CheckCircle className="h-4 w-4" />
                  {isPending ? "Updating..." : isCompleted ? "Completed" : "Mark Complete"}
                </button>
                {activeLesson.type === "QUIZ" && (
                  <p className="text-[9px] text-brand-text-secondary-gray mt-1 text-center italic">
                    Quiz lessons are completed automatically upon passing.
                  </p>
                )}
              </div>
            </div>
          ) : activeTab === "notes" ? (
            <div className="h-full flex flex-col justify-between pb-6">
              <div className="space-y-4 flex-grow flex flex-col">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-brand-text-secondary-gray uppercase font-bold tracking-wider">Lesson Notes</span>
                  <span className="text-brand-text-secondary-gray">{saveStatus}</span>
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => {
                    setNoteContent(e.target.value);
                    setSaveStatus("Unsaved changes");
                  }}
                  rows={10}
                  className="w-full flex-grow p-3 text-xs bg-brand-black-deep rounded border border-white/[0.08] text-brand-text-white focus:outline-none focus:border-brand-blue-electric resize-none"
                  placeholder="Jot down notes, chart links, or checklist points for this lesson..."
                />
                <button
                  onClick={saveNote}
                  className="flex items-center justify-center gap-1.5 py-2 w-full text-xs font-bold uppercase tracking-wider rounded bg-white/[0.04] text-brand-text-white border border-white/[0.08] hover:bg-white/[0.08]"
                >
                  <Save className="h-4 w-4" />
                  Save Note
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-brand-text-secondary-gray uppercase tracking-widest block">
                Downloads & PDFs
              </span>
              
              <div className="space-y-3.5">
                <a 
                  href="/resources/bkmsfx_checklist.pdf" 
                  download 
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Mock Resource Download: BKMSFX Market Structure Checklist.pdf has been downloaded successfully!");
                  }}
                  className="flex items-center justify-between p-3 rounded bg-brand-black-deep border border-white/[0.04] text-xs hover:border-brand-gold-premium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-brand-gold-premium shrink-0" />
                    <span className="text-brand-text-primary-gray">Trading Checklist PDF</span>
                  </div>
                  <Download className="h-4 w-4 text-brand-text-secondary-gray" />
                </a>

                <a 
                  href="/resources/bkmsfx_journal.xlsx" 
                  download 
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Mock Resource Download: BKMSFX Position Size Calculator & Journal.xlsx has been downloaded successfully!");
                  }}
                  className="flex items-center justify-between p-3 rounded bg-brand-black-deep border border-white/[0.04] text-xs hover:border-brand-gold-premium transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-brand-gold-premium shrink-0" />
                    <span className="text-brand-text-primary-gray">Calculator Excel Sheet</span>
                  </div>
                  <Download className="h-4 w-4 text-brand-text-secondary-gray" />
                </a>
              </div>
            </div>
          )}
        </div>
      </aside>

    </div>
  );
}
