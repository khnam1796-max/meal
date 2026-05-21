import { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Bell,
  CalendarDays,
  Heart,
  Sun,
  Moon,
  ChevronRight,
  User,
  Plus,
  Settings,
  LogOut,
  Calculator,
  MessageSquare,
  Leaf,
  AlertTriangle,
  Check,
  ThumbsUp,
  Award,
  BookOpen
} from 'lucide-react';
import { MealData, DishDetail } from './types';
import {
  getTodayKST,
  formatKoreanDate,
  formatDateKey,
  getWeekDates,
  getWeekOfMonth,
  getDefaultSelectedDate,
  getKoreanDayOfWeekShort,
  getKoreanDayOfWeek
} from './utils';
import { generateMockMealData } from './mockData';

export default function App() {
  // Current time in Korea Standard Time
  const todayKST = useMemo(() => getTodayKST(), []);
  
  // Detect if today is a weekend
  const isWeekendObj = useMemo(() => {
    const day = todayKST.getDay();
    return day === 0 || day === 6; // 0: Sunday, 6: Saturday
  }, [todayKST]);

  // Determine the primary display date for the Home view
  // Under "방식 B": over weekends, automatically showcase upcoming Monday's menu and mark with a badge.
  const displayDateForHome = useMemo(() => {
    if (isWeekendObj) {
      const nextMon = new Date(todayKST);
      const day = todayKST.getDay();
      const offset = day === 0 ? 1 : 2; // Sunday -> Monday (+1), Saturday -> Monday (+2)
      nextMon.setDate(todayKST.getDate() + offset);
      return nextMon;
    }
    return todayKST;
  }, [todayKST, isWeekendObj]);

  // Generate dynamic mock meals based on the current active week
  const weekDates = useMemo(() => {
    // If today is weekend, generate data for the upcoming Monday's week to prevent empty UI
    const referenceDate = isWeekendObj ? displayDateForHome : todayKST;
    return getWeekDates(referenceDate);
  }, [todayKST, isWeekendObj, displayDateForHome]);

  const mockMeals = useMemo(() => {
    return generateMockMealData(weekDates);
  }, [weekDates]);

  // Active Tab: 'home' | 'diet' | 'calc' | 'profile'
  const [activeTab, setActiveTab] = useState<'home' | 'diet' | 'calc' | 'profile'>('home');

  // Selected Date for the "식단표" Weekly table and default selection
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    return getDefaultSelectedDate(todayKST);
  });

  // Selected date key for querying mock data
  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);

  // Nutrition Calculator states
  const [calcMealType, setCalcMealType] = useState<'lunch' | 'dinner'>('lunch');
  const [checkedDishes, setCheckedDishes] = useState<Record<string, boolean>>({});
  const [calcCategory, setCalcCategory] = useState<string>('전체');

  // Load and pre-check all dishes of the default meal in the Calculator
  const calcActiveMeal = useMemo(() => {
    return mockMeals.find(m => m.dateKey === selectedDateKey && m.mealType === calcMealType);
  }, [mockMeals, selectedDateKey, calcMealType]);

  useEffect(() => {
    if (calcActiveMeal) {
      const initialChecked: Record<string, boolean> = {};
      calcActiveMeal.dishDetails.forEach(dish => {
        initialChecked[dish.name] = true;
      });
      setCheckedDishes(initialChecked);
    }
  }, [calcActiveMeal]);

  // Profile status states
  const [allergyAlarm, setAllergyAlarm] = useState<boolean>(true);
  const [dailyMenuAlarm, setDailyMenuAlarm] = useState<boolean>(true);
  const [userAllergens, setUserAllergens] = useState<string[]>(["우유", "땅콩"]);
  const [newAllergen, setNewAllergen] = useState<string>('');
  const [isAddingAllergen, setIsAddingAllergen] = useState<boolean>(false);

  // Home Screen calculations
  const homeDisplayDateKey = useMemo(() => formatDateKey(displayDateForHome), [displayDateForHome]);
  const homeLunch = useMemo(() => mockMeals.find(m => m.dateKey === homeDisplayDateKey && m.mealType === 'lunch'), [mockMeals, homeDisplayDateKey]);
  const homeDinner = useMemo(() => mockMeals.find(m => m.dateKey === homeDisplayDateKey && m.mealType === 'dinner'), [mockMeals, homeDisplayDateKey]);

  // Favorite hero status
  const [isHeroFavorite, setIsHeroFavorite] = useState<boolean>(false);

  // Save Calculator results mock feedback
  const [isSavedFeedback, setIsSavedFeedback] = useState<boolean>(false);

  // Filtered dishes for Screen 3
  const filteredDishesInCalc = useMemo(() => {
    if (!calcActiveMeal) return [];
    if (calcCategory === '전체') return calcActiveMeal.dishDetails;
    return calcActiveMeal.dishDetails.filter(dish => {
      if (calcCategory === '밥류' && dish.category === 'rice') return true;
      if (calcCategory === '국/찌개' && dish.category === 'soup') return true;
      if (calcCategory === '반찬' && dish.category === 'side') return true;
      if (calcCategory === '디저트' && dish.category === 'dessert') return true;
      return false;
    });
  }, [calcActiveMeal, calcCategory]);

  // Sum nutrition values for checked dishes
  const calcTotals = useMemo(() => {
    const totals = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
    if (!calcActiveMeal) return totals;

    calcActiveMeal.dishDetails.forEach(dish => {
      if (checkedDishes[dish.name]) {
        totals.kcal += dish.kcal;
        totals.protein += dish.protein;
        totals.carbs += dish.carbs;
        totals.fat += dish.fat;
      }
    });
    return totals;
  }, [calcActiveMeal, checkedDishes]);

  // Function to add custom allergens
  const handleAddAllergen = () => {
    if (newAllergen.trim() && !userAllergens.includes(newAllergen.trim())) {
      setUserAllergens([...userAllergens, newAllergen.trim()]);
      setNewAllergen('');
      setIsAddingAllergen(false);
    }
  };

  // Profile action simulations
  const handleProfileButton = (message: string) => {
    alert(message);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex justify-center pb-24">
      {/* Container simulating a polished mobile native app shell */}
      <div className="w-full max-w-md bg-background min-h-screen flex flex-col relative shadow-[0px_0px_50px_rgba(79,111,0,0.15)] bg-[#fff8f3]">
        
        {/* TopAppBar */}
        <header className="sticky top-0 w-full z-50 bg-[#fff8f3]/95 backdrop-blur-md px-container-margin py-3 border-b border-[#c4c9b4]/20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <Utensils className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-primary font-headline-md">씨마스고등학교 급식</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('calc')}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${activeTab === 'calc' ? 'bg-secondary-container text-primary font-bold shadow-sm' : 'hover:bg-[#f3e6d7]/50 text-on-surface-variant'}`}
            >
              <Calculator className="w-4 h-4" />
            </button>
            <button 
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#f3e6d7]/50 text-on-surface-variant relative transition-transform active:scale-95"
              onClick={() => {
                alert("알림 메시지가 없습니다. 오늘의 건강 급식을 즐겨보세요! 🍏");
              }}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Dynamic content rendering according to the tab state */}
        <main className="flex-1 px-container-margin py-4 overflow-y-auto space-y-5">
          
          {/* TAB 1: HOME SCREEN */}
          {activeTab === 'home' && (
            <div className="space-y-5 select-none transition-all duration-300">
              
              {/* Hero Meal Card */}
              <section className="relative w-full rounded-lg overflow-hidden meal-card-shadow border border-[#c4c9b4]/20 bg-white group shadow-[0px_4px_20px_rgba(79,111,0,0.08)]">
                {/* Header overlay */}
                <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-semibold shadow-md inline-flex items-center gap-1">
                    <Award className="w-3 h-3" /> 오늘의 추천 급식
                  </span>
                  
                  {/* Weekend Flag Indicator representing "방식 B" */}
                  {isWeekendObj && (
                    <span className="bg-[#ba1a1a] text-white px-2.5 py-0.5 rounded-md text-[10px] font-bold shadow-sm animate-pulse">
                      다음 급식일 (월요일) 예정안내
                    </span>
                  )}
                </div>

                {/* Favorite Toggle button */}
                <div className="absolute top-4 right-4 z-10">
                  <button 
                    onClick={() => setIsHeroFavorite(!isHeroFavorite)}
                    className="w-9 h-9 rounded-full bg-white/75 backdrop-blur-md flex items-center justify-center text-[#3c5500] active:scale-90 transition-transform shadow-md"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isHeroFavorite ? 'fill-error text-error' : 'text-primary'}`} />
                  </button>
                </div>

                {/* Cover Image container */}
                <div className="h-60 w-full relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    alt="치즈돈까스 정식"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8Va0yB2P6SjidlTgyY25QmJtzPL_w3ZDq89Rj6lD0bp8kFciYyRh837wzSkTPZiGM4E44p4nLS4RvWEoT3DIedlcxS4QMEwESBUqiFgriThfBumwO2aI7puG-9L3feSWY34ocbbMyAY34g7pGFW3vnwJFSJ6LuCnbS9C4ld9ZBorNJ9BQEQU0xOsixC5z4Nz_UlXJ37lSxAF64NvE7tgpvsvdJVo3FjaFx05jxusARPqoDXOephNrYNz0-dgDVDThwakbGNdHmc4"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>
                </div>

                {/* Overlay Text info targeting exact date dynamic substitution */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-xs text-[#c9f07c] font-semibold mb-1 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3" />
                    {formatKoreanDate(displayDateForHome)}
                  </p>
                  <div className="flex justify-between items-end gap-1">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight text-white font-headline-lg-mobile">
                        {homeLunch?.title || "치즈돈까스 정식"}
                      </h2>
                      <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                        바삭한 튀김 옷 속에 고소하고 늘어나는 자연산 모짜렐라 치즈 가득!
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-secondary-fixed text-[#c9f17c] font-black text-lg block">
                        {homeLunch?.totalCalories || 845} <span className="text-xs font-normal text-white/90">kcal</span>
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dynamic Lunch Card */}
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-headline-md text-primary font-bold flex items-center gap-1.5 text-base">
                    <Sun className="w-4 h-4 text-primary" /> 중식
                  </h3>
                  <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-xs font-semibold">
                    {homeLunch?.totalCalories || 845} kcal
                  </span>
                </div>
                <div className="bg-white p-4 rounded-lg meal-card-shadow border border-[#c4c9b4]/20">
                  <div className="space-y-3">
                    <p className="text-on-surface text-base font-medium leading-relaxed">
                      {homeLunch?.dishes?.join(', ') || '친환경현미밥, 쇠고기미역국, 치즈돈까스, 매콤돈육강정, 숙주미나리무침, 배추김치'}
                    </p>
                    
                    {/* Allergy warnings mapping */}
                    <div className="pt-2.5 border-t border-[#c4c9b4]/20 flex flex-col gap-1">
                      <p className="text-[10px] font-semibold text-outline">알레르기 유발 물질</p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {homeLunch?.allergens.map((alg, index) => (
                          <span 
                            key={index} 
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${userAllergens.includes(alg) ? 'bg-[#ffdad6] text-[#ba1a1a] font-bold border border-[#ffdad6]' : 'bg-surface-container-high text-[#3c5500]'}`}
                          >
                            {alg} {userAllergens.includes(alg) && "⚠️"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Dynamic Dinner Card */}
              <section className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="font-headline-md text-tertiary font-bold flex items-center gap-1.5 text-base">
                    <Moon className="w-4 h-4 text-tertiary" /> 석식
                  </h3>
                  <span className="bg-[#dde8b2] text-[#414b23] px-3 py-0.5 rounded-full text-xs font-semibold">
                    {homeDinner?.totalCalories || 720} kcal
                  </span>
                </div>
                <div className="bg-white p-4 rounded-lg meal-card-shadow border border-[#c4c9b4]/20">
                  <div className="space-y-3">
                    <p className="text-on-surface text-base font-medium leading-relaxed">
                      {homeDinner?.dishes?.join(', ') || '참치마요덮밥, 유부장국, 매콤떡볶이, 깍두기, 요구르트'}
                    </p>

                    {/* Allergens warning panel */}
                    <div className="pt-2.5 border-t border-[#c4c9b4]/20 flex flex-col gap-1">
                      <p className="text-[10px] font-semibold text-outline">알레르기 유발 물질</p>
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {homeDinner?.allergens.map((alg, index) => (
                          <span 
                            key={index} 
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${userAllergens.includes(alg) ? 'bg-[#ffdad6] text-[#ba1a1a] font-bold border border-[#ffdad6]' : 'bg-surface-container-high text-tertiary'}`}
                          >
                            {alg} {userAllergens.includes(alg) && "⚠️"}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Quick statistics Bento Grid */}
              <section className="grid grid-cols-2 gap-3 pb-2">
                <div className="bg-secondary-container/30 p-4 rounded-lg border border-[#d2ea7a]/30 flex flex-col justify-between aspect-square">
                  <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-[#576a00]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#576a00] font-bold">오늘 권장 섭취 열량</p>
                    <h4 className="text-xl font-bold font-display-lg text-[#3c5500] mt-0.5">
                      {((homeLunch?.totalCalories || 0) + (homeDinner?.totalCalories || 0)).toLocaleString()} <span className="text-xs font-normal text-on-surface">kcal</span>
                    </h4>
                  </div>
                </div>

                <div className="bg-primary-container/10 p-4 rounded-lg border border-[#c9f17c]/20 flex flex-col justify-between aspect-square">
                  <button 
                    onClick={() => {
                      alert("식단 평가가 등록되었습니다! 양질의 식단 서비스를 지원하겠습니다.");
                    }}
                    className="w-8 h-8 rounded-full bg-white/85 flex items-center justify-center text-primary group-hover:scale-105 transition-all self-start active:scale-95"
                  >
                    <ThumbsUp className="w-4 h-4 text-primary" />
                  </button>
                  <div>
                    <p className="text-[10px] text-primary font-bold">이번주 식단 만족도</p>
                    <h4 className="text-xl font-bold text-[#3c5500] mt-0.5">
                      4.9 <span className="text-xs font-normal text-on-surface-variant">/ 5.0</span>
                    </h4>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* TAB 2: WEEKLY SCHEDULE SCREEN */}
          {activeTab === 'diet' && (
            <div className="space-y-4 select-none animate-in fade-in duration-300">
              
              {/* Header section with dynamic date week formula */}
              <section className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#3c5500] uppercase tracking-wider">주간 정량 식사 계획</span>
                  <span className="text-xs text-on-surface-variant text-right font-medium text-primary">씨마스고등학교</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <h2 className="text-2xl font-bold tracking-tight text-on-background font-headline-lg">
                    {getWeekOfMonth(selectedDate)}
                  </h2>
                  <button 
                    onClick={() => {
                      setSelectedDate(getDefaultSelectedDate(todayKST));
                      alert("오늘 날짜 주로 복귀하였습니다!");
                    }}
                    className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-outline-variant/30 font-semibold text-xs text-on-surface-variant hover:text-primary active:scale-90 transition-all shadow-sm"
                  >
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>오늘 주로 복귀</span>
                  </button>
                </div>
              </section>

              {/* WeekDateSelector - Automating 월~금 calculations with real dates */}
              <section className="bg-white p-2 rounded-2xl border border-outline-variant/30 shadow-[0px_4px_15px_rgba(79,111,0,0.03)] selection:bg-none">
                <div className="flex justify-between gap-1.5">
                  {weekDates.map((dateObj, i) => {
                    const dowShort = getKoreanDayOfWeekShort(dateObj);
                    const dayNum = dateObj.getDate();
                    const isSelected = formatDateKey(dateObj) === selectedDateKey;
                    const isToday = formatDateKey(dateObj) === formatDateKey(todayKST);

                    return (
                      <button 
                        key={i}
                        onClick={() => setSelectedDate(dateObj)}
                        className={`flex-1 flex flex-col items-center py-3 rounded-xl transition-all duration-200 active:scale-95 ${isSelected ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.03] font-bold' : 'bg-transparent text-on-surface hover:bg-[#fff8f3]'}`}
                      >
                        <span className={`text-[10px] font-semibold mb-1 ${isSelected ? 'text-white/80' : 'text-on-surface-variant'}`}>
                          {dowShort}
                        </span>
                        <span className="text-base font-bold">
                          {dayNum}
                        </span>
                        {isToday && !isSelected && (
                          <span className="w-1 h-1 bg-primary rounded-full mt-1"></span>
                        )}
                        {isSelected && (
                          <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Display menus for the selected weekday */}
              <div className="space-y-4">
                {/* Find meals for specific active day */}
                {(() => {
                  const dayLunch = mockMeals.find(m => m.dateKey === selectedDateKey && m.mealType === 'lunch');
                  const dayDinner = mockMeals.find(m => m.dateKey === selectedDateKey && m.mealType === 'dinner');

                  if (!dayLunch && !dayDinner) {
                    return (
                      <div className="p-10 text-center bg-white rounded-lg border border-outline-variant/20 text-on-surface-variant text-sm">
                        식단 정보가 등록되어 있지 않습니다.
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      
                      {/* Lunch card */}
                      <article className="bg-white rounded-lg p-4 shadow-[0px_4px_20px_rgba(79,111,0,0.08)] relative overflow-hidden border border-outline-variant/20">
                        <div className="absolute top-4 right-4">
                          <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-xs font-semibold">
                            {dayLunch?.totalCalories || 850} kcal
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <Sun className="w-4 h-4 text-primary" />
                            <h3 className="text-base font-bold text-primary font-headline-md">중식</h3>
                          </div>
                          <p className="text-on-surface text-base font-semibold leading-relaxed">
                            {dayLunch?.dishes.join(', ')}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {dayLunch?.allergens.map((alg, index) => (
                              <span key={index} className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-[10px] font-medium border border-outline-variant/10">
                                {alg}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Nutrition targets rate indicator */}
                        <div className="pt-3 border-t border-outline-variant/30">
                          <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="font-semibold text-on-surface-variant">단백질 달성률</span>
                            <span className="font-bold text-primary">
                              {dayLunch ? Math.round((dayLunch.nutrition.protein / dayLunch.nutrition.proteinTarget) * 100) : 0}% ({dayLunch?.nutrition.protein}g)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-secondary-container/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full transition-all duration-500" 
                              style={{ width: `${dayLunch ? Math.min(100, Math.round((dayLunch.nutrition.protein / dayLunch.nutrition.proteinTarget) * 100)) : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </article>

                      {/* Dinner card */}
                      <article className="bg-white rounded-lg p-4 shadow-[0px_4px_20px_rgba(79,111,0,0.08)] relative overflow-hidden border border-outline-variant/20">
                        <div className="absolute top-4 right-4">
                          <span className="bg-[#dde8b2] text-tertiary px-3 py-0.5 rounded-full text-xs font-semibold">
                            {dayDinner?.totalCalories || 720} kcal
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <Moon className="w-4 h-4 text-tertiary" />
                            <h3 className="text-base font-bold text-tertiary font-headline-md">석식</h3>
                          </div>
                          <p className="text-on-surface text-base font-semibold leading-relaxed">
                            {dayDinner?.dishes.join(', ')}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {dayDinner?.allergens.map((alg, index) => (
                              <span key={index} className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-[10px] font-medium border border-outline-variant/10">
                                {alg}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Dinner Protein targets bar */}
                        <div className="pt-3 border-t border-outline-variant/30">
                          <div className="flex justify-between items-center mb-1 text-xs">
                            <span className="font-semibold text-on-surface-variant">단백질 달성률</span>
                            <span className="font-bold text-tertiary">
                              {dayDinner ? Math.round((dayDinner.nutrition.protein / dayDinner.nutrition.proteinTarget) * 100) : 0}% ({dayDinner?.nutrition.protein}g)
                            </span>
                          </div>
                          <div className="w-full h-2 bg-[#dde8b2]/50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-tertiary rounded-full transition-all duration-500" 
                              style={{ width: `${dayDinner ? Math.min(100, Math.round((dayDinner.nutrition.protein / dayDinner.nutrition.proteinTarget) * 100)) : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </article>

                    </div>
                  );
                })()}
              </div>

              {/* Expert quote & Info bento footer elements */}
              <section className="bg-primary-container text-on-primary-container p-4 rounded-xl flex items-start gap-4 shadow-[#4f6f00]/10 shadow-lg leading-relaxed">
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm text-[#c9f17c] flex items-center gap-1">
                    <span>영양사의 한마디 👩‍🍳</span>
                  </h4>
                  <p className="text-xs text-white opacity-95">
                    우리 식당은 모든 장류 및 배추김치 원재료를 국산 식자재로 정직하게 고집합니다. 성장기 청소년에 안전하고 균형 잡힌 가치를 제공합니다!
                  </p>
                </div>
              </section>

              {/* Campaign container block */}
              <section className="bg-secondary-container/40 text-on-secondary-container p-4 rounded-xl border border-[#d2ea7a]/30 flex items-center gap-3">
                <Leaf className="w-6 h-6 text-[#576a00] shrink-0" />
                <div>
                  <p className="text-xs font-bold text-[#3e4c00]">식품 낭비 방지 챌린지</p>
                  <p className="text-[11px] text-[#444939] mt-0.5">잔반 줄이기를 동참하여 푸른 지구의 건강을 지켜내요!</p>
                </div>
              </section>

            </div>
          )}

          {/* TAB 3: NUTRITION CALCULATOR PART */}
          {activeTab === 'calc' && (
            <div className="space-y-4 select-none animate-in fade-in duration-300">
              
              {/* Header block with Lunch/Dinner switch */}
              <section className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#3c5500] uppercase tracking-wider">스마트 식단 피트니스</span>
                  <span className="text-xs font-semibold text-primary">{formatKoreanDate(selectedDate)}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setCalcMealType('lunch');
                      setCalcCategory('전체');
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${calcMealType === 'lunch' ? 'bg-primary text-white shadow-md' : 'bg-white text-on-surface border border-[#c4c9b4]/20'}`}
                  >
                    중식 영양 분석
                  </button>
                  <button 
                    onClick={() => {
                      setCalcMealType('dinner');
                      setCalcCategory('전체');
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${calcMealType === 'dinner' ? 'bg-tertiary text-white shadow-md' : 'bg-white text-on-surface border border-[#c4c9b4]/20'}`}
                  >
                    석식 영양 분석
                  </button>
                </div>
              </section>

              {/* Dynamic calculated state circular representation matching exact specs */}
              <section className="bg-white rounded-lg p-4 meal-card-shadow border border-[#c4c9b4]/20 flex items-center gap-5">
                <div className="relative shrink-0 w-28 h-28 flex items-center justify-center rounded-full border-[6px] border-secondary-container">
                  <div className="text-center">
                    <span className="font-bold text-2xl text-secondary">{calcTotals.kcal}</span>
                    <span className="block text-[10px] text-on-surface-variant font-medium">kcal</span>
                  </div>
                </div>

                {/* Progress bars showing selected details */}
                <div className="flex-1 space-y-2.5">
                  {/* Carbs */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-semibold text-on-surface">탄수화물</span>
                      <span className="font-bold text-primary">{calcTotals.carbs}g / 300g</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary-container rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, Math.round((calcTotals.carbs / 300) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Protein */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-semibold text-on-surface">단백질</span>
                      <span className="font-bold text-primary">{calcTotals.protein}g / 65g</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary-container rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, Math.round((calcTotals.protein / 65) * 100))}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Fat */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span className="font-semibold text-on-surface">지방</span>
                      <span className="font-bold text-primary">{calcTotals.fat}g / 50g</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary-container rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${Math.min(100, Math.round((calcTotals.fat / 50) * 100))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Filtering Chips selectors */}
              <section className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
                {['전체', '밥류', '국/찌개', '반찬', '디저트'].map((cat, idx) => {
                  const isActive = calcCategory === cat;
                  return (
                    <button 
                      key={idx}
                      onClick={() => setCalcCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95 transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'bg-[#f3e6d7]/50 text-on-surface-variant'}`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </section>

              {/* List of constituent checkable dishes matching dynamic date calculations */}
              <section className="space-y-3 pb-6">
                {filteredDishesInCalc.map((dish, i) => {
                  const isChecked = !!checkedDishes[dish.name];
                  
                  return (
                    <div 
                      key={i}
                      onClick={() => {
                        setCheckedDishes(prev => ({
                          ...prev,
                          [dish.name]: !prev[dish.name]
                        }));
                      }}
                      className={`bg-white rounded-lg p-3.5 meal-card-shadow border flex justify-between items-center cursor-pointer transition-all active:scale-[0.99] ${isChecked ? 'border-primary ring-2 ring-primary-container/10' : 'border-[#c4c9b4]/20'}`}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#ede1d1] shrink-0">
                          <img className="w-full h-full object-cover" src={dish.imageUrl} alt={dish.name} referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">{dish.name}</h4>
                          <div className="flex gap-1.5 mt-1 items-center">
                            <span className="px-1.5 py-0.5 bg-secondary-container text-on-secondary-container text-[9px] font-bold rounded">
                              {dish.category === 'rice' ? '곡류' : dish.category === 'soup' ? '국/찌개' : dish.category === 'side' ? '반찬' : '디저트'}
                            </span>
                            <span className="text-[10px] text-outline font-semibold">
                              {dish.kcal} kcal
                            </span>
                          </div>
                          <p className="text-[10px] text-on-surface-variant/80 mt-0.5 line-clamp-1">{dish.description}</p>
                        </div>
                      </div>

                      {/* Checked visual indicators inside round container */}
                      <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all ${isChecked ? 'bg-primary text-white' : 'border border-outline-variant text-transparent'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}

                {filteredDishesInCalc.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#747967] bg-white rounded-lg border border-dashed border-[#c4c9b4]">
                    해당되는 카테고리의 구성 요리가 존재하지 않습니다.
                  </div>
                )}
              </section>

              {/* Store outcome bottom sticky mockup button with successful saved animation effect */}
              <div className="sticky bottom-2 w-full pt-1">
                <button 
                  onClick={() => {
                    setIsSavedFeedback(true);
                    setTimeout(() => {
                      setIsSavedFeedback(false);
                      alert("오늘의 섭취 식단 일지가 안전하게 저장되었습니다! 📝❤️");
                    }, 1000);
                  }}
                  className={`w-full py-3.5 rounded-full font-bold shadow-md flex items-center justify-center gap-1.5 text-sm transition-all text-white ${isSavedFeedback ? 'bg-[#536500]' : 'bg-primary active:scale-[0.98]'}`}
                >
                  <Check className="w-4 h-4" />
                  <span>{isSavedFeedback ? '완료되었습니다' : '계산 결과 저장하기'}</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS VIEW */}
          {activeTab === 'profile' && (
            <div className="space-y-4 select-none animate-in fade-in duration-300">
              
              {/* Profile card matching mock details */}
              <section className="bg-gradient-to-br from-white to-[#d2ea7a]/30 rounded-xl p-4 shadow-[0px_4px_20px_rgba(79,111,0,0.06)] relative overflow-hidden border border-[#c4c9b4]/20 flex items-center gap-4">
                <div className="relative shrink-0">
                  <img 
                    className="w-16 h-16 rounded-full border-2 border-white shadow-sm object-cover" 
                    alt="김학생"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeuRVZPbpFqZGE0wc6jklTU0pj1QFsjWRNzFTUHCidIimkmmY-5NJtvnAYp4wyCUMd27zjqB5D7a-F9xE7qcysrIfCCQaHxVHUEHjt0koFhB52iBahvneju8xMUQkQ9t7RrBIbgq6-KI4nMiyAGQkWPmG3wivIZ37RzXCMqcNavDwXROQ9ht6V3boCuzGXQwZz_T3B8ky5Ahd3JRK90JpZbxlsIBljXPiQ6UI4O1nlUTXacoSqZLHX5COwvzcCZ8QfSLCQx0PWBWw"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full shadow-md">
                    <Award className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-on-background">김학생</h2>
                  <p className="text-xs text-on-surface-variant font-medium">씨마스고등학교 · 2학년 3반 15번</p>
                </div>
              </section>

              {/* Allergy alert configure unit */}
              <section className="bg-white rounded-xl p-4 shadow-[0px_4px_15px_rgba(0,0,0,0.03)] border border-[#c4c9b4]/20 space-y-4">
                
                {/* 1. Allergy switch */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-on-surface flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
                      알레르기 경고 알림
                    </h3>
                    <p className="text-[11px] text-[#444939]">식단표에 알레르기 유발 유발 물질 포함 시 스마트 경고</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={allergyAlarm} 
                      onChange={() => setAllergyAlarm(!allergyAlarm)} 
                    />
                    <div className="w-10 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Allergen list chips tags */}
                {allergyAlarm && (
                  <div className="pt-1.5 space-y-2">
                    <div className="flex flex-wrap gap-1.5 items-center">
                      {userAllergens.map((alg, idx) => (
                        <span 
                          key={idx} 
                          className="px-2.5 py-1 bg-secondary-container text-on-secondary-container text-xs font-bold rounded-full inline-flex items-center gap-1"
                        >
                          <span>{alg}</span>
                          <button 
                            className="text-[#3c5500] hover:text-[#ba1a1a] scale-105"
                            onClick={() => setUserAllergens(userAllergens.filter(x => x !== alg))}
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {/* Display click state for writing custom tags */}
                      {isAddingAllergen ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="text"
                            placeholder="예: 돼지고기"
                            className="px-2 py-0.5 text-xs border border-primary rounded-md w-24 outline-none text-on-surface bg-white"
                            value={newAllergen}
                            onChange={(e) => setNewAllergen(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddAllergen()}
                          />
                          <button 
                            className="p-1 bg-primary text-white rounded-md text-xs font-bold"
                            onClick={handleAddAllergen}
                          >
                            추가
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setIsAddingAllergen(true)}
                          className="px-2.5 py-1 bg-[#ede1d1]/50 text-on-surface-variant text-xs font-bold rounded-full hover:bg-outline-variant/35 flex items-center gap-1 border border-outline-variant/20 transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" /> 새 알레르기 등록
                        </button>
                      )}
                    </div>
                  </div>
                )}

                <div className="h-[1px] bg-outline-variant/20"></div>

                {/* 2. Daily meal push alerts */}
                <div className="flex items-start justify-between pb-1">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-bold text-on-surface flex items-center gap-1">
                      <Bell className="w-4 h-4 text-primary" />
                      일일 식단 알림 push 서비스
                    </h3>
                    <p className="text-[11px] text-[#444939]">매일 오전 8시에 오늘의 식단 안내 push 메시지 발송</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={dailyMenuAlarm} 
                      onChange={() => setDailyMenuAlarm(!dailyMenuAlarm)} 
                    />
                    <div className="w-10 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </section>

              {/* Setting details buttons lists */}
              <section className="bg-white rounded-xl shadow-[0px_4px_15px_rgba(0,0,0,0.03)] border border-[#c4c9b4]/20 overflow-hidden text-sm">
                <button 
                  onClick={() => handleProfileButton("씨마스고등학교 고객안내 콜센터는 평일 오전 9시부터 6시까지 운영 중입니다.")}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-[#fff8f3] transition-colors text-left font-medium text-on-surface"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-on-surface-variant" /> 고객센터 / 자주 묻는 질문
                  </span>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                </button>
                <div className="h-[1px] mx-3.5 bg-outline-variant/20"></div>
                
                <button 
                  onClick={() => handleProfileButton("씨마스고등학교 모바일 급식 서비스 계약 관련 주간 정보 공정 이용약관 전문입니다.")}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-[#fff8f3] transition-colors text-left font-medium text-on-surface"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-on-surface-variant" /> 개인정보 처리방침 & 이용약관
                  </span>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                </button>
                <div className="h-[1px] mx-3.5 bg-outline-variant/20"></div>

                <button 
                  onClick={() => {
                    const confirmLeave = window.confirm("정말 로그아웃 하시겠습니까?");
                    if (confirmLeave) {
                      alert("로그아웃 되었습니다. 안전한 건강식단을 위해 다시 찾아주세요!");
                    }
                  }}
                  className="w-full flex items-center justify-between p-3.5 hover:bg-[#ffdad6]/20 transition-colors text-left font-semibold text-[#ba1a1a]"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4 text-[#ba1a1a]" /> 로그아웃
                  </span>
                </button>
              </section>

              {/* Version & Footer */}
              <footer className="text-center py-6 space-y-1 select-none">
                <p className="text-[11px] text-[#747967] font-semibold">© 2026 씨마스고등학교 급식</p>
                <p className="text-[10px] text-outline">건강하고 활기찬 영양 밸런스로 학업 성장을 응원합니다.</p>
              </footer>

            </div>
          )}

        </main>

        {/* Floating Chat / Consultation FAB Button mirroring design aesthetics */}
        <button 
          onClick={() => alert("씨마스고등학교 AI 영양사 및 고객 챗봇 서비스를 곧 개시합니다! 기대해 주세요 🥳")}
          className="fixed bottom-24 right-4 md:right-[calc(50%-190px)] w-12 h-12 bg-primary text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40 hover:brightness-110"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>

        {/* Global Bottom Navigation bar complying to brand guidelines */}
        <nav className="absolute bottom-0 left-0 right-0 w-full bg-[#fff8f3]/95 backdrop-blur-md flex justify-around items-center px-2 py-3 border-t border-[#c4c9b4]/20 rounded-t-2xl shadow-[0px_-4px_25px_rgba(79,111,0,0.06)] z-50">
          
          {/* Home Tab */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all duration-300 ${activeTab === 'home' ? 'bg-secondary-container text-primary rounded-xl font-bold shadow-sm scale-102' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <Utensils className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-1">홈</span>
          </button>

          {/* Table / Weekly Schedule Tab */}
          <button 
            onClick={() => {
              setActiveTab('diet');
              // Ensure selectedDate matches the default KST date on click
              setSelectedDate(getDefaultSelectedDate(todayKST));
            }}
            className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all duration-300 ${activeTab === 'diet' ? 'bg-secondary-container text-primary rounded-xl font-bold shadow-sm scale-102' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-1">식단표</span>
          </button>

          {/* Calculator Tab */}
          <button 
            onClick={() => {
              setActiveTab('calc');
              setSelectedDate(getDefaultSelectedDate(todayKST));
            }}
            className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all duration-300 ${activeTab === 'calc' ? 'bg-secondary-container text-primary rounded-xl font-bold shadow-sm scale-102' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-1">영양계산</span>
          </button>

          {/* Profile Tab */}
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center px-3 py-1.5 transition-all duration-300 ${activeTab === 'profile' ? 'bg-secondary-container text-primary rounded-xl font-bold shadow-sm scale-102' : 'text-on-surface-variant hover:text-primary'}`}
          >
            <User className="w-4 h-4" />
            <span className="text-[10px] font-semibold mt-1">프로필</span>
          </button>

        </nav>

      </div>
    </div>
  );
}
