document.addEventListener('DOMContentLoaded', () => {
  console.log('✨ The Dreams JavaScript Initialized');

  // 1. Sticky Navbar Scroll Effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // 2. Parallax Scroll Motion
  const parallaxBg = document.querySelector('.hero-bg-layer');
  if (parallaxBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      parallaxBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    });
  }

  // 3. Sidebar Chatbot Widget Interactions
  const chatbotToggle = document.getElementById('chatbotToggle');
  const chatbotPanel = document.getElementById('chatbotPanel');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotSend = document.getElementById('chatbotSend');
  const chatbotBody = document.getElementById('chatbotBody');

  if (chatbotToggle && chatbotPanel) {
    chatbotToggle.addEventListener('click', () => {
      chatbotPanel.classList.toggle('open');
      if (chatbotPanel.classList.contains('open') && chatbotInput) {
        chatbotInput.focus();
      }
    });

    if (chatbotClose) {
      chatbotClose.addEventListener('click', () => {
        chatbotPanel.classList.remove('open');
      });
    }

    const appendMessage = (text, sender, links = []) => {
      if (!chatbotBody) return;
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;

      let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedText = formattedText.replace(/\n/g, '<br>');
      msgDiv.innerHTML = formattedText;

      if (links && links.length > 0) {
        const linksDiv = document.createElement('div');
        linksDiv.style.marginTop = '8px';
        links.forEach((l) => {
          const a = document.createElement('a');
          a.href = l.url;
          a.textContent = l.text;
          a.className = 'btn btn-ghost';
          a.style.fontSize = '0.75rem';
          a.style.padding = '4px 8px';
          a.style.display = 'inline-block';
          linksDiv.appendChild(a);
        });
        msgDiv.appendChild(linksDiv);
      }

      chatbotBody.appendChild(msgDiv);
      chatbotBody.scrollTop = chatbotBody.scrollHeight;
    };

    const sendChatQuery = async () => {
      const query = chatbotInput ? chatbotInput.value.trim() : '';
      if (!query) return;

      appendMessage(query, 'user');
      if (chatbotInput) chatbotInput.value = '';

      try {
        const res = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: query }),
        });
        const data = await res.json();

        if (res.ok) {
          appendMessage(data.reply, 'bot', data.links);
        } else {
          appendMessage('Sorry, I encountered an issue. Please try again.', 'bot');
        }
      } catch (err) {
        console.error('Chatbot error:', err);
        appendMessage('Network error. Please check your connection.', 'bot');
      }
    };

    if (chatbotSend) chatbotSend.addEventListener('click', sendChatQuery);
    if (chatbotInput) {
      chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatQuery();
      });
    }
  }
});
