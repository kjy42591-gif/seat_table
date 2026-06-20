@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap');

* {
    box-sizing: border-box;
    font-family: 'Noto Sans KR', sans-serif;
}

body {
    background-color: #f0f4f8;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    /* 태블릿 스크롤 방지 필수 설정 */
    overflow: hidden; 
    position: fixed;
    width: 100%;
    height: 100%;
}

.quiz-container {
    background-color: white;
    border-radius: 15px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    padding: 25px;
    width: 95%;
    max-width: 650px;
    text-align: center;
    max-height: 90vh;
    overflow-y: auto; 
}

h1 {
    color: #2c3e50;
    margin-bottom: 20px;
    font-size: 1.5rem;
}

.progress {
    color: #7f8c8d;
    font-size: 0.9rem;
    margin-bottom: 15px;
}

#question-text {
    font-size: 1.2rem;
    color: #34495e;
    margin-bottom: 20px;
    line-height: 1.5;
    word-break: keep-all;
}

.options {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.option-btn {
    background-color: #f8f9fa;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    padding: 12px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
}

.option-btn:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
}

.option-btn:disabled {
    cursor: not-allowed;
}

.option-btn.correct {
    background-color: #d4edda;
    border-color: #28a745;
    color: #155724;
}

.option-btn.wrong {
    background-color: #f8d7da;
    border-color: #dc3545;
    color: #721c24;
}

/* 연습장 디자인 */
.scratchpad-container {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fafafa;
    overflow: hidden;
}

.scratchpad-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 15px;
    background-color: #eee;
    border-bottom: 1px solid #ddd;
    color: #555;
    font-size: 0.9rem;
    font-weight: bold;
}

#clear-btn {
    background-color: #95a5a6;
    color: white;
    border: none;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
}

#clear-btn:hover {
    background-color: #7f8c8d;
}

#scratchpad {
    display: block;
    width: 100%;
    height: 200px;
    cursor: crosshair;
    touch-action: none; 
}

.feedback {
    margin-top: 20px;
    font-weight: bold;
    font-size: 1.1rem;
}

.feedback.correct-text { color: #28a745; }
.feedback.wrong-text { color: #dc3545; }

#next-btn, #restart-btn {
    margin-top: 20px;
    background-color: #3498db;
    color: white;
    border: none;
    padding: 12px 25px;
    font-size: 1.1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    width: 100%;
}

#next-btn:hover, #restart-btn:hover {
    background-color: #2980b9;
}

.score-text {
    font-size: 1.2rem;
    margin: 20px 0;
}

#score {
    color: #e74c3c;
    font-size: 1.5rem;
}

.hidden {
    display: none !important;
}
