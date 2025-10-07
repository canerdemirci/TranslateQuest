* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

#root {
  width: 100%;
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.app-header h1 {
  font-size: 2.5rem;
  color: #4a5568;
  margin-bottom: 10px;
  font-weight: 700;
}

.app-header p {
  font-size: 1.1rem;
  color: #718096;
  margin-bottom: 25px;
}

/* Score Stats */
.score-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  padding: 15px 20px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  min-width: 150px;
}

.stat-item:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 1.8rem;
  margin-right: 12px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 2px;
  font-weight: 500;
}

.stat-value {
  font-size: 1.4rem;
  color: white;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Language Controls */
.language-controls {
  margin: 25px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.language-selectors {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.language-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.language-selector label {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.language-dropdown {
  padding: 10px 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.9);
  color: #2d3748;
  font-size: 0.9rem;
  font-weight: 500;
  min-width: 200px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.language-dropdown:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
  background: white;
}

.language-dropdown:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: white;
}

.direction-switch-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.direction-switch-btn:hover {
  transform: translateY(-2px) rotate(180deg);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

.direction-switch-btn:active {
  transform: translateY(0) rotate(180deg);
}

.game-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.text-section, .translation-section, .review-section {
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.text-section h2, .translation-section h2, .review-section h2 {
  color: #2d3748;
  margin-bottom: 15px;
  font-size: 1.3rem;
  font-weight: 600;
}

.turkish-text, .source-text {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  padding: 20px;
  border-radius: 10px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #2d3748;
  border-left: 4px solid #ed8936;
  box-shadow: 0 4px 15px rgba(237, 137, 54, 0.2);
}

textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.3s ease;
  background: #f7fafc;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

textarea:disabled {
  background: #edf2f7;
  color: #a0aec0;
  cursor: not-allowed;
}

.button-section {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.submit-btn, .new-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-btn:hover, .new-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
}

.submit-btn:active, .new-btn:active {
  transform: translateY(0);
}

.submit-btn:disabled {
  background: #a0aec0;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 15px rgba(160, 174, 192, 0.3);
}

.new-btn {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  box-shadow: 0 6px 20px rgba(72, 187, 120, 0.4);
}

.new-btn:hover {
  box-shadow: 0 8px 25px rgba(72, 187, 120, 0.6);
}

/* Review Cards Layout */
.review-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.review-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f1f5f9;
}

.card-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

.card-header h3 {
  margin: 0;
  color: #2d3748;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Score Card */
.score-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.score-card .card-header {
  border-bottom-color: rgba(255, 255, 255, 0.3);
}

.score-card .card-header h3 {
  color: white;
}

.score-display {
  text-align: center;
}

.score-circle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 15px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.score-number {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.score-total {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 2px;
}

.score-text {
  margin: 0;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* Errors Card */
.errors-card {
  background: linear-gradient(135deg, #fed7d7 0%, #feb2b2 100%);
  border-left: 4px solid #e53e3e;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(229, 62, 62, 0.1);
  border-radius: 8px;
}

.error-bullet {
  color: #e53e3e;
  font-weight: bold;
  margin-right: 8px;
  margin-top: 2px;
}

/* Improvements Card */
.improvements-card {
  background: linear-gradient(135deg, #fef5e7 0%, #fed7aa 100%);
  border-left: 4px solid #ed8936;
}

.improvement-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.improvement-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 8px;
  padding: 8px;
  background: rgba(237, 137, 54, 0.1);
  border-radius: 8px;
}

.improvement-bullet {
  color: #ed8936;
  margin-right: 8px;
  margin-top: 2px;
}

/* Translation Card */
.translation-card {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  border-left: 4px solid #38b2ac;
}

.correct-translation {
  background: rgba(56, 178, 172, 0.1);
  padding: 15px;
  border-radius: 10px;
  font-size: 1rem;
  line-height: 1.6;
  color: #2d3748;
  border: 1px solid rgba(56, 178, 172, 0.2);
}

/* Encouragement Card */
.encouragement-card {
  background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
  border-left: 4px solid #48bb78;
}

.encouragement-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: #2d3748;
  font-style: italic;
  text-align: center;
  padding: 10px;
  background: rgba(72, 187, 120, 0.1);
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 768px) {
  .app {
    padding: 15px;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .text-section, .translation-section, .review-section {
    padding: 20px;
  }
  
  .turkish-text {
    padding: 15px;
  }
  
  .submit-btn, .new-btn {
    padding: 12px 30px;
    font-size: 1rem;
  }
  
  .review-cards {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .review-card {
    padding: 15px;
  }
  
  .score-circle {
    width: 60px;
    height: 60px;
  }
  
  .score-number {
    font-size: 1.5rem;
  }
  
  .score-total {
    font-size: 1rem;
  }
  
  .score-stats {
    gap: 15px;
  }
  
  .stat-item {
    min-width: 120px;
    padding: 12px 15px;
  }
  
  .stat-icon {
    font-size: 1.5rem;
    margin-right: 8px;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
  
  .language-selectors {
    flex-direction: column;
    gap: 15px;
  }
  
  .language-dropdown {
    min-width: 180px;
  }
  
  .direction-switch-btn {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.8rem;
  }
  
  .app-header p {
    font-size: 1rem;
  }
  
  .text-section h2, .translation-section h2, .review-section h2 {
    font-size: 1.2rem;
  }
  
  .score-stats {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
  
  .stat-item {
    min-width: 200px;
    justify-content: center;
  }
  
  .stat-icon {
    font-size: 1.4rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
}