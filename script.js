// 분석 옵션 데이터
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
    const specialTypeGroup = document.querySelector('.special-type-group');
    const subServiceGroup = document.querySelector('.sub-service-group');
    const sampleCountInput = document.getElementById('sample-count');
    const slideCountInput = document.getElementById('slide-count');
    const totalCountInput = document.getElementById('total-count');
    const addServiceBtn = document.getElementById('add-service-btn');
    const servicesListTable = document.getElementById('services-list');

    // 선택된 분석들을 저장할 배열
    let selectedServices = [];
    // 현재 작성 중인 분석 데이터
    let currentService = {
        sampleCount: '',
        mainService: '',
        subService: '',
        slideCount: '',
        totalCount: ''
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
        
        // 의뢰 총수량 계산 (검체 수 × 슬라이드 수)
        const sampleCount = parseInt(sampleCountInput.value) || 0;
        const slideCount = parseInt(slideCountInput.value) || 0;
        const totalCount = sampleCount * slideCount;
        currentService.totalCount = totalCount;
        totalCountInput.value = totalCount;

        updateServicesList();
    }

    function clearServiceForm() {
        mainServiceSelect.value = '';
        specialTypeSelect.value = '';
        subServiceSelect.value = '';
        sampleCountInput.value = '';
        slideCountInput.value = '';
        specialTypeGroup.style.display = 'none';
        subServiceGroup.style.display = 'none';
        specialTypeSelect.disabled = true;
        subServiceSelect.disabled = true;

        // 현재 서비스 데이터 초기화
        currentService = {
            sampleCount: '',
            mainService: '',
            subService: '',
            slideCount: '',
            totalCount: ''
        };
        
        totalCountInput.value = '';
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

    function addNewServiceRow() {
        // 상단 폼이 작성되어 있으면 목록에 추가
        if (currentService.sampleCount && currentService.mainService && currentService.slideCount) {
            selectedServices.push({...currentService});
            clearServiceForm();
            updateServicesList();
        } else {
            alert('현재 폼을 먼저 작성해주세요.');
        }
    }

    function collectAllFormData() {
        const allServices = [];
        
        // 현재 작성 중인 서비스 데이터 수집
        const currentServiceData = getCurrentServiceData();
        if (currentServiceData && currentServiceData.mainService) {
            allServices.push(currentServiceData);
        }
        
        // selectedServices 배열의 데이터 추가 (빈 값 제외)
        selectedServices.forEach(service => {
            if (service.sampleCount && service.mainService && service.slideCount) {
                allServices.push(service);
            }
        });
        
        return allServices;
    }

    function updateServicesList() {
        servicesListTable.innerHTML = '';
        
        // selectedServices 배열의 서비스들 표시 (완성된 서비스만)
        selectedServices.forEach((service, index) => {
            if (service.sampleCount && service.mainService && service.slideCount) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td data-label="검체 수">${service.sampleCount}</td>
                    <td data-label="의뢰 분석">${service.mainService}</td>
                    <td data-label="세부 분석">${service.subService}</td>
                    <td data-label="슬라이드 수">${service.slideCount}</td>
                    <td data-label="의뢰 총수량">${service.totalCount}</td>
                    <td data-label="삭제"><button type="button" class="remove-service btn-delete" data-index="${index}" title="이 분석 삭제">×</button></td>
                `;
                servicesListTable.appendChild(row);

                // 삭제 버튼에 이벤트 리스너 추가
                const removeBtn = row.querySelector('.remove-service');
                removeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 확인 대화상자 없이 바로 삭제
                    removeService(index);
                });
            }
        });

        // 상단 폼 데이터 표시 (현재 작성 중인 것)
        const currentServiceData = getCurrentServiceData();
        if (currentServiceData && (currentServiceData.sampleCount || currentServiceData.mainService || currentServiceData.slideCount)) {
            const currentRow = document.createElement('tr');
            currentRow.className = 'current-service';
            currentRow.style.backgroundColor = '#f8f9fa';
            currentRow.innerHTML = `
                <td data-label="검체 수">${currentServiceData.sampleCount || '-'}</td>
                <td data-label="의뢰 분석">${currentServiceData.mainService || '-'}</td>
                <td data-label="세부 분석">${currentServiceData.subService || '-'}</td>
                <td data-label="슬라이드 수">${currentServiceData.slideCount || '-'}</td>
                <td data-label="의뢰 총수량">${currentServiceData.totalCount || '-'}</td>
                <td data-label="삭제"><button type="button" class="remove-service btn-clear" data-index="current" title="현재 작성 중인 내용 지우기">×</button></td>
            `;
            servicesListTable.appendChild(currentRow);

            // 삭제 버튼에 이벤트 리스너 추가
            const removeBtn = currentRow.querySelector('.remove-service');
            removeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // 확인 대화상자 없이 바로 삭제
                clearServiceForm();
                updateServicesList();
            });
        }
    }

    // 분석 삭제 함수
    function removeService(index) {
        if (index >= 0 && index < selectedServices.length) {
            const removedService = selectedServices[index];
            selectedServices.splice(index, 1);
            updateServicesList();
            
            // 삭제 완료 알림
            showNotification(`"${removedService.mainService}" 분석이 삭제되었습니다.`, 'success');
        }
    }

    // 알림 메시지 표시 함수
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
            color: white;
            padding: 12px 20px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 1000;
            font-size: 14px;
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3초 후 자동 제거
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 3000);
    }

    // 입력 내용으로 신청서 생성 버튼 이벤트
    document.getElementById('generate-form-btn').addEventListener('click', function() {
        // 현재 입력된 데이터 수집
        const formData = {
            name: document.getElementById('name').value,
            institution: document.getElementById('institution').value,
            department: document.getElementById('department').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            sampleName: document.getElementById('sample-name').value,
            sampleTypes: Array.from(document.querySelectorAll('input[name="sample-type"]:checked')).map(cb => cb.nextElementSibling.textContent),
            fixatives: Array.from(document.querySelectorAll('input[name="fixative"]:checked')).map(cb => cb.nextElementSibling.textContent),
            specialRequests: document.getElementById('special-requests').value,
            services: [...selectedServices] // 선택된 서비스들 복사
        };

        // 현재 작성 중인 서비스도 포함
        const currentService = getCurrentServiceData();
        if (currentService && currentService.mainService) {
            formData.services.push(currentService);
        }

        if (formData.services.length === 0) {
            alert('분석을 선택해주세요.');
            return;
        }

        // 데이터를 URL 파라미터로 전달하여 신청서 양식 열기
        const params = new URLSearchParams();
        params.set('data', JSON.stringify(formData));
        
        const url = `application-form.html?${params.toString()}`;
        window.open(url, '_blank');
    });

    // 현재 작성 중인 서비스 데이터 가져오기
    function getCurrentServiceData() {
        const mainService = document.getElementById('main-service').value;
        const sampleCount = document.getElementById('sample-count').value;
        const slideCount = document.getElementById('slide-count').value;
        
        if (!mainService || !sampleCount || !slideCount) {
            return null;
        }

        const serviceNames = {
            'paraffin': '파라핀 포매',
            'frozen': '동결절편',
            'special': '특수염색',
            'ihc': '면역조직화학염색 (IHC)',
            'icc': '면역세포화학염색 (ICC)',
            'if': '면역형광염색 (IF)',
            'fish': '형광제자리부합법 (FISH)',
            'tma': 'Tissue Microarray (TMA)',
            'extraction': 'DNA/RNA 추출'
        };

        let subService = '';
        const subServiceSelect = document.getElementById('sub-service');
        const specialTypeSelect = document.getElementById('special-type');
        
        if (subServiceSelect.style.display !== 'none' && subServiceSelect.value) {
            subService = subServiceSelect.options[subServiceSelect.selectedIndex].text;
        } else if (specialTypeSelect.style.display !== 'none' && specialTypeSelect.value) {
            subService = specialTypeSelect.options[specialTypeSelect.selectedIndex].text;
        }

        return {
            mainService: serviceNames[mainService] || mainService,
            subService: subService,
            sampleCount: sampleCount,
            slideCount: slideCount,
            totalCount: parseInt(sampleCount) * parseInt(slideCount)
        };
    }

    // 입력 필드 변경 이벤트 리스너
    sampleCountInput.addEventListener('input', updateCurrentService);
    slideCountInput.addEventListener('input', updateCurrentService);
    mainServiceSelect.addEventListener('change', function() {
        console.log('Main service changed:', this.value);
        
        // 모든 선택 초기화
        specialTypeGroup.style.display = 'none';
        specialTypeSelect.disabled = true;
        specialTypeSelect.required = false;
        subServiceGroup.style.display = 'none';
        subServiceSelect.disabled = true;
        subServiceSelect.required = false;
        
        if (this.value === 'special') {
            // 특수염색 선택 시 특수염색 종류 선택 표시
            specialTypeSelect.innerHTML = '<option value="">특수염색 종류를 선택하세요</option>' +
                specialStainTypes.map(option => 
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');
            specialTypeGroup.style.display = 'block';
            specialTypeSelect.disabled = false;
            specialTypeSelect.required = false;
        } else if (this.value) {
            // 다른 서비스 선택 시 바로 세부 서비스 표시
            subServiceSelect.innerHTML = '<option value="">세부 서비스를 선택하세요</option>' +
                serviceOptions[this.value].map(option => 
                    `<option value="${option.value}">${option.label}</option>`
                ).join('');
            subServiceGroup.style.display = 'block';
            subServiceSelect.disabled = false;
            subServiceSelect.required = false;
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
            subServiceGroup.style.display = 'block';
            subServiceSelect.disabled = false;
            subServiceSelect.required = false;
        } else {
            subServiceGroup.style.display = 'none';
            subServiceSelect.disabled = true;
            subServiceSelect.required = false;
        }
        
        updateCurrentService();
    });

    // 세부 서비스 선택 시 처리
    subServiceSelect.addEventListener('change', updateCurrentService);

    // 추가 의뢰 서비스 버튼 클릭 이벤트
    addServiceBtn.addEventListener('click', function() {
        addNewServiceRow();
    });

    // 입력 필드 클리어 버튼 기능
    function initClearInputButtons() {
        console.log('클리어 버튼 초기화 시작');
        const clearButtons = document.querySelectorAll('.clear-input-btn');
        console.log('찾은 클리어 버튼 개수:', clearButtons.length);
        
        clearButtons.forEach((button, index) => {
            console.log(`클리어 버튼 ${index + 1} 이벤트 리스너 추가`);
            button.addEventListener('click', function(e) {
                console.log('클리어 버튼 클릭됨');
                e.preventDefault();
                e.stopPropagation();
                
                const targetId = this.getAttribute('data-target');
                console.log('타겟 ID:', targetId);
                const targetInput = document.getElementById(targetId);
                
                if (targetInput) {
                    console.log('타겟 입력 필드 찾음:', targetInput);
                    // 확인 대화상자 없이 바로 삭제
                    targetInput.value = '';
                    targetInput.focus();
                    
                    // 버튼 숨기기
                    this.style.display = 'none';
                    
                    // 알림 표시
                    showNotification('필드 내용이 삭제되었습니다.', 'success');
                    console.log('필드 내용 삭제 완료');
                } else {
                    console.log('타겟 입력 필드를 찾을 수 없음');
                }
            });
        });

        // 입력 필드 변화 감지하여 클리어 버튼 표시/숨김
        const inputFields = document.querySelectorAll('.input-wrapper input, .input-wrapper textarea');
        console.log('찾은 입력 필드 개수:', inputFields.length);
        
        inputFields.forEach((input, index) => {
            const clearBtn = input.nextElementSibling;
            console.log(`입력 필드 ${index + 1}:`, input.id, '클리어 버튼:', clearBtn);
            
            if (clearBtn && clearBtn.classList.contains('clear-input-btn')) {
                // 초기 상태 설정
                function updateClearButtonVisibility() {
                    if (input.value.trim() !== '') {
                        clearBtn.style.display = 'flex';
                        console.log(`클리어 버튼 표시: ${input.id}`);
                    } else {
                        clearBtn.style.display = 'none';
                        console.log(`클리어 버튼 숨김: ${input.id}`);
                    }
                }
                
                // 이벤트 리스너 추가
                input.addEventListener('input', updateClearButtonVisibility);
                input.addEventListener('focus', updateClearButtonVisibility);
                input.addEventListener('blur', updateClearButtonVisibility);
                
                // 페이지 로드 시 초기 상태 설정
                updateClearButtonVisibility();
            } else {
                console.log(`클리어 버튼을 찾을 수 없음: ${input.id}`);
            }
        });
    }

    // 클리어 버튼 초기화
    initClearInputButtons();
    initClearSelectButtons();
    initClearCheckboxButtons();
}); 

// Select 요소 클리어 버튼 기능
function initClearSelectButtons() {
    console.log('Select 클리어 버튼 초기화 시작');
    const clearSelectButtons = document.querySelectorAll('.clear-select-btn');
    console.log('찾은 Select 클리어 버튼 개수:', clearSelectButtons.length);
    
    clearSelectButtons.forEach((button, index) => {
        console.log(`Select 클리어 버튼 ${index + 1} 이벤트 리스너 추가`);
        button.addEventListener('click', function(e) {
            console.log('Select 클리어 버튼 클릭됨');
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            console.log('타겟 ID:', targetId);
            const targetSelect = document.getElementById(targetId);
            
            if (targetSelect) {
                console.log('타겟 Select 요소 찾음:', targetSelect);
                // 첫 번째 옵션(기본값)으로 리셋
                targetSelect.selectedIndex = 0;
                
                // change 이벤트 발생시켜서 관련 로직 실행
                const changeEvent = new Event('change', { bubbles: true });
                targetSelect.dispatchEvent(changeEvent);
                
                // 버튼 숨기기
                this.style.display = 'none';
                
                // 알림 표시
                showNotification('선택이 초기화되었습니다.', 'success');
                console.log('Select 초기화 완료');
            } else {
                console.log('타겟 Select 요소를 찾을 수 없음');
            }
        });
    });

    // Select 요소 변화 감지하여 클리어 버튼 표시/숨김
    const selectFields = document.querySelectorAll('.input-wrapper select');
    console.log('찾은 Select 필드 개수:', selectFields.length);
    
    selectFields.forEach((select, index) => {
        const clearBtn = select.nextElementSibling;
        console.log(`Select 필드 ${index + 1}:`, select.id, '클리어 버튼:', clearBtn);
        
        if (clearBtn && clearBtn.classList.contains('clear-select-btn')) {
            // 초기 상태 설정
            function updateClearButtonVisibility() {
                if (select.value !== '' && select.selectedIndex > 0) {
                    clearBtn.style.display = 'flex';
                    console.log(`Select 클리어 버튼 표시: ${select.id}`);
                } else {
                    clearBtn.style.display = 'none';
                    console.log(`Select 클리어 버튼 숨김: ${select.id}`);
                }
            }
            
            // 이벤트 리스너 추가
            select.addEventListener('change', updateClearButtonVisibility);
            select.addEventListener('focus', updateClearButtonVisibility);
            
            // 페이지 로드 시 초기 상태 설정
            updateClearButtonVisibility();
        } else {
            console.log(`Select 클리어 버튼을 찾을 수 없음: ${select.id}`);
        }
    });
}

// 체크박스 클리어 버튼 기능
function initClearCheckboxButtons() {
    console.log('체크박스 클리어 버튼 초기화 시작');
    
    // 개별 체크박스 클리어 버튼
    const clearCheckboxButtons = document.querySelectorAll('.clear-checkbox-btn');
    console.log('찾은 개별 체크박스 클리어 버튼 개수:', clearCheckboxButtons.length);
    
    clearCheckboxButtons.forEach((button, index) => {
        console.log(`체크박스 클리어 버튼 ${index + 1} 이벤트 리스너 추가`);
        button.addEventListener('click', function(e) {
            console.log('체크박스 클리어 버튼 클릭됨');
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('data-target');
            console.log('타겟 ID:', targetId);
            const targetCheckbox = document.getElementById(targetId);
            
            if (targetCheckbox) {
                console.log('타겟 체크박스 찾음:', targetCheckbox);
                targetCheckbox.checked = false;
                
                // 버튼 숨기기
                this.style.display = 'none';
                
                // 알림 표시
                showNotification('선택이 해제되었습니다.', 'success');
                console.log('체크박스 해제 완료');
            } else {
                console.log('타겟 체크박스를 찾을 수 없음');
            }
        });
    });
    
    // 체크박스 그룹 클리어 버튼
    const clearGroupButtons = document.querySelectorAll('.clear-checkbox-group-btn');
    console.log('찾은 체크박스 그룹 클리어 버튼 개수:', clearGroupButtons.length);
    
    clearGroupButtons.forEach((button, index) => {
        console.log(`체크박스 그룹 클리어 버튼 ${index + 1} 이벤트 리스너 추가`);
        button.addEventListener('click', function(e) {
            console.log('체크박스 그룹 클리어 버튼 클릭됨');
            e.preventDefault();
            e.stopPropagation();
            
            const targetName = this.getAttribute('data-target');
            console.log('타겟 그룹 이름:', targetName);
            const targetCheckboxes = document.querySelectorAll(`input[name="${targetName}"]`);
            
            if (targetCheckboxes.length > 0) {
                console.log('타겟 체크박스 그룹 찾음:', targetCheckboxes.length, '개');
                let uncheckedCount = 0;
                
                targetCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                        uncheckedCount++;
                        
                        // 개별 클리어 버튼 숨기기
                        const clearBtn = checkbox.parentElement.querySelector('.clear-checkbox-btn');
                        if (clearBtn) {
                            clearBtn.style.display = 'none';
                        }
                    }
                });
                
                // 알림 표시
                if (uncheckedCount > 0) {
                    showNotification(`${uncheckedCount}개 항목의 선택이 해제되었습니다.`, 'success');
                } else {
                    showNotification('선택된 항목이 없습니다.', 'info');
                }
                console.log('체크박스 그룹 해제 완료');
            } else {
                console.log('타겟 체크박스 그룹을 찾을 수 없음');
            }
        });
    });
    
    // 체크박스 상태 변화 감지하여 개별 클리어 버튼 표시/숨김
    const checkboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
    console.log('찾은 체크박스 개수:', checkboxes.length);
    
    checkboxes.forEach((checkbox, index) => {
        const clearBtn = checkbox.parentElement.querySelector('.clear-checkbox-btn');
        console.log(`체크박스 ${index + 1}:`, checkbox.id, '클리어 버튼:', clearBtn);
        
        if (clearBtn) {
            // 초기 상태 설정
            function updateClearButtonVisibility() {
                if (checkbox.checked) {
                    clearBtn.style.display = 'inline-block';
                    console.log(`체크박스 클리어 버튼 표시: ${checkbox.id}`);
                } else {
                    clearBtn.style.display = 'none';
                    console.log(`체크박스 클리어 버튼 숨김: ${checkbox.id}`);
                }
            }
            
            // 이벤트 리스너 추가
            checkbox.addEventListener('change', updateClearButtonVisibility);
            
            // 페이지 로드 시 초기 상태 설정
            updateClearButtonVisibility();
        } else {
            console.log(`체크박스 클리어 버튼을 찾을 수 없음: ${checkbox.id}`);
        }
    });
}