document.addEventListener('DOMContentLoaded', function() {
    // 이미지 슬라이더 기능
    const track = document.querySelector('.showcase-track');
    const slides = Array.from(document.querySelectorAll('.showcase-slide'));
    const nextButton = document.querySelector('.showcase-nav.next');
    const prevButton = document.querySelector('.showcase-nav.prev');
    const dotsContainer = document.querySelector('.showcase-dots');
    
    let currentIndex = 0;
    const slideWidth = 50; // 슬라이드 너비 (%)
    
    // 도트 생성
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.classList.add('showcase-dot');
        if (idx === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    
    const dots = Array.from(document.querySelectorAll('.showcase-dot'));
    
    // 슬라이드 이동 함수
    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        track.style.transform = `translateX(-${index * slideWidth}%)`;
        currentIndex = index;
        
        // 도트 업데이트
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }
    
    // 이벤트 리스너
    nextButton.addEventListener('click', () => goToSlide(currentIndex + 1));
    prevButton.addEventListener('click', () => goToSlide(currentIndex - 1));
    
    // 모바일 터치 이벤트
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
    });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }
    
    // 자동 슬라이드
    let slideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    
    const slider = document.querySelector('.showcase-slider');
    
    slider.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    slider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
    });
    
    // 스크롤 시 헤더 스타일 변경
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // 네비게이션 링크 클릭 시 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 모바일 메뉴 토글
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navList = document.querySelector('.nav-list');
    
    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            
            // 모바일 메뉴 열려있을 때 클릭하면 닫기
            if (navList.classList.contains('active')) {
                document.addEventListener('click', function closeMenu(e) {
                    if (!navList.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                        navList.classList.remove('active');
                        mobileMenuBtn.classList.remove('active');
                        document.removeEventListener('click', closeMenu);
                    }
                });
            }
        });
    }

    // 서비스 신청 폼 처리
    document.getElementById('serviceForm').addEventListener('submit', function(e) {
        e.preventDefault();

        // 폼 데이터 수집
        const formData = {
            name: document.getElementById('name').value,
            institution: document.getElementById('institution').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            serviceType: document.getElementById('service-type').value,
            sampleCount: document.getElementById('sample-count').value,
            sampleInfo: document.getElementById('sample-info').value,
            notes: document.getElementById('notes').value
        };

        // 이메일 본문 생성
        const emailBody = `
신규 서비스 신청이 접수되었습니다.

신청자 정보:
- 이름: ${formData.name}
- 소속기관: ${formData.institution}
- 이메일: ${formData.email}
- 연락처: ${formData.phone}

서비스 정보:
- 의뢰 서비스: ${formData.serviceType}
- 검체 수: ${formData.sampleCount}

검체 정보:
${formData.sampleInfo}

비고:
${formData.notes}
        `;

        // mailto 링크 생성
        const mailtoLink = `mailto:histopath@pusan.ac.kr?subject=서비스 신청 - ${formData.name}&body=${encodeURIComponent(emailBody)}`;

        // 새 창에서 이메일 클라이언트 열기
        window.open(mailtoLink);

        // 사용자에게 알림
        alert('신청서가 작성되었습니다. 이메일 클라이언트가 열리면 내용을 확인하시고 발송해주세요.');

        // 폼 초기화
        this.reset();
    });
}); 