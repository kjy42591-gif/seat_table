// =================================================================
// 1. 퀴즈 문제 데이터 (중학교 2학년 일차함수 단원)
// =================================================================
const quizData = [
    {
        // 1. 일차함수를 찾는 문제
        question: "다음 중 y가 x에 대한 일차함수인 것은?",
        options: [
            "y = 5", 
            "y = x² + 1", 
            "y = 3/x", 
            "y = -2x + 4"
        ],
        answer: 3 // 정답: y = -2x + 4 (인덱스 3)
    },
    {
        // 2. 절편과 기울기와 관련된 문제
        question: "일차함수 y = 3x - 6 의 그래프에 대한 설명으로 옳은 것은?",
        options: [
            "x절편은 -6이다.", 
            "y절편은 3이다.", 
            "기울기는 3이고, x절편은 2이다.", 
            "기울기는 -6이다."
        ],
        answer: 2 // 정답: 기울기는 3이고, x절편은 2이다. (인덱스 2)
    },
    {
        // 3. 일차함수의 활용 문제
        question: "길이가 15cm인 양초에 불을 붙이면 1시간마다 3cm씩 짧아집니다. 불을 붙인 지 2시간 후 남은 양초의 길이는 몇 cm일까요?",
        options: [
            "6cm", 
            "9cm", 
            "12cm", 
            "15cm"
        ],
        answer: 1 // 정답: 9cm (인덱스 1)
    }
];

// =================================================================
// 2. 변수 및 HTML 요소 선언
// =================================================================
let currentQuestionIndex = 0;
let score = 0;

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

// 연습장(Canvas) 관련 변수
const canvas = document.getElementById('scratchpad');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// =================================================================
// 3. 디지털 연습장(필기 기능) 로직
// =================================================================

// 캔버스 해상도와 화면 표시 크기를 맞추는 함수
function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    
    // 선 스타일 설정 (크기 변경 시 매번 다시 설정 필요)
    ctx.strokeStyle = '#333'; // 선 색상
    ctx.lineJoin = 'round';   // 부드러운 연결
    ctx.lineCap = 'round';    // 둥근 선 끝
    ctx.lineWidth = 2;        // 선 두께
}

// 창 크기가 바뀌거나 화면 회전 시 대응
window.addEventListener('resize', resizeCanvas);

// 그리기 시작
function startDrawing(e) {
    isDrawing = true;
    const pos = getEventPos(e);
    [lastX, lastY] = [pos.x, pos.y];
}

// 그리기 진행
function draw(e) {
    if (!isDrawing) return;
    
    // 태블릿 터치 시 화면이 들썩거리거나 스크롤되는 현상 방지
    if(e.cancelable) e.preventDefault(); 

    const pos = getEventPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    [lastX, lastY] = [pos.x, pos.y];
}

// 그리기 종료
function stopDrawing() {
    isDrawing = false;
}

// 마우스 및 터치 좌표 계산 함수
function getEventPos(e) {
    let clientX, clientY;
    
    // 터치 입력인 경우 (태블릿)
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } 
    // 마우스 입력인 경우 (PC)
    else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

// 이벤트 리스너 등록
canvas.addEventListener('touchstart', startDrawing, {passive: false});
canvas.addEventListener('touchmove', draw, {passive: false});
window.addEventListener('touchend', stopDrawing);

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

// 연습장 지우기 버튼 기능
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// =================================================================
// 4. 퀴즈 시스템 운영 로직
// =================================================================

// 퀴즈 시작 및 초기화
function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    totalQNum.innerText = quizData.length;
    totalQuestionsSpan.innerText = quizData.length;
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    loadQuestion();
}

// 문제 생성 및 불러오기
function loadQuestion() {
    const currentQuiz = quizData[currentQuestionIndex];
    currentQNum.innerText = currentQuestionIndex + 1;
    questionText.innerText = currentQuiz.question;
    
    optionsContainer.innerHTML = '';
    feedbackText.classList.add('hidden');
    nextBtn.classList.add('hidden');

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    // 다음 문제로 넘어갈 때 연습장을 깨끗하게 비우고 크기 재조정
    resizeCanvas(); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 학생이 보기를 선택했을 때 정답 확인
function selectAnswer(selectedIndex, selectedButton) {
    const currentQuiz = quizData[currentQuestionIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true); // 중복 클릭 차단

    if (selectedIndex === currentQuiz.answer) {
        selectedButton.classList.add('correct');
        feedbackText.innerText = "정답입니다! 👏";
        feedbackText.className = "feedback correct-text";
        score++;
    } else {
        selectedButton.classList.add('wrong');
        buttons[currentQuiz.answer].classList.add('correct'); // 진짜 정답 알려주기
        feedbackText.innerText = "아쉽네요, 다시 한번 생각해봐요! 💡";
        feedbackText.className = "feedback wrong-text";
    }

    feedbackText.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

// '다음 문제로 넘어가기' 버튼 이벤트
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 결과 화면 출력
function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScore.innerText = score;

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

// =================================================================
// 5. 최초 실행
// =================================================================
resizeCanvas(); 
initQuiz();
