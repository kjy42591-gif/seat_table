// 문제 생성 및 불러오기
function loadQuestion() {
    const currentQuiz = quizData[currentQuestionIndex];
    currentQNum.innerText = currentQuestionIndex + 1;
    questionText.innerText = currentQuiz.question;
    
    optionsContainer.innerHTML = '';
    feedbackText.classList.add('hidden');
    nextBtn.classList.add('hidden');

    // ★ [추가] 동그라미 숫자 배열
    const circleNumbers = ['①', '②', '③', '④'];

    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        // ★ [수정] 텍스트 앞에 동그라미 숫자와 띄어쓰기 추가
        button.innerText = `${circleNumbers[index]}  ${option}`;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });

    // 다음 문제로 넘어갈 때 연습장을 깨끗하게 비우고 크기 재조정
    resizeCanvas(); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
