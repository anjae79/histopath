// 서비스 옵션 데이터
const specialStainTypes = [
    { value: "pas", label: "PAS 염색" },
    { value: "masson", label: "Masson's Trichrome 염색" },
    { value: "alcian", label: "Alcian Blue 염색" },
    { value: "sirius", label: "Pico Sirius Red 염색" },
    { value: "oil", label: "Oil Red O 염색" }
];

const serviceOptions = {
    paraffin: [
        { value: "paraffin_block", label: "1. Only Block - 조직처리 및 파라핀 블록 제작" },
        { value: "paraffin_section", label: "2. Only Section - 기존 블록으로부터 절편 제작" },
        { value: "paraffin_section_he", label: "3. Section & H&E - 절편 제작 및 H&E 염색" },
        { value: "paraffin_he", label: "4. Only H&E - 기존 절편의 H&E 염색" },
        { value: "paraffin_full", label: "5. Block & Section & H&E - 전체 과정" }
    ],
    frozen: [
        { value: "frozen_block", label: "1. Only Block - 동결 블록 제작" },
        { value: "frozen_section", label: "2. Only Section - 동결 절편 제작" },
        { value: "frozen_he", label: "3. H&E 염색" },
        { value: "frozen_section_he", label: "4. Section & H&E - 절편 제작 및 염색" },
        { value: "frozen_full", label: "5. Block & Section & H&E - 전체 과정" }
    ],
    special: [
        { value: "special_block", label: "1. Only Block - 특수 처리 블록 제작" },
        { value: "special_section", label: "2. Only Section - 특수 절편 제작" },
        { value: "special_stain", label: "3. Only Stain - 특수 염색만 진행" },
        { value: "special_section_stain", label: "4. Section & Stain - 절편 제작 및 특수 염색" },
        { value: "special_full", label: "5. Block & Section & Stain - 전체 과정" }
    ],
    ihc: [
        { value: "ihc_block", label: "1. Only Block - 면역염색용 블록 제작" },
        { value: "ihc_section", label: "2. Only Section - 면역염색용 절편 제작" },
        { value: "ihc_stain", label: "3. Only Stain - 면역염색만 진행" },
        { value: "ihc_section_stain", label: "4. Section & Stain - 절편 제작 및 면역염색" },
        { value: "ihc_full", label: "5. Block & Section & Stain - 전체 과정" }
    ],
    icc: [
        { value: "icc_prep", label: "1. 세포 준비" },
        { value: "icc_stain", label: "2. ICC 염색" },
        { value: "icc_full", label: "3. 세포 준비 및 ICC 염색" }
    ],
    if: [
        { value: "if_block", label: "1. Only Block - 면역형광염색용 블록 제작" },
        { value: "if_section", label: "2. Only Section - 면역형광염색용 절편 제작" },
        { value: "if_stain", label: "3. Only Stain - 면역형광염색만 진행" },
        { value: "if_section_stain", label: "4. Section & Stain - 절편 제작 및 면역형광염색" },
        { value: "if_full", label: "5. Block & Section & Stain - 전체 과정" }
    ],
    fish: [
        { value: "fish_block", label: "1. Only Block - FISH용 블록 제작" },
        { value: "fish_section", label: "2. Only Section - FISH용 절편 제작" },
        { value: "fish_stain", label: "3. Only Stain - FISH 분석만 진행" },
        { value: "fish_section_stain", label: "4. Section & Stain - 절편 제작 및 FISH 분석" },
        { value: "fish_full", label: "5. Block & Section & Stain - 전체 과정" }
    ],
    tma: [
        { value: "tma_block", label: "1. Only Block - TMA 블록 제작" },
        { value: "tma_section", label: "2. Only Section - TMA 절편 제작" },
        { value: "tma_stain", label: "3. Only Stain - TMA 염색만 진행" },
        { value: "tma_section_stain", label: "4. Section & Stain - 절편 제작 및 TMA 염색" },
        { value: "tma_full", label: "5. Block & Section & Stain - 전체 과정" }
    ],
    extraction: [
        { value: "dna_extraction", label: "DNA Extraction" },
        { value: "rna_extraction", label: "RNA Extraction" }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // DOM 요소 캐싱
    const mainServiceSelect = document.getElementById('main-service');
    const specialTypeSelect = document.getElementById('special-type');
    const subServiceSelect = document.getElementById('sub-service');
    const specialTypeRow = document.querySelector('.special-type-row');
    const subServiceRow = document.querySelector('.sub-service-row');
    const sampleCountInput = document.getElementById('sample-count');
    const slideCountInput = document.getElementById('slide-count');
    const addServiceBtn = document.getElementById('add-service-btn');
    const selectedServicesList = document.getElementById('selected-services-list');

    // 선택된 서비스들을 저장할 배열
    let selectedServices = [];
    // 현재 작성 중인 서비스 데이터
    let currentService = {
        sampleCount: '',
        mainService: '',
        subService: '',
        slideCount: ''
    };

    function updateCurrentService() {
        currentService.sampleCount = sampleCountInput.value;
        currentService.mainService = mainServiceSelect.options[mainServiceSelect.selectedIndex]?.text || '-';
        
        if (mainServiceSelect.value === 'special' && specialTypeSelect.value) {
            const specialType = specialTypeSelect.options[specialTypeSelect.selectedIndex]?.text;
            const subServiceText = subServiceSelect.options[subServiceSelect.selectedIndex]?.text;
            if (specialType && subServiceText) {
                currentService.subService = `${specialType} - ${subServiceText}`;
            }
        } else if (subServiceSelect.value) {
            currentService.subService = subServiceSelect.options[subServiceSelect.selectedIndex]?.text || '-';
        } else {
            currentService.subService = '-';
        }
        
        currentService.slideCount = slideCountInput.value;

        updateServicesList();
    }

    function clearServiceForm() {
        mainServiceSelect.value = '';
        specialTypeSelect.value = '';
        subServiceSelect.value = '';
        sampleCountInput.value = '';
        slideCountInput.value = '';
        specialTypeRow.style.display = 'none';
        subServiceRow.style.display = 'none';
        specialTypeSelect.disabled = true;
        subServiceSelect.disabled = true;

        // 현재 서비스 데이터 초기화
        currentService = {
            sampleCount: '',
            mainService: '',
            subService: '',
            slideCount: ''
        };
    }

    function addServiceToList() {
        if (!currentService.sampleCount || !currentService.mainService || !currentService.slideCount) {
            alert('필수 항목을 모두 입력해주세요.');
            return false;
        }

        selectedServices.push({...currentService});
        clearServiceForm();
        updateServicesList();
        return true;
    }

    function updateServicesList() {
        selectedServicesList.innerHTML = '';
        
        // 저장된 서비스들 표시
        selectedServices.forEach((service, index) => {
            const serviceItem = document.createElement('div');
            serviceItem.className = 'service-item';
            serviceItem.innerHTML = `
                <span>${service.sampleCount}</span>
                <span>${service.mainService}</span>
                <span>${service.subService}</span>
                <span>${service.slideCount}</span>
                <button type="button" class="remove-service" data-index="${index}" title="삭제">×</button>
            `;
            selectedServicesList.appendChild(serviceItem);

            // 삭제 버튼에 이벤트 리스너 추가
            const removeBtn = serviceItem.querySelector('.remove-service');
            removeBtn.addEventListener('click', () => {
                selectedServices.splice(index, 1);
                updateServicesList();
            });
        });

        // 현재 작성 중인 서비스 표시 (값이 있는 경우에만)
        if (currentService.sampleCount || currentService.mainService || currentService.slideCount) {
            const currentServiceItem = document.createElement('div');
            currentServiceItem.className = 'service-item current';
            currentServiceItem.innerHTML = `
                <span>${currentService.sampleCount || '-'}</span>
                <span>${currentService.mainService || '-'}</span>
                <span>${currentService.subService || '-'}</span>
                <span>${currentService.slideCount || '-'}</span>
            `;
            selectedServicesList.appendChild(currentServiceItem);
        }
    }

    // 입력 필드 변경 이벤트 리스너
    sampleCountInput.addEventListener('input', updateCurrentService);
    slideCountInput.addEventListener('input', updateCurrentService);
    mainServiceSelect.addEventListener('change', function() {
        console.log('Main service changed:', this.value);
        
        // 모든 선택 초기화
        specialTypeRow.style.display = 'none';
        specialTypeSelect.disabled = true;
        specialTypeSelect.required = false;
        subServiceRow.style.display = 'none';
        subServiceSelect.disabled = true;
        subServiceSelect.required = false;
        
        if (this.value === 'special') {
            // 특수염색 선택 시 특수염색 종류 선택 표시
            specialTypeSelect.innerHTML = '<option value="">특수염색 종류를 선택하세요</option>' +
                specialStainTypes.map(option => 
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');
            specialTypeRow.style.display = 'block';
            specialTypeSelect.disabled = false;
            specialTypeSelect.required = true;
        } else if (this.value) {
            // 다른 서비스 선택 시 바로 세부 서비스 표시
            subServiceSelect.innerHTML = '<option value="">세부 서비스를 선택하세요</option>' +
                serviceOptions[this.value].map(option => 
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');
            subServiceRow.style.display = 'block';
            subServiceSelect.disabled = false;
            subServiceSelect.required = true;
        }
        
        updateCurrentService();
    });

    // 특수염색 종류 선택 시 처리
    specialTypeSelect.addEventListener('change', function() {
        console.log('Special type changed:', this.value);
        
        if (this.value) {
            subServiceSelect.innerHTML = '<option value="">세부 서비스를 선택하세요</option>' +
                serviceOptions['special'].map(option => 
                    `<option value="${option.value}_${this.value}">${option.label}</option>`
                ).join('');
            subServiceRow.style.display = 'block';
            subServiceSelect.disabled = false;
            subServiceSelect.required = true;
        } else {
            subServiceRow.style.display = 'none';
            subServiceSelect.disabled = true;
            subServiceSelect.required = false;
        }
        
        updateCurrentService();
    });

    // 세부 서비스 선택 시 처리
    subServiceSelect.addEventListener('change', updateCurrentService);

    // 추가 의뢰 서비스 버튼 클릭 이벤트
    addServiceBtn.addEventListener('click', addServiceToList);

    // 폼 제출 이벤트 핸들러
    const serviceForm = document.getElementById('serviceForm');
    serviceForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // 필수 입력 필드 검증
        const name = document.getElementById('name').value;
        const institution = document.getElementById('institution').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const sampleInfo = document.getElementById('sample-info').value;
        
        if (!name || !institution || !email || !phone || !sampleInfo || selectedServices.length === 0) {
            alert('모든 필수 항목을 입력해주세요.');
            return;
        }

        // 이메일 본문 생성
        let emailBody = `
신규 서비스 신청이 접수되었습니다.

신청자 정보:
- 이름/담당교수: ${name}
- 소속기관: ${institution}
- 이메일: ${email}
- 연락처: ${phone}

의뢰 서비스 목록:
`;

        // 선택된 서비스 정보 추가
        selectedServices.forEach((service, index) => {
            emailBody += `
[서비스 ${index + 1}]
- 검체 수: ${service.sampleCount}
- 의뢰 서비스: ${service.mainService}
- 세부 서비스: ${service.subService}
- 슬라이드 수: ${service.slideCount}
`;
        });

        // 검체 정보와 요청사항 추가
        emailBody += `
검체 정보:
${sampleInfo}

요청사항:
${document.getElementById('request-details').value || '없음'}
`;

        // mailto 링크 생성 및 이메일 클라이언트 실행
        const mailtoLink = `mailto:histopath@pusan.ac.kr?subject=서비스 신청 - ${name}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailtoLink);

        // 사용자에게 알림
        alert('신청서가 작성되었습니다. 이메일 클라이언트가 열리면 내용을 확인하시고 발송해주세요.');

        // 폼 초기화
        serviceForm.reset();
        selectedServices = [];
        updateServicesList();
        clearServiceForm();
    });
}); 