# 수학 문제 데이터 파일 생성 (js/problems.js)
@"
// 수학 문제 데이터베이스
const mathProblems = {
    algebra: [
        {
            id: 1,
            question: "방정식 2x + 5 = 13을 풀어보세요.",
            answer: "4",
            hint: "양변에서 5를 빼고, 양변을 2로 나누어보세요.",
            solution: "2x + 5 = 13 → 2x = 8 → x = 4"
        },
        {
            id: 2,
            question: "x² - 5x + 6 = 0을 인수분해하여 해를 구하세요. (작은 수부터 쉼표로 구분)",
            answer: "2,3",
            hint: "x² - 5x + 6 = (x - a)(x - b) 형태로 인수분해해보세요.",
            solution: "x² - 5x + 6 = (x - 2)(x - 3) = 0, 따라서 x = 2 또는 x = 3"
        },
        {
            id: 3,
            question: "3x - 7 = 2x + 8을 풀어보세요.",
            answer: "15",
            hint: "x가 포함된 항을 한쪽으로, 상수를 다른 쪽으로 이항하세요.",
            solution: "3x - 2x = 8 + 7 → x = 15"
        }
    ],
    geometry: [
        {
            id: 4,
            question: "한 변이 6cm인 정사각형의 넓이는?",
            answer: "36",
            hint: "정사각형의 넓이는 한 변 × 한 변입니다.",
            solution: "6 × 6 = 36 cm²"
        },
        {
            id: 5,
            question: "반지름이 4cm인 원의 둘레는? (π = 3.14로 계산)",
            answer: "25.12",
            hint: "원의 둘레는 2πr입니다.",
            solution: "2 × 3.14 × 4 = 25.12 cm"
        },
        {
            id: 6,
            question: "밑변이 8cm, 높이가 5cm인 삼각형의 넓이는?",
            answer: "20",
            hint: "삼각형의 넓이는 (밑변 × 높이) ÷ 2입니다.",
            solution: "(8 × 5) ÷ 2 = 20 cm²"
        }
    ],
    functions: [
        {
            id: 7,
            question: "함수 f(x) = 2x + 3에서 f(5)의 값은?",
            answer: "13",
            hint: "x = 5를 함수에 대입해보세요.",
            solution: "f(5) = 2(5) + 3 = 10 + 3 = 13"
        },
        {
            id: 8,
            question: "함수 f(x) = x² - 2x에서 f(3)의 값은?",
            answer: "3",
            hint: "x = 3을 함수에 대입해보세요.",
            solution: "f(3) = 3² - 2(3) = 9 - 6 = 3"
        }
    ],
    statistics: [
        {
            id: 9,
            question: "다음 수들의 평균을 구하세요: 4, 6, 8, 10, 12",
            answer: "8",
            hint: "모든 수를 더한 후 개수로 나누세요.",
            solution: "(4 + 6 + 8 + 10 + 12) ÷ 5 = 40 ÷ 5 = 8"
        },
        {
            id: 10,
            question: "다음 수들 중 중앙값은? 3, 7, 5, 9, 1",
            answer: "5",
            hint: "먼저 수들을 크기 순으로 정렬하세요.",
            solution: "1, 3, 5, 7, 9로 정렬하면 중앙값은 5"
        }
    ]
};
"@ | Out-File -FilePath "js/problems.js" -Encoding UTF8