document.addEventListener('DOMContentLoaded', function() {
    // Sample image data - in a real application, you might fetch this from an API
    const images = [
      {
        src: "assests/DALL·E 2025-03-24 00.13.19 - A professional and clean vertical banner image with more height (portrait orientation). The heading text reads 'Start the Free Video Call with Doctor .webp",
        alt: "Minimalist design"
      },
      {
        src: "assests/chatbotimg.jpeg",
        alt: "Abstract shape"
      },
      {
        src: "assests/Screenshot 2025-03-27 174700.png",
        alt: "dff"
      },
      {
        src: "assests/Screenshot 2025-03-27 175330.png",
        alt: "Minimalist interior"
      },
      {
        src: "assests/Screenshot 2025-03-27 180044.png",
        alt: "Geometric design"
      },
      {
        src: "assests/Screenshot 2025-03-27 180421.png",
        alt: "Modern furniture"
      },
      {
        src: "assests/Screenshot 2025-03-27 180709.png",
        alt: "Minimalist beach"
      }
    ];
  
    // DOM elements
    const imageTrack = document.getElementById('imageTrack');
    const indicators = document.getElementById('indicators');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
  
    // Variables for tracking state
    let currentIndex = 0;
    let isPlaying = true;
    let autoScrollInterval;
    const scrollSpeed = 60; // lower is faster
    const imageWidth = 300; // should match CSS
    const imageGap = 24; // should match CSS margin-right
  
    // Initialize gallery
    function initGallery() {
      // Create image elements
      images.forEach((image, index) => {
        // Add images to track
        const img = document.createElement('img');
        img.src = image.src;
        img.alt = image.alt;
        img.className = 'gallery-image';
        imageTrack.appendChild(img);
  
        // Create indicators
        const dot = document.createElement('div');
        dot.className = index === 0 ? 'indicator active' : 'indicator';
        dot.dataset.index = index;
        dot.addEventListener('click', () => {
          goToSlide(index);
        });
        indicators.appendChild(dot);
      });
  
      // Add duplicate images for infinite scroll effect
      const duplicates = [...imageTrack.querySelectorAll('.gallery-image')]
        .slice(0, Math.min(images.length, 3))
        .map(img => img.cloneNode(true));
      
      duplicates.forEach(img => {
        imageTrack.appendChild(img);
      });
  
      // Start auto scrolling
      startAutoScroll();
    }
  
    // Auto scroll function
    function startAutoScroll() {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
      
      autoScrollInterval = setInterval(() => {
        if (isPlaying) {
          if (currentIndex < images.length - 1) {
            currentIndex++;
          } else {
            // Reset to first slide with a quick transition
            imageTrack.style.transition = 'none';
            imageTrack.style.transform = 'translateX(0)';
            currentIndex = 0;
            // Force reflow
            void imageTrack.offsetWidth;
            imageTrack.style.transition = 'transform 0.5s ease';
          }
          updateGallery();
        }
      }, scrollSpeed * 100);
    }
  
    // Update gallery position and indicators
    function updateGallery() {
      // Update image track position
      const position = -currentIndex * (imageWidth + imageGap);
      imageTrack.style.transform = `translateX(${position}px)`;
      
      // Update indicators
      document.querySelectorAll('.indicator').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }
  
    // Go to specific slide
    function goToSlide(index) {
      currentIndex = index;
      updateGallery();
    }
  
    // Event listeners for controls
    prevButton.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - 1);
      updateGallery();
    });
  
    nextButton.addEventListener('click', () => {
      currentIndex = Math.min(images.length - 1, currentIndex + 1);
      updateGallery();
    });
  
    // Initialize the gallery
    initGallery();
  });
  const translations = {
    en: {
      heading: "Get Instant Medical Advice With AI Doctor",
      consultBtn: "Consult Now",
      findDoctorBtn: "Find me the right doctor",
      // add more text keys
    },
    te: {
      heading: "AI డాక్టర్ తో తక్షణ వైద్య సలహా పొందండి",
      consultBtn: "ఇప్పుడు సంప్రదించండి",
      findDoctorBtn: "సరైన డాక్టర్ ని కనుగొనండి",
    },
    hi: {
      heading: "एआई डॉक्टर के साथ तुरंत मेडिकल सलाह लें",
      consultBtn: "अभी परामर्श करें",
      findDoctorBtn: "मेरे लिए सही डॉक्टर खोजें",
    }
  };


  const micBtn = document.getElementById('mic-btn');
const userSpeechText = document.getElementById('user-speech-text');
const languageSelect = document.getElementById('language-select');

micBtn.addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = languageSelect.value; // dynamically set based on selected language
  recognition.start();

  recognition.onstart = () => {
    userSpeechText.innerText = 'Listening... Speak now.';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userSpeechText.innerText = `You said: "${transcript}"`;
    // Optionally: forward this to your AI suggestion system
  };

  recognition.onerror = (event) => {
    userSpeechText.innerText = `Error: ${event.error}`;
  };
});

const playResponseBtn = document.getElementById('play-response-btn');

micBtn.addEventListener('click', () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = languageSelect.value;
  recognition.start();

  recognition.onstart = () => {
    userSpeechText.innerText = 'Listening... Speak now.';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userSpeechText.innerText = `You said: "${transcript}"`;

    // Example AI response (you can make it dynamic later)
    let aiResponse = '';
    if (languageSelect.value === 'te-IN') {
      aiResponse = 'మీ సమస్యకు సరైన డాక్టర్‌ను కనుగొనడానికి ఈ క్రింది లింక్‌ను ఉపయోగించండి.';
    } else if (languageSelect.value === 'hi-IN') {
      aiResponse = 'कृपया सही डॉक्टर खोजने के लिए नीचे दिए गए लिंक का उपयोग करें।';
    }

    playResponseBtn.disabled = false;
    playResponseBtn.onclick = () => {
      const speech = new SpeechSynthesisUtterance(aiResponse);
      speech.lang = languageSelect.value;
      window.speechSynthesis.speak(speech);
    };
  };

  recognition.onerror = (event) => {
    userSpeechText.innerText = `Error: ${event.error}`;
  };
});
