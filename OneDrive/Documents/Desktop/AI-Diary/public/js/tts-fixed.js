// TTS Function
window.generateTTS = async function(entryId) {
    console.log('TTS called for entry:', entryId);
    
    // Find button with fallbacks
    let button = document.querySelector(`[onclick="generateTTS('${entryId}')"]`) || 
                document.querySelector('.listen-btn') || 
                document.querySelector(`[onclick*="${entryId}"]`);
    
    if (!button) {
        console.error('Button not found');
        alert('Button not found! Page may need refresh.');
        return;
    }
    
    const originalText = button.innerHTML;
    
    // Enable button completely
    const enableButton = () => {
        button.disabled = false;
        button.removeAttribute('disabled');
        button.style.pointerEvents = 'auto';
        button.style.cursor = 'pointer';
        button.style.opacity = '1';
        button.classList.remove('generating', 'playing');
    };
    
    enableButton();
    
    try {
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        button.classList.add('generating');
        
        const response = await fetch(`/tts/generate/${entryId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to generate TTS');
        }
        
        enableButton();
        
        if (data.useBrowserTTS && window.speechSynthesis) {
            button.innerHTML = '<i class="fas fa-volume-up"></i> Speaking...';
            button.classList.add('playing');
            
            speechSynthesis.cancel();
            
            const utterance = new SpeechSynthesisUtterance(data.text);
            utterance.lang = 'hi-IN';
            utterance.pitch = 0.7;
            utterance.rate = 0.8;
            utterance.volume = 1.0;
            
            // Find suitable voice
            const voices = speechSynthesis.getVoices();
            const hindiVoice = voices.find(v => v.lang.includes('hi')) || 
                             voices.find(v => v.lang.includes('en-IN')) ||
                             voices[0];
            
            if (hindiVoice) utterance.voice = hindiVoice;
            
            utterance.onstart = () => {
                button.innerHTML = '<i class="fas fa-volume-up"></i> Playing...';
                alert('🎬 Filmy voiceover शुरू! बॉलीवुड style में सुनिए!');
            };
            
            utterance.onend = () => {
                button.innerHTML = '<i class="fas fa-volume-up"></i> Filmy Voiceover';
                enableButton();
            };
            
            utterance.onerror = (error) => {
                console.error('Speech error:', error);
                button.innerHTML = '<i class="fas fa-volume-up"></i> Try Again';
                enableButton();
                alert('❌ Voice error! Click to try again.');
            };
            
            speechSynthesis.speak(utterance);
            showAudioPlayer(entryId);
            
        } else {
            button.innerHTML = '<i class="fas fa-info-circle"></i> Mock TTS';
            alert('🎵 TTS Generated! (Browser TTS not available)');
            
            setTimeout(() => {
                button.innerHTML = originalText;
            }, 2000);
        }
        
    } catch (error) {
        console.error('Error:', error);
        
        button.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        enableButton();
        
        alert('❌ Error: ' + error.message + '\nClick to try again!');
        
        setTimeout(() => {
            button.innerHTML = originalText;
            enableButton();
        }, 3000);
    }
};

// Audio player helper
function showAudioPlayer(entryId) {
    const entryCard = document.querySelector(`[data-entry-id="${entryId}"]`);
    if (!entryCard) return;
    
    const existing = entryCard.querySelector('.audio-player');
    if (existing) existing.remove();
    
    const audioDiv = document.createElement('div');
    audioDiv.className = 'audio-player';
    audioDiv.innerHTML = `
        <div style="background: #e3f2fd; border: 1px solid #2196f3; border-radius: 8px; padding: 10px; margin: 10px 0; text-align: center;">
            <i class="fas fa-volume-up" style="color: #2196f3; animation: pulse 1s infinite;"></i>
            <strong>🎬 FILMY BOLLYWOOD VOICEOVER चल रहा है!</strong>
            <br><small>🎭 Dramatic style में सुन रहे हैं आपकी diary!</small>
            <br>
            <button onclick="speechSynthesis.cancel(); this.closest('.audio-player').remove();" 
                    style="margin-top: 5px; padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                <i class="fas fa-stop"></i> बंद करो
            </button>
        </div>
    `;
    
    const cardContent = entryCard.querySelector('.card-content');
    if (cardContent) {
        cardContent.appendChild(audioDiv);
    }
}

// Fix all TTS buttons
window.fixAllTTSButtons = function() {
    const buttons = document.querySelectorAll('[onclick*="generateTTS"], .listen-btn, .dropdown-item');
    
    buttons.forEach((btn) => {
        btn.disabled = false;
        btn.removeAttribute('disabled');
        btn.style.pointerEvents = 'auto';
        btn.style.cursor = 'pointer';
        btn.style.opacity = '1';
        btn.classList.remove('generating', 'playing');
    });
    
    return buttons.length;
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.fixAllTTSButtons();
        console.log('TTS buttons initialized');
    }, 1000);
});

window.addEventListener('load', () => {
    setTimeout(window.fixAllTTSButtons, 2000);
});

console.log('TTS script loaded successfully');
