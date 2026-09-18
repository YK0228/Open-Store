import { useState } from "react";
import {
  Coffee,
  CakeSlice,
  ShoppingBag,
  CupSoda,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Briefcase,
  AlertCircle,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkle,
} from "lucide-react";
import { UserProfile, StoreCategory, WorkStatus, WeeklyHours } from "../types";
import { STORE_TYPES } from "../data/storeData";

interface DiagnosticQuizProps {
  initialProfile: UserProfile;
  onComplete: (profile: UserProfile) => void;
}

export function DiagnosticQuiz({ initialProfile, onComplete }: DiagnosticQuizProps) {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calcProgressText, setCalcProgressText] = useState<string>("");

  const storeIcons: Record<string, React.ReactNode> = {
    Coffee: <Coffee className="h-6 w-6 text-amber-700" />,
    CakeSlice: <CakeSlice className="h-6 w-6 text-rose-600" />,
    ShoppingBag: <ShoppingBag className="h-6 w-6 text-emerald-700" />,
    CupSoda: <CupSoda className="h-6 w-6 text-blue-600" />,
    Sparkles: <Sparkles className="h-6 w-6 text-purple-600" />,
    UtensilsCrossed: <UtensilsCrossed className="h-6 w-6 text-orange-600" />,
  };

  const handleSelectStore = (category: StoreCategory) => {
    const matched = STORE_TYPES.find((s) => s.id === category);
    setProfile((prev) => ({
      ...prev,
      storeType: category,
      storeTypeName: matched ? matched.name : prev.storeTypeName,
      targetBudget: matched ? Math.round((matched.typicalBudgetMin + matched.typicalBudgetMax) / 2) : prev.targetBudget,
    }));
  };

  const handleStartAnalysis = () => {
    setIsCalculating(true);
    setCalcProgressText("正在分析店型與商圈水電法規門檻...");

    setTimeout(() => {
      setCalcProgressText("正在比對 2025-2026 經濟部青年創業貸款與地方政策補助...");
    }, 800);

    setTimeout(() => {
      setCalcProgressText("正在生成從 0 到 1 專屬籌備時間軸與避坑指南...");
    }, 1600);

    setTimeout(() => {
      setIsCalculating(false);
      onComplete(profile);
    }, 2400);
  };

  const toggleConcern = (concern: string) => {
    setProfile((prev) => {
      const exists = prev.concerns.includes(concern);
      return {
        ...prev,
        concerns: exists
          ? prev.concerns.filter((c) => c !== concern)
          : [...prev.concerns, concern],
      };
    });
  };

  const currentCapitalGap = Math.max(0, profile.targetBudget - profile.ownFunds);
  const ownRatioPercent = Math.min(100, Math.round((profile.ownFunds / (profile.targetBudget || 1)) * 100));

  if (isCalculating) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/10 ring-4 ring-amber-500/20">
          <Sparkle className="h-12 w-12 animate-spin text-amber-600 duration-1000" />
          <div className="absolute inset-0 rounded-3xl border border-amber-400/40 animate-ping opacity-25" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-stone-900">
          AI 正在為你客製專屬開店體檢報告...
        </h2>
        <p className="max-w-md text-sm font-medium text-stone-600">
          {calcProgressText}
        </p>
        <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-stone-200">
          <div className="h-full animate-pulse bg-gradient-to-r from-amber-500 to-amber-600 w-3/4 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      {/* Top Banner for Quiet Quitters */}
      <div className="mb-8 rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50 via-stone-50 to-orange-50/50 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-200/70 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
              <Sparkles className="h-3 w-3" />
              無痛起步・5 分鐘線上體檢
            </span>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              給處於「安靜離職」與「準備跨出體制」的你
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              在通勤或會議碎片時間，釐清你的開店資金缺口、可申請之政策貸款與專屬從 0 到 1 籌備時間軸。
            </p>
          </div>
          <div className="mt-3 flex items-center gap-2 sm:mt-0">
            <span className="text-xs font-semibold text-stone-500">進度</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    step >= i
                      ? "w-8 bg-amber-600"
                      : "w-4 bg-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-stone-700">
              {step} / 4
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: Store Type */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Step 1 of 4
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                你想開哪種類型的小店？
              </h2>
            </div>
            <span className="text-xs text-stone-500">選擇最符合你目前造夢的型態</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {STORE_TYPES.map((store) => {
              const isSelected = profile.storeType === store.id;
              return (
                <div
                  key={store.id}
                  id={`store-type-${store.id}`}
                  onClick={() => handleSelectStore(store.id)}
                  className={`group relative flex cursor-pointer flex-col justify-between rounded-xl border p-5 transition-all ${
                    isSelected
                      ? "border-amber-600 bg-amber-50/40 ring-2 ring-amber-600/30 shadow-sm"
                      : "border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="rounded-lg bg-stone-100 p-2.5 group-hover:bg-amber-100/70 transition-colors">
                        {storeIcons[store.iconName] || <Coffee className="h-6 w-6 text-amber-700" />}
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-amber-600" />
                      )}
                    </div>
                    <h3 className="mt-3 text-base font-bold text-stone-900">
                      {store.name}
                    </h3>
                    <p className="mt-1 text-xs text-stone-600 line-clamp-2">
                      {store.tagline}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-stone-100 pt-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>一般市場預算</span>
                      <span className="font-semibold text-stone-800">
                        約 {store.typicalBudgetMin} - {store.typicalBudgetMax} 萬
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-stone-500">
                      <span>建議規模</span>
                      <span className="font-medium text-stone-700">{store.minScale}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              id="step1-next-btn"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors"
            >
              <span>下一步：規模與預計商圈</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Scale and Region */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Step 2 of 4
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                預計店面空間大小與理想商圈
              </h2>
            </div>
            <span className="text-xs text-stone-500">影響租押金、裝潢水電與法規登記</span>
          </div>

          {/* Scale options */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-800">
              店面預計室內坪數規模
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "極簡微型 (3-6 坪)", sub: "純外帶、外送窗口、小檔口" },
                { label: "獨立小館 (7-12 坪)", sub: "6-14 席內用、單人作業最適" },
                { label: "精緻氛圍 (13-20 坪)", sub: "15-25 席、完整氛圍展示" },
                { label: "複合旗艦 (20 坪以上)", sub: "餐飲+展演或多功能美學" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setProfile({ ...profile, storeScale: item.label })}
                  className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                    profile.storeScale === item.label
                      ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/30 font-semibold"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <span className="text-sm font-bold text-stone-900">
                    {item.label}
                  </span>
                  <span className="mt-1 text-xs text-stone-500">
                    {item.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Region options */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold text-stone-800">
              預計落腳的商圈特性
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                {
                  id: "都會捷運核心商圈",
                  desc: "人流極大、過路客多、租金高、翻桌率與出單速度要求極高",
                },
                {
                  id: "生活感文青社區巷弄",
                  desc: "常客複購強、租金適中、需做好排煙隔音以維繫鄰里關係",
                },
                {
                  id: "中南部/二線精選街區",
                  desc: "坪效寬敞、空間個性強、自帶在地打卡與週末外地客效益",
                },
              ].map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => setProfile({ ...profile, region: loc.id })}
                  className={`flex flex-col rounded-xl border p-4 text-left transition-all ${
                    profile.region === loc.id
                      ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/30"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-bold text-stone-900">
                      {loc.id}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-stone-600 leading-relaxed">
                    {loc.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>上一步</span>
            </button>
            <button
              id="step2-next-btn"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors"
            >
              <span>下一步：自有資金與預算試算</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Financials */}
      {step === 3 && (
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Step 3 of 4
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                自有資金與開店預算試算
              </h2>
            </div>
            <span className="text-xs text-stone-500">真實面對數字，精準媒合政策融資</span>
          </div>

          {/* Interactive Calculation Card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-xs">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Own funds slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-800">
                    目前預計投入的「自有積蓄資金」
                  </label>
                  <span className="text-lg font-extrabold text-amber-700">
                    NT$ {profile.ownFunds} 萬元
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={250}
                  step={5}
                  value={profile.ownFunds}
                  onChange={(e) =>
                    setProfile({ ...profile, ownFunds: Number(e.target.value) })
                  }
                  className="mt-3 w-full accent-amber-600 cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-xs text-stone-600">
                  <span>NT$ 10 萬</span>
                  <span>100 萬</span>
                  <span>250 萬+</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[30, 60, 90, 120, 160].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setProfile({ ...profile, ownFunds: amt })}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        profile.ownFunds === amt
                          ? "bg-amber-700 text-white"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {amt} 萬
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Budget slider */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-stone-800">
                    預估開店「總啟動預算」
                  </label>
                  <span className="text-lg font-extrabold text-stone-900">
                    NT$ {profile.targetBudget} 萬元
                  </span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={350}
                  step={5}
                  value={profile.targetBudget}
                  onChange={(e) =>
                    setProfile({ ...profile, targetBudget: Number(e.target.value) })
                  }
                  className="mt-3 w-full accent-stone-900 cursor-pointer"
                />
                <div className="mt-2 flex justify-between text-xs text-stone-600">
                  <span>NT$ 30 萬</span>
                  <span>150 萬</span>
                  <span>350 萬+</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {[60, 100, 140, 180, 240].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setProfile({ ...profile, targetBudget: amt })}
                      className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                        profile.targetBudget === amt
                          ? "bg-stone-900 text-white"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                      }`}
                    >
                      {amt} 萬
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Instant gap preview banner */}
            <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs text-stone-500">自有資金健康佔比</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-stone-900">
                        {ownRatioPercent}%
                      </span>
                      <span className="text-xs text-stone-600">
                        ({profile.ownFunds} 萬 / 總預算 {profile.targetBudget} 萬)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-2 sm:border-t-0 sm:pt-0 sm:text-right">
                  <span className="text-xs text-stone-500">
                    {currentCapitalGap > 0 ? "需政策融資補足之缺口" : "資金充裕狀態"}
                  </span>
                  <div className="text-lg font-extrabold text-amber-700">
                    {currentCapitalGap > 0 ? (
                      `NT$ ${currentCapitalGap} 萬元`
                    ) : (
                      <span className="text-emerald-700">100% 自有資金無缺口</span>
                    )}
                  </div>
                  {currentCapitalGap > 0 && (
                    <span className="text-[11px] text-stone-500">
                      可透過「青創貸款 100 萬免保人」無痛補足
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>上一步</span>
            </button>
            <button
              id="step3-next-btn"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors"
            >
              <span>下一步：職業狀態與避坑盲區</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Career Status & Concerns */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="flex items-baseline justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Step 4 of 4
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                目前狀態、每週投入時間與最擔心的地雷
              </h2>
            </div>
            <span className="text-xs text-stone-500">量身定制心理與籌備步調</span>
          </div>

          {/* Work status */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-800">
              你目前的就業 / 心理狀態
            </label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  id: "quiet_quitting",
                  title: "安靜離職摸索中",
                  desc: "在職但內心已抽離，利用上班摸魚與通勤時間尋找人生自主權",
                },
                {
                  id: "fulltime_looking",
                  title: "全職上班族謹慎觀望",
                  desc: "有穩定正職收入，需有 80% 以上勝率與資金規劃才敢請辭",
                },
                {
                  id: "side_hustling",
                  title: "已有副業 / 斜槓接案",
                  desc: "已有小規模產品或客群，準備獨立開設實體體驗小店",
                },
                {
                  id: "resigned_prep",
                  title: "已離職 / 全力籌備中",
                  desc: "時間充裕，急需有系統的 0 到 1 時間軸避免無謂空轉燒錢",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setProfile({ ...profile, currentStatus: item.id as WorkStatus })
                  }
                  className={`flex flex-col items-start rounded-xl border p-4 text-left transition-all ${
                    profile.currentStatus === item.id
                      ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/30"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-amber-700" />
                    <span className="text-sm font-bold text-stone-900">
                      {item.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-stone-600">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Weekly Hours */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold text-stone-800">
              每週目前能投入的籌備時間
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "5-10", label: "5 - 10 小時", sub: "通勤與零碎空檔" },
                { id: "10-20", label: "10 - 20 小時", sub: "下班晚間 + 週末衝刺" },
                { id: "30+", label: "30 小時以上", sub: "全職高強度推進" },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() =>
                    setProfile({ ...profile, weeklyHours: h.id as WeeklyHours })
                  }
                  className={`flex flex-col rounded-xl border p-3 text-center transition-all ${
                    profile.weeklyHours === h.id
                      ? "border-amber-600 bg-amber-50/50 ring-2 ring-amber-600/30 font-bold"
                      : "border-stone-200 bg-white hover:border-stone-300"
                  }`}
                >
                  <span className="text-sm font-bold text-stone-900">{h.label}</span>
                  <span className="mt-1 text-xs text-stone-500">{h.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Concerns / Pitfall anxieties */}
          <div className="space-y-3 pt-2">
            <label className="block text-sm font-semibold text-stone-800">
              你目前最擔心的開店「深水區」（可複選）
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {[
                "裝潢水電報價不透明，被統包廠商當肥羊宰割",
                "政策補助與青創貸款如天書，不知道如何合法申請",
                "簽了租約才發現無法辦理營業登記或被鄰居檢舉油煙",
                "一人顧店精力耗盡，不懂現代 POS 與自動化點餐工具",
                "開幕前幾個月營收不如預期，資金斷鏈燒光積蓄",
              ].map((c) => {
                const checked = profile.concerns.includes(c);
                return (
                  <div
                    key={c}
                    onClick={() => toggleConcern(c)}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-xs sm:text-sm transition-all ${
                      checked
                        ? "border-amber-600 bg-amber-50/40 text-stone-900 font-semibold"
                        : "border-stone-200 bg-white text-stone-700 hover:border-stone-300"
                    }`}
                  >
                    <div
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                        checked
                          ? "border-amber-600 bg-amber-600 text-white"
                          : "border-stone-300 bg-white"
                      }`}
                    >
                      {checked && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                    <span>{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>上一步</span>
            </button>
            <button
              id="finish-quiz-btn"
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-7 py-3.5 text-sm font-bold text-white shadow-md hover:bg-amber-700 transition-colors ring-2 ring-amber-600/30"
            >
              <Sparkles className="h-4 w-4" />
              <span>生成我的開店體檢報告與時間軸</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
