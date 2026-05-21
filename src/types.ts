export interface Nutrition {
  kcal: number;
  protein: number;       // In grams (e.g., 32)
  carbs: number;         // In grams (e.g., 110)
  fat: number;           // In grams (e.g., 25)
  proteinTarget: number; // e.g., 65
  carbsTarget: number;   // e.g., 300
  fatTarget: number;     // e.g., 50
}

export interface DishDetail {
  name: string;
  category: 'rice' | 'soup' | 'side' | 'dessert'; // "곡류" (밥류) | "국/찌개" | "반찬" | "디저트"
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string;
  imageUrl: string;
}

export interface MealData {
  id: string;
  schoolName: string; // "씨마스고등학교"
  date: string;       // e.g., "5월 15일 금요일"
  dateKey: string;    // "YYYYMMDD"
  dayOfWeek: string;  // "월", "화", "수", "목", "금"
  mealType: 'lunch' | 'dinner'; // "중식" | "석식"
  title: string;      // e.g., "치즈돈까스 정식"
  dishes: string[];   // e.g., ["현미밥", "쇠고기미역국", "치즈돈까스", ...]
  dishDetails: DishDetail[];
  totalCalories: number;
  nutrition: Nutrition;
  allergens: string[];
}
