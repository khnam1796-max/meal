import { MealData, DishDetail } from './types';
import { formatKoreanDate, formatDateKey, getKoreanDayOfWeekShort } from './utils';

// Static image pointers from mockup references
const IMAGE_RICE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBPuFOG24YRjeIZmnVqOUX-VvImZ34LBlbGfZPdgEtoUANd0WMSghJH0r2q2zstbYL0Ms-eHxdpI9JJuEl_QEdxZGIC6hfWjeYdHa6Urq50vHllfg8_9QuHQIBFnUDAmD_FOxmUfl_AeE55cEtpAppFzVtHbV-2-8AIt11Vo1bUoJxsvchURZ1dNzsufaRYigiH2ZGQ4KH5hi_vfiOR9avZvdBqlHhDZK3LAR_4BXU_vPWlpvVPJkUijRVonYxymT3wvGB-LwnG0GE";
const IMAGE_STEW = "https://lh3.googleusercontent.com/aida-public/AB6AXuDlMkkK7GpUacfRiKfcVFtWB2C2GINk31CGuXJKi4hzgVylDJrb46cEnhNmpnHD-sA1IPlhSsoDRcJsGokgc1MX9s4RK_rXr5mQHiQWb__WebDGmkFWrUZOpuJk6Rf5pAH32jOwb_Z-M5CNbUGiHi2QJAGRg31_cV8_Gd1RaixORmSzG4QWYFgOQ23iokrSlJE2o05ucMM_cLoYQVlTVnQHqgDcQl-5NAeVLBmitNr_DG2NOFMK3iti3FyEL_PxIcVzuXcW3Yzrj3c";
const IMAGE_SPINACH = "https://lh3.googleusercontent.com/aida-public/AB6AXuBXIir8wQuL0vVDSJaF1Xz2nVVV9JkJFhWlrS4LoZpa57s8ken4briLrItyXO-PW1mD_DPbVphI0TwSpOHJ7kubX3jgjyfRKmucSLoi1asGz938LHe_x7jOKwhQKj3WIxqOZH1BAlJZPygMa-emOmVkfK8ddf80EmXZ1E7oJSGnMCMXRAtpbjIaGCeyd9i8qUDJTPNYE-esEBPvw6pas4j1eAoN63batrmKywYiQ-ges7zBG5B0OrXUygE575s-1kVrgtwCQAf727c";
const IMAGE_MACKEREL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDTJ1ynL18WZFNBagvQkoPVgjEX2lPfxligAFX9kt2WPYfVfevPyqkVUi6CvIi2z4CHNSt5g7lKqXLsYHZxBDVyOB2jyge4kvUXBB83xnwHUjp0DNYVomePmDDTkhgO6DeqYtapdjDI8P4hDUx8RCLOkiNtuBE2iPVJmP_w3aL9KEtxrxd0NWZ3ywYT_abmu34TEzzTCBWibpoXSS9rSDjqgUFuYAvz2yhwpBFAC6-PsQLzLKfTeCEmSjzmSZ_Y_DdevpssbUDuRRk";

// Alternate fallbacks for visual richness
const IMAGE_CHICKEN = "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=200";
const IMAGE_SALAD = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200";
const IMAGE_DOCKKATSU = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200";
const IMAGE_DESSERT = "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&q=80&w=200";

export function generateMockMealData(weekDates: Date[]): MealData[] {
  const result: MealData[] = [];

  const daysTemplates = [
    // 0: Monday
    {
      lunch: {
        title: "수제떡갈비 정식",
        totalCalories: 820,
        allergens: ["대두", "밀", "돼지고기"],
        dishes: ["친환경쌀밥", "얼큰순두부찌개", "수제떡갈비조림", "시금치나물무침", "배추김치", "요구르트"],
        dishDetails: [
          { name: "친환경쌀밥", category: "rice", kcal: 310, protein: 5, carbs: 68, fat: 1, description: "풍미가 우수하고 소화가 잘되는 유기농 친환경 쌀밥", imageUrl: IMAGE_RICE },
          { name: "얼큰순두부찌개", category: "soup", kcal: 180, protein: 12, carbs: 12, fat: 8, description: "신선한 국산 몽글몽글 순두부와 얼큰한 해물 맛 육수", imageUrl: IMAGE_STEW },
          { name: "수제떡갈비조림", category: "side", kcal: 235, protein: 11, carbs: 18, fat: 12, description: "육즙 가득한 한돈에 비법 소스를 발라 구운 수제 떡갈비", imageUrl: IMAGE_MACKEREL },
          { name: "시금치나물무침", category: "side", kcal: 45, protein: 2.5, carbs: 5, fat: 0.5, description: "비타민이 풍부하고 고소하게 무친 남해초 시금치나물", imageUrl: IMAGE_SPINACH },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0.1, description: "국산 재료로 아삭하게 익힌 웰빙 배추김치", imageUrl: IMAGE_SALAD },
          { name: "요구르트", category: "dessert", kcal: 35, protein: 0, carbs: 5, fat: 0.1, description: "유산균이 살아있는 상큼한 식후 유제품", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      },
      dinner: {
        title: "스팸마요덮밥 정식",
        totalCalories: 780,
        allergens: ["대두", "밀", "난류", "우유"],
        dishes: ["스팸마요덮밥", "가쓰오우동국", "매콤떡볶이", "단무지무침", "배추김치", "감귤에이드"],
        dishDetails: [
          { name: "스팸마요덮밥", category: "rice", kcal: 420, protein: 12, carbs: 70, fat: 14, description: "짭조름한 스팸 슬라이스와 고소한 마요네즈 데코", imageUrl: IMAGE_RICE },
          { name: "가쓰오우동국", category: "soup", kcal: 90, protein: 3, carbs: 15, fat: 1, description: "정통 가쓰오 풍미 육수와 통통한 가마보코 어묵", imageUrl: IMAGE_STEW },
          { name: "매콤떡볶이", category: "side", kcal: 180, protein: 5, carbs: 22, fat: 8, description: "추억의 분식 맛 매콤콤하고 달콤한 쌀떡볶이", imageUrl: IMAGE_CHICKEN },
          { name: "단무지무침", category: "side", kcal: 30, protein: 1, carbs: 3, fat: 0.1, description: "새콤달콤 아삭한 양념 단무지무침", imageUrl: IMAGE_SPINACH },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0.1, description: "국산 김정김치 맛있는 배추김치", imageUrl: IMAGE_SALAD },
          { name: "감귤에이드", category: "dessert", kcal: 45, protein: 2.5, carbs: 5, fat: 2.8, description: "제주산 감귤을 짜낸 과즙 가득 청량 음료", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      }
    },
    // 1: Tuesday
    {
      lunch: {
        title: "갈릭버터쉬림프 덮밥",
        totalCalories: 860,
        allergens: ["대두", "밀", "새우", "우유"],
        dishes: ["갈릭버터쉬림프덮밥", "맑은어묵국", "크림치즈샐러드", "배추김치", "라임청포도에이드"],
        dishDetails: [
          { name: "갈릭버터쉬림프덮밥", category: "rice", kcal: 480, protein: 14, carbs: 75, fat: 12, description: "국산 갈릭과 버터의 고소한 향에 버무린 통통한 새우 덮밥", imageUrl: IMAGE_RICE },
          { name: "맑은어묵국", category: "soup", kcal: 110, protein: 6, carbs: 12, fat: 3, description: "감칠맛 가득한 멸치 육수에 신선한 사각 어묵국", imageUrl: IMAGE_STEW },
          { name: "크림치즈샐러드", category: "side", kcal: 150, protein: 4, carbs: 18, fat: 7, description: "신선한 루꼴라, 양상추와 부드러운 크림치즈", imageUrl: IMAGE_SALAD },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0.1, description: "아삭아삭한 웰빙 국산 배추김치", imageUrl: IMAGE_SPINACH },
          { name: "라임청포도에이드", category: "dessert", kcal: 105, protein: 4.5, carbs: 8, fat: 1.9, description: "톡 쏘는 탄산과 청포도 조화의 비타민 가득 과일 드링크", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      },
      dinner: {
        title: "돈등뼈감자탕",
        totalCalories: 790,
        allergens: ["대두", "밀", "돼지고기", "난류", "우유"],
        dishes: ["친환경쌀밥", "우거지돈등뼈감자탕", "돈육두부조림", "치즈계란말이", "석박지", "사과푸딩"],
        dishDetails: [
          { name: "친환경쌀밥", category: "rice", kcal: 310, protein: 5, carbs: 68, fat: 1, description: "갓 지은 찰기 흐르는 하얀 이팝 쌀밥", imageUrl: IMAGE_RICE },
          { name: "우거지돈등뼈감자탕", category: "soup", kcal: 240, protein: 18, carbs: 10, fat: 14, description: "푸짐한 한돈 등뼈와 구수한 시래기 우거지가 듬뿍", imageUrl: IMAGE_STEW },
          { name: "돈육두부조림", category: "side", kcal: 120, protein: 7, carbs: 12, fat: 5, description: "한돈 돼지고기와 담백한 손두부의 조화로운 조림", imageUrl: IMAGE_MACKEREL },
          { name: "치즈계란말이", category: "side", kcal: 90, protein: 3, carbs: 6, fat: 3, description: "체다와 모짜렐라가 아낌없이 드간 촉촉 계란말이", imageUrl: IMAGE_SPINACH },
          { name: "석박지", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0.1, description: "무의 수분과 아삭함이 그대로 살아있는 석박지", imageUrl: IMAGE_SALAD },
          { name: "사과푸딩", category: "dessert", kcal: 15, protein: 0.5, carbs: 0, fat: 0, description: "상콤달콤 식후 입가심 사과맛 수제 젤리 푸딩", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      }
    },
    // 2: Wednesday
    {
      lunch: {
        title: "수제함박스테이크 정식",
        totalCalories: 850,
        allergens: ["돼지고기", "쇠고기", "대두", "밀"],
        dishes: ["혼합잡곡밥", "돈육김치찌개", "수제함박스테이크", "숙주미나리무침", "깍두기", "콘드레싱"],
        dishDetails: [
          { name: "혼합잡곡밥", category: "rice", kcal: 310, protein: 6, carbs: 70, fat: 1.5, description: "검정콩, 보리, 현미를 배합하여 영양이 골고루 퍼진 잡곡밥", imageUrl: IMAGE_RICE },
          { name: "돈육김치찌개", category: "soup", kcal: 160, protein: 11, carbs: 8, fat: 9, description: "깊은 아우라의 생돼지고기와 3년 묵은 김치의 시원한 만남", imageUrl: IMAGE_STEW },
          { name: "수제함박스테이크", category: "side", kcal: 290, protein: 13, carbs: 22, fat: 14, description: "영양 만점 소고기와 돼지고기를 정성 들여 십자블렌딩한 함박", imageUrl: IMAGE_DOCKKATSU },
          { name: "숙주미나리무침", category: "side", kcal: 40, protein: 1.5, carbs: 6, fat: 0.2, description: "향기 가득한 미나리와 아삭아삭한 숙주나물", imageUrl: IMAGE_SPINACH },
          { name: "깍두기", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0.1, description: "학교 급식 전용 아삭아삭한 국산 안심 깍두기", imageUrl: IMAGE_SALAD },
          { name: "콘드레싱 부추무침", category: "dessert", kcal: 35, protein: 0, carbs: 2, fat: 0.2, description: "달콤하고 부드러운 스위트콘 마요 드레싱", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      },
      dinner: {
        title: "참치마요덮밥 정식",
        totalCalories: 720,
        allergens: ["대두", "밀", "난류", "우유"],
        dishes: ["참치마요덮밥", "미니우동", "유부장국", "단무지무침", "배추김치", "요구르트"],
        dishDetails: [
          { name: "참치마요덮밥", category: "rice", kcal: 390, protein: 11, carbs: 62, fat: 11, description: "기름지기를 뺀 살고기 참치와 특제 간장조림, 마요네즈", imageUrl: IMAGE_RICE },
          { name: "미니우동", category: "soup", kcal: 150, protein: 5, carbs: 28, fat: 2, description: "쫄깃한 면발과 깊은 쯔유 국물의 우동", imageUrl: IMAGE_STEW },
          { name: "유부장국", category: "side", kcal: 120, protein: 5.5, carbs: 6, fat: 7.7, description: "미소 소스와 고소한 토핑 유부를 아낌없이 얹은 장국", imageUrl: IMAGE_MACKEREL },
          { name: "단무지무침", category: "side", kcal: 30, protein: 1, carbs: 2, fat: 0.1, description: "매콤새콤하고 아삭한 노란 단무지 무침", imageUrl: IMAGE_SPINACH },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0.1, description: "깔끔하고 아삭한 한국 보양식 배추김치", imageUrl: IMAGE_SALAD },
          { name: "요구르트", category: "dessert", kcal: 15, protein: 0, carbs: 0, fat: 0, description: "유산균 가득 입가심 음료수", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      }
    },
    // 3: Thursday
    {
      lunch: {
        title: "치즈돈까스 정식",
        totalCalories: 845,
        allergens: ["대두", "밀", "쇠고기", "돼지고기", "우유"],
        dishes: ["친환경현미밥", "쇠고기미역국", "치즈돈까스", "매콤돈육강정", "숙주미나리무침", "배추김치"],
        dishDetails: [
          { name: "친환경현미밥", category: "rice", kcal: 300, protein: 6, carbs: 60, fat: 1, description: "탄수화물 60g 포함, 혈당 안저를 돕는 식이섬유 가득 친환경 현미밥", imageUrl: IMAGE_RICE },
          { name: "쇠고기미역국", category: "soup", kcal: 120, protein: 10, carbs: 10, fat: 4, description: "진짜 한우를 넣어 우려낸 깊고 구수한 대표 한식 미역국", imageUrl: IMAGE_STEW },
          { name: "치즈돈까스", category: "side", kcal: 325, protein: 12, carbs: 30, fat: 16, description: "바삭한 튀김 옷 속에 고소하고 늘어나는 자연산 모짜렐라 치즈 가득", imageUrl: IMAGE_DOCKKATSU },
          { name: "매콤돈육강정", category: "side", kcal: 150, protein: 10, carbs: 20, fat: 6, description: "두툼한 국내산 돈육을 튀겨 매콤달콤 비법 소스를 입힌 별미 강정", imageUrl: IMAGE_MACKEREL },
          { name: "숙주미나리무침", category: "side", kcal: 35, protein: 1, carbs: 5, fat: 0, description: "식이섬유 3g 함유된 신선한 숙주나물과 국산 산나물", imageUrl: IMAGE_SPINACH },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0, description: "배추, 고춧가루 모두 다 백퍼 국산 천연 유산균 김치", imageUrl: IMAGE_SALAD }
        ] as DishDetail[]
      },
      dinner: {
        title: "사천마라탕 수프",
        totalCalories: 880,
        allergens: ["땅콩", "대두", "밀", "돼지고기", "난류"],
        dishes: ["계란야채볶음밥", "사천마라탕", "미니꿔바로우", "단무지무침", "배추김치", "단팥빵"],
        dishDetails: [
          { name: "계란야채볶음밥", category: "rice", kcal: 340, protein: 9, carbs: 58, fat: 8, description: "고소한 계란 스크램블과 함께 마늘기름으로 보슬보슬 볶은 밥", imageUrl: IMAGE_RICE },
          { name: "사천마라탕", category: "soup", kcal: 280, protein: 12, carbs: 25, fat: 14, description: "정통 사천향신료와 알알한 고추기름, 대패돈육과 청경채의 하모니", imageUrl: IMAGE_STEW },
          { name: "미니꿔바로우", category: "side", kcal: 190, protein: 6, carbs: 24, fat: 8, description: "새콤달콤 쫀득한 찹쌀 탕수육 감각 꿔바로우", imageUrl: IMAGE_CHICKEN },
          { name: "단무지무침", category: "side", kcal: 20, protein: 0.5, carbs: 3, fat: 0.1, description: "아삭아삭 매콤 양념 단무지무침", imageUrl: IMAGE_SPINACH },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0, description: "개운하게 익힌 아삭 배추김치", imageUrl: IMAGE_SALAD },
          { name: "단팥빵", category: "dessert", kcal: 35, protein: 0, carbs: 8, fat: 0.1, description: "국산 팥 앙금이 꽉 들어찬 오븐 베이킹 수제 단팥빵", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      }
    },
    // 4: Friday
    {
      lunch: {
        title: "오리훈제구이정식",
        totalCalories: 810,
        allergens: ["대두", "밀"],
        dishes: ["흑미밥, 맑은콩나물국, 오리훈제구이, 쌈무와 부추무침, 양파절임, 석박지, 보름달빵"],
        dishDetails: [
          { name: "흑미밥", category: "rice", kcal: 305, protein: 6, carbs: 64, fat: 1.1, description: "몸에 좋은 안토시아닌이 함유된 흑미로 지은 밥", imageUrl: IMAGE_RICE },
          { name: "맑은콩나물국", category: "soup", kcal: 65, protein: 3, carbs: 6, fat: 1, description: "속을 시원하게 확 풀어주는 맑고 청량한 콩나물국", imageUrl: IMAGE_STEW },
          { name: "오리훈제구이", category: "side", kcal: 280, protein: 18, carbs: 5, fat: 18, description: "참나무 훈연으로 기름기를 쪽 기분 좋게 뺀 담백 오리구이", imageUrl: IMAGE_MACKEREL },
          { name: "부추양파무침과 쌈무", category: "side", kcal: 110, protein: 4.5, carbs: 12, fat: 2, description: "아삭한 부추와 은은하게 달콤한 쌈무 슬라이스", imageUrl: IMAGE_SPINACH },
          { name: "석박지", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0, description: "시각적 청각적 쾌감을 부르는 잘 익은 석박지", imageUrl: IMAGE_SALAD },
          { name: "보름달빵", category: "dessert", kcal: 35, protein: 1, carbs: 6, fat: 0.1, description: "부드러운 크림이 가득 찬 보름달 모양 스펀지 빵", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      },
      dinner: {
        title: "불고기 퀘사디아",
        totalCalories: 750,
        allergens: ["쇠고기", "밀", "대두", "우유", "난류"],
        dishes: ["치킨치즈조림밥, 쇠고기불고기퀘사디아, 모듬감자튀김, 그린키위샐러드, 배추김치, 초코우유"],
        dishDetails: [
          { name: "치킨치즈조림밥", category: "rice", kcal: 310, protein: 11, carbs: 54, fat: 8, description: "잘게 찢은 훈제 닭가슴살과 치즈 가루 얹어 만든 건강밥", imageUrl: IMAGE_RICE },
          { name: "쇠고기불고기퀘사디아", category: "soup", kcal: 220, protein: 10, carbs: 25, fat: 12, description: "달짝지근한 쇠고기 불고기와 자연 모짜렐라의 또띠아 삼총사", imageUrl: IMAGE_STEW },
          { name: "모듬감자튀김", category: "side", kcal: 140, protein: 2, carbs: 18, fat: 6, description: "바삭하고 포슬한 크링클컷, 케이준 감자튀김 모듬", imageUrl: IMAGE_CHICKEN },
          { name: "그린키위샐러드", category: "side", kcal: 45, protein: 1, carbs: 6, fat: 0.1, description: "키위 드레싱과 상큼한 양상추, 파프리카 모듬 샐러드", imageUrl: IMAGE_SPINACH },
          { name: "배추김치", category: "side", kcal: 15, protein: 0.5, carbs: 2, fat: 0, description: "국산 엄선 배추김치", imageUrl: IMAGE_SALAD },
          { name: "초코우유", category: "dessert", kcal: 20, protein: 0.5, carbs: 0, fat: 0, description: "진하고 고소한 국산 1등급 원유 초코 드링크", imageUrl: IMAGE_DESSERT }
        ] as DishDetail[]
      }
    }
  ];

  weekDates.forEach((date, index) => {
    const template = daysTemplates[index] || daysTemplates[index % daysTemplates.length];
    const dateKeyStr = formatDateKey(date);
    const koreanDateStr = formatKoreanDate(date);
    const shortDay = getKoreanDayOfWeekShort(date);

    // Lunch
    // Calculate sum of nutrients dynamically based on dishDetails
    const lunchKcal = template.lunch.dishDetails.reduce((sum, d) => sum + d.kcal, 0);
    const lunchProtein = template.lunch.dishDetails.reduce((sum, d) => sum + d.protein, 0);
    const lunchCarbs = template.lunch.dishDetails.reduce((sum, d) => sum + d.carbs, 0);
    const lunchFat = template.lunch.dishDetails.reduce((sum, d) => sum + d.fat, 0);

    result.push({
      id: `${dateKeyStr}-lunch`,
      schoolName: "씨마스고등학교",
      date: koreanDateStr,
      dateKey: dateKeyStr,
      dayOfWeek: shortDay,
      mealType: 'lunch',
      title: template.lunch.title,
      dishes: template.lunch.dishes,
      dishDetails: template.lunch.dishDetails,
      totalCalories: lunchKcal,
      nutrition: {
        kcal: lunchKcal,
        protein: lunchProtein,
        carbs: lunchCarbs,
        fat: lunchFat,
        proteinTarget: 65,
        carbsTarget: 300,
        fatTarget: 50
      },
      allergens: template.lunch.allergens
    });

    // Dinner
    const dinnerKcal = template.dinner.dishDetails.reduce((sum, d) => sum + d.kcal, 0);
    const dinnerProtein = template.dinner.dishDetails.reduce((sum, d) => sum + d.protein, 0);
    const dinnerCarbs = template.dinner.dishDetails.reduce((sum, d) => sum + d.carbs, 0);
    const dinnerFat = template.dinner.dishDetails.reduce((sum, d) => sum + d.fat, 0);

    result.push({
      id: `${dateKeyStr}-dinner`,
      schoolName: "씨마스고등학교",
      date: koreanDateStr,
      dateKey: dateKeyStr,
      dayOfWeek: shortDay,
      mealType: 'dinner',
      title: template.dinner.title,
      dishes: template.dinner.dishes,
      dishDetails: template.dinner.dishDetails,
      totalCalories: dinnerKcal,
      nutrition: {
        kcal: dinnerKcal,
        protein: dinnerProtein,
        carbs: dinnerCarbs,
        fat: dinnerFat,
        proteinTarget: 65,
        carbsTarget: 300,
        fatTarget: 50
      },
      allergens: template.dinner.allergens
    });
  });

  return result;
}
