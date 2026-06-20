// 선생님께서 자유롭게 문제를 추가하고 수정할 수 있는 영역입니다.
const quizData = [
    {
        question: "다음 중 유한소수로 나타낼 수 있는 분수는 무엇일까요?",
        options: ["1/3", "2/7", "3/20", "5/9"],
        answer: 2 // 정답 인덱스 (0부터 시작하므로 3/20은 2번)
    },
    {
        question: "연립방정식 x + y = 5, 2x - y = 4 의 해를 구하면?",
        options: ["x = 1, y = 4", "x = 3, y = 2", "x = 2, y = 3", "x = 4, y = 1"],
        answer: 1 
    },
    {
        question: "일차함수 y = -2x + 5 의 그래프에서 기울기와 y절편의 합은?",
        options: ["3", "5", "-2", "7"],
        answer: 0 
    }
];

let currentQuestionIndex = 0;
let score = 0;

// HTML 요소 불러오기
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const feedbackText = document.getElementById('feedback');
const currentQNum = document.getElementById('current-q-num');
const totalQNum = document.getElementById('total-q-num');

const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const finalScore = document.getElementById('score');
const totalQuestionsSpan = document.getElementById('total-questions');
const restartBtn = document.getElementById('restart-btn');
const resultMessage = document.getElementById('result-message');

// 초기화 함수
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalQNum.innerText = quizData.length;
    totalQuestionsSpan.innerText = quizData.length;
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    loadQuestion();
}

// 문제 불러오기 함수
function loadQuestion() {
    const currentQuiz = quizData[currentQuestionIndex];
    currentQNum.innerText = currentQuestionIndex + 1;
    questionText.innerText = currentQuiz.question;
    
    // 이전 보기와 피드백 초기화
    optionsContainer.innerHTML = '';
    feedbackText.classList.add('hidden');
    nextBtn.classList.add('hidden');

    // 보기 버튼 생성
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

// 정답 확인 함수
function selectAnswer(selectedIndex, selectedButton) {
    const currentQuiz = quizData[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    // 모든 버튼 비활성화 (중복 클릭 방지)
    buttons.forEach(btn => btn.disabled = true);

    if (selectedIndex === currentQuiz.answer) {
        selectedButton.classList.add('correct');
        feedbackText.innerText = "정답입니다! 👏";
        feedbackText.className = "feedback correct-text";
        score++;
    } else {
        selectedButton.classList.add('wrong');
        buttons[currentQuiz.answer].classList.add('correct'); // 진짜 정답 표시
        feedbackText.innerText = "아쉽네요, 다시 한번 생각해봐요! 💡";
        feedbackText.className = "feedback wrong-text";
    }

    feedbackText.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

// 다음 문제로 넘어가기 버튼 이벤트
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 결과 화면 표시 함수
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScore.innerText = score;

    // 점수에 따른 메시지 출력
    if (score === quizData.length) {
        resultMessage.innerText = "완벽해요! 오늘 수업 준비 완료입니다! 🚀";
    } else if (score >= quizData.length / 2) {
        resultMessage.innerText = "잘했어요! 조금만 더 복습하면 완벽해질 거예요! 😊";
    } else {
        resultMessage.innerText = "틀린 문제는 수업 시간에 선생님과 함께 알아봅시다! 💪";
    }
}

// 다시 풀기 버튼 이벤트
restartBtn.addEventListener('click', initQuiz);

// 퀴즈 시작
initQuiz();
