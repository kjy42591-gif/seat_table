// 1. 퀴즈 문제 데이터
const quizData = [
    {
        question: "다음 중 y가 x에 대한 일차함수인 것은?",
        options: [
            "y = 5", 
            "y = x² + 1", 
            "y = 3/x", 
            "y = -2x + 4"
        ],
        answer: 3 
    },
    {
        question: "일차함수 y = 3x - 6 의 그래프에 대한 설명으로 옳은 것은?",
        options: [
            "x절편은 -6이다.", 
            "y절편은 3이다.", 
            "기울기는 3이고, x절편은 2이다.", 
            "기울기는 -6이다."
        ],
        answer: 2 
    },
    {
        question: "길이가 15cm인 양초에 불을 붙이면 1시간마다 3cm씩 짧아집니다. 불을 붙인 지 2시간 후 남은 양초의 길이는 몇 cm일까요?",
        options: [
            "6cm", 
            "9cm", 
            "12cm", 
            "15cm"
        ],
        answer: 1 
    }
];

// 2. 변수 및 HTML 요소 연결
let currentQuestionList = []; // 현재 출제될 문제 번호 배열
let currentListIndex = 0;     // 배열 내 진행 순서
let wrongAnswers = [];        // 틀린 문제 번호 저장소
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
const retryWrongBtn = document.getElementById('retry-wrong-btn');
const resultMessage = document.getElementById('result-message');

const canvas = document.getElementById('scratchpad');
const ctx = canvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn');

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// 3. 연습장 로직 (그대로 유지)
function resizeCanvas() {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
    
    ctx.strokeStyle = '#333'; 
    ctx.lineJoin = 'round';   
    ctx.lineCap = 'round';    
    ctx.lineWidth = 2;        
}

window.addEventListener('resize', resizeCanvas);

function startDrawing(e) {
    isDrawing = true;
    const pos = getEventPos(e);
    [lastX, lastY] = [pos.x, pos.y];
}

function draw(e) {
    if (!isDrawing) return;
    if(e.cancelable) e.preventDefault(); 

    const pos = getEventPos(e);

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    [lastX, lastY] = [pos.x, pos.y];
}

function stopDrawing() {
    isDrawing = false;
}

function getEventPos(e) {
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    const rect = canvas.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

canvas.addEventListener('touchstart', startDrawing, {passive: false});
canvas.addEventListener('touchmove', draw, {passive: false});
window.addEventListener('touchend', stopDrawing);
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});


// 4. 오답노트 기능이 추가된 퀴즈 로직

// 완전 처음부터 퀴즈 시작
function initQuiz() {
    // 모든 문제의 번호를 배열로 만듦 [0, 1, 2]
    currentQuestionList = quizData.map((_, index) => index); 
    startQuizFlow();
}

// 퀴즈 진행 흐름 시작 (처음 시작 & 오답 다시 풀기 공통)
function startQuizFlow() {
    currentListIndex = 0;
    score = 0;
    wrongAnswers = []; // 이번 라운드의 틀린 문제 초기화
    
    totalQNum.innerText = currentQuestionList.length;
    totalQuestionsSpan.innerText = currentQuestionList.length;
    quizScreen.classList.remove('hidden');
    resultScreen.classList.add('hidden');
    
    loadQuestion();
}

function loadQuestion() {
    const actualQuizIndex = currentQuestionList[currentListIndex];
    const currentQuiz = quizData[actualQuizIndex];
    
    currentQNum.innerText = currentListIndex + 1;
    questionText.innerText = currentQuiz.question;
    
    optionsContainer.innerHTML = '';
    feedbackText.classList.add('hidden');
    nextBtn.classList.add('hidden');

    const circleNumbers = ['①', '②', '③', '④'];

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = `${circleNumbers[index]} ${option}`;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index, button, actualQuizIndex));
        optionsContainer.appendChild(button);
    });

    resizeCanvas(); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function selectAnswer(selectedIndex, selectedButton, actualQuizIndex) {
    const currentQuiz = quizData[actualQuizIndex];
    const buttons = document.querySelectorAll('.option-btn');
    
    buttons.forEach(btn => btn.disabled = true); 

    if (selectedIndex === currentQuiz.answer) {
        selectedButton.classList.add('correct');
        feedbackText.innerText = "정답입니다! 👏";
        feedbackText.className = "feedback correct-text";
        score++;
    } else {
        selectedButton.classList.add('wrong');
        buttons[currentQuiz.answer].classList.add('correct'); 
        feedbackText.innerText = "아쉽네요, 다시 한번 생각해봐요! 💡";
        feedbackText.className = "feedback wrong-text";
        
        // ★ 틀린 문제 번호 저장 ★
        wrongAnswers.push(actualQuizIndex);
    }

    feedbackText.classList.remove('hidden');
    nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
    currentListIndex++;
    if (currentListIndex < currentQuestionList.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    finalScore.innerText = score;

    // 틀린 문제가 하나라도 있다면 오답 버튼 표시
    if (wrongAnswers.length > 0) {
        retryWrongBtn.classList.remove('hidden');
        resultMessage.innerText = "틀린 문제는 꼭 짚고 넘어가요! 다시 도전해 볼까요? 💪";
    } else {
        retryWrongBtn.classList.add('hidden');
        resultMessage.innerText = "전부 다 맞혔어요! 오늘 수업 준비 완벽합니다! 🚀";
    }
}

// 오답 다시 풀기 버튼 이벤트
retryWrongBtn.addEventListener('click', () => {
    // 풀어야 할 문제 목록을 틀린 문제 번호들로 교체
    currentQuestionList = [...wrongAnswers];
    startQuizFlow();
});

// 처음부터 다시 풀기 버튼 이벤트
restartBtn.addEventListener('click', initQuiz);

// 5. 최초 실행
resizeCanvas(); 
initQuiz();
