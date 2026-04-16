document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const loading = document.getElementById('loading');
    const errorMsg = document.getElementById('error-msg');
    const loginScreen = document.getElementById('login-screen');
    const wrappedScreen = document.getElementById('wrapped-screen');
    
    const langSelect = document.getElementById('lang-select');
    
    // Slide State
    let slidesData = [];
    let currentSlide = 0;
    let slideInterval;
    let progressInterval;
    const SLIDE_DURATION = 5000; // 5 seconds per slide
    let startTime = 0;

    const i18n = {
        cs: {
            subtitle: "Objevte statistiky za vaší kariérou.",
            email: "E-mail MyMcd",
            pwd: "Heslo",
            unwrap: "Rozbalit",
            loading: "Počítám vaše směny... to může trvat až 30 sekund!",
            welcome: "Vítejte ve vašem",
            ready: "Připraveni, {0}?",
            started: "Všechno to začalo...",
            firstShift: "Vaše první směna",
            clockIn: "Byli jste na směně...",
            times: "krát",
            lotsOfFries: "To je hodně hranolek! 🍟",
            totalTime: "Strávili jste celkem",
            hoursOnFloor: "Hodin na place",
            recharging: "(A {0} hodin odpočinku na přestávce ☕)",
            hoursDaysYears: "To je {0} dní nebo {1} let!",
            grind: "Váš největší grind byl v",
            busiestMonth: "Nejrušnější měsíc",
            logging: "Odpracovali jste {0} hodin! 🔥",
            daysConquered: "Dny, které jste dobyli",
            helpedOut: "Pomáhali jste všude!",
            transfers: "Přeložení (TR)",
            runningShow: "Vy to tam řídíte",
            osRsNs: "OS / RS / NS Směn",
            shiftLengths: "Délky vašich směn",
            thatsYour: "To je váš",
            careerWrapped: "Career Wrapped!",
            daysMap: {"Mon":"Po", "Tue":"Út", "Wed":"St", "Thu":"Čt", "Fri":"Pá", "Sat":"So", "Sun":"Ne"}
        },
        en: {
            subtitle: "Discover the stats behind your career.",
            email: "MyMcd Email",
            pwd: "Password",
            unwrap: "Unwrap",
            loading: "Crunching your shifts... this may take up to 30 seconds!",
            welcome: "Welcome to your",
            ready: "Ready, {0}?",
            started: "It all started on...",
            firstShift: "Your First Shift",
            clockIn: "You've clocked in...",
            times: "Times",
            lotsOfFries: "That's a lot of fries! 🍟",
            totalTime: "Spending a total of",
            hoursOnFloor: "Hours on the floor",
            recharging: "(And {0} hours recharging on break ☕)",
            hoursDaysYears: "That's {0} days or {1} years!",
            grind: "Your ultimate grind was in",
            busiestMonth: "Busiest Month",
            logging: "Logging {0} hours! 🔥",
            daysConquered: "Days you conquered",
            helpedOut: "You helped out everywhere!",
            transfers: "Transfers (TR)",
            runningShow: "Running the show",
            osRsNs: "OS / RS / NS Shifts",
            shiftLengths: "Your Shift Lengths",
            thatsYour: "That's your",
            careerWrapped: "Career Wrapped!",
            daysMap: {"Mon":"Mon", "Tue":"Tue", "Wed":"Wed", "Thu":"Thu", "Fri":"Fri", "Sat":"Sat", "Sun":"Sun"}
        },
        uk: {
            subtitle: "Відкрийте статистику вашої кар'єри.",
            email: "Електронна пошта MyMcd",
            pwd: "Пароль",
            unwrap: "Відкрити",
            loading: "Обробляємо ваші зміни... це може зайняти до 30 секунд!",
            welcome: "Ласкаво просимо до вашого",
            ready: "Готові, {0}?",
            started: "Все почалося...",
            firstShift: "Ваша перша зміна",
            clockIn: "Ви відпрацювали...",
            times: "Разів",
            lotsOfFries: "Це багато картоплі фрі! 🍟",
            totalTime: "Разом ви провели",
            hoursOnFloor: "Годин на змінах",
            recharging: "(Та {0} годин відпочинку на перерві ☕)",
            hoursDaysYears: "Це {0} днів або {1} років!",
            grind: "Ваш найбільший період був у",
            busiestMonth: "Найбільш завантажений місяць",
            logging: "Відпрацювавши {0} годин! 🔥",
            daysConquered: "Дні, які ви підкорили",
            helpedOut: "Ви допомагали скрізь!",
            transfers: "Переведення (TR)",
            runningShow: "Ви керуєте",
            osRsNs: "OS / RS / NS Зміни",
            shiftLengths: "Тривалість ваших змін",
            thatsYour: "Це ваш",
            careerWrapped: "Career Wrapped!",
            daysMap: {"Mon":"Пн", "Tue":"Вт", "Wed":"Ср", "Thu":"Чт", "Fri":"Пт", "Sat":"Сб", "Sun":"Нд"}
        },
        ru: {
            subtitle: "Узнайте статистику вашей карьеры.",
            email: "Электронная почта MyMcd",
            pwd: "Пароль",
            unwrap: "Открыть",
            loading: "Анализируем ваши смены... это может занять до 30 секунд!",
            welcome: "Добро пожаловать в ваш",
            ready: "Готовы, {0}?",
            started: "Всё началось...",
            firstShift: "Ваша первая смена",
            clockIn: "Вы отработали...",
            times: "Раз",
            lotsOfFries: "Это очень много картошки фри! 🍟",
            totalTime: "В сумме вы провели",
            hoursOnFloor: "Часов на сменах",
            recharging: "(И {0} часов отдыха на перерыве ☕)",
            hoursDaysYears: "Это {0} дней или {1} лет!",
            grind: "Ваш самый мощный период был в",
            busiestMonth: "Самый загруженный месяц",
            logging: "Отработав {0} часов! 🔥",
            daysConquered: "Дни, которые вы покорили",
            helpedOut: "Вы помогали везде!",
            transfers: "Переводы (TR)",
            runningShow: "Вы руководите процессом",
            osRsNs: "OS / RS / NS Смены",
            shiftLengths: "Длительность ваших смен",
            thatsYour: "Это ваш",
            careerWrapped: "Career Wrapped!",
            daysMap: {"Mon":"Пн", "Tue":"Вт", "Wed":"Ср", "Thu":"Чт", "Fri":"Пт", "Sat":"Сб", "Sun":"Вс"}
        }
    };
    
    // Initialize the default login page text to czech
    const initLang = () => {
        const lang = langSelect.value;
        const t = i18n[lang];
        document.getElementById('t-subtitle').textContent = t.subtitle;
        document.getElementById('email').placeholder = t.email;
        document.getElementById('password').placeholder = t.pwd;
        document.getElementById('submit-btn').textContent = t.unwrap;
        document.getElementById('t-loading').textContent = t.loading;
    };
    initLang();
    langSelect.addEventListener('change', initLang);

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        loginForm.classList.add('hidden');
        loading.classList.remove('hidden');
        errorMsg.classList.add('hidden');
        
        const fd = new FormData(loginForm);
        
        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                body: fd
            });
            const json = await res.json();
            
            if (json.success) {
                initWrapped(json.data);
            } else {
                showError(json.error || "Failed to analyze career.");
            }
        } catch (err) {
            showError(err.message);
        }
    });

    function showError(msg) {
        loginForm.classList.remove('hidden');
        loading.classList.add('hidden');
        errorMsg.textContent = msg;
        errorMsg.classList.remove('hidden');
    }

    function initWrapped(data) {
        // Translation string getter
        const lang = langSelect.value;
        const t = i18n[lang];
        const _ready = t.ready.replace("{0}", data.name);
        
        let workedDaysStr = (data.hours_worked / 24.0).toFixed(1);
        let workedYearsStr = ((data.hours_worked / 24.0) / 365.25).toFixed(2);
        const _recharge = t.recharging.replace("{0}", data.hours_pause);
        const _hdy = t.hoursDaysYears.replace("{0}", workedDaysStr).replace("{1}", workedYearsStr);
        const _logging = t.logging.replace("{0}", data.busiest_month_hours);
        
        slidesData.push({
            theme: 'bg-theme-1',
            html: `
                <div class="slide">
                    <h2 class="medium-title">${t.welcome}</h2>
                    <h1 class="huge-title">McdWrapped</h1>
                    <h2 class="medium-title" style="color: var(--secondary); margin-top: 2rem;">${_ready}</h2>
                </div>
            `
        });

        slidesData.push({
            theme: 'bg-theme-2',
            html: `
                <div class="slide">
                    <h2 class="medium-title">${t.started}</h2>
                    <div class="stat-box">
                        <div class="stat-value" style="font-size: 3rem;">${data.first_shift_date}</div>
                        <div class="stat-label">${t.firstShift}</div>
                    </div>
                </div>
            `
        });

        slidesData.push({
            theme: 'bg-theme-3',
            html: `
                <div class="slide">
                    <h2 class="medium-title">${t.clockIn}</h2>
                    <div class="stat-box">
                        <div class="stat-value">${data.total_shifts}</div>
                        <div class="stat-label">${t.times}</div>
                    </div>
                    <h2 class="medium-title">${t.lotsOfFries}</h2>
                </div>
            `
        });

        slidesData.push({
            theme: 'bg-theme-4',
            html: `
                <div class="slide">
                    <h2 class="medium-title">${t.totalTime}</h2>
                    <div class="stat-box">
                        <div class="stat-value">${data.hours_worked}</div>
                        <div class="stat-label">${t.hoursOnFloor}</div>
                    </div>
                    <p style="font-size: 1.2rem; margin-top: 1rem;">${_recharge}</p>
                    <p style="font-size: 1.2rem; margin-top: 1rem; color: var(--secondary); font-weight: bold;">${_hdy}</p>
                </div>
            `
        });

        if (data.busiest_month !== "-") {
            slidesData.push({
                theme: 'bg-theme-5',
                html: `
                    <div class="slide">
                        <h2 class="medium-title">${t.grind}</h2>
                        <div class="stat-box">
                            <div class="stat-value">${data.busiest_month}</div>
                            <div class="stat-label">${t.busiestMonth}</div>
                        </div>
                        <h2 class="medium-title" style="margin-top: 1rem;">${_logging}</h2>
                    </div>
                `
            });
        }

        if (data.days_histogram && data.days_histogram.length > 0) {
            let maxCountDays = Math.max(...data.days_histogram.map(i => i.count));
            let daysChartHtml = `<div class="chart-container">`;
            
            data.days_histogram.forEach(b => {
                let heightPerc = Math.max((b.count / maxCountDays) * 100, 5); // min 5% height
                let localDay = t.daysMap[b.day] || b.day;
                daysChartHtml += `
                    <div class="chart-bar-group">
                        <div class="chart-label">${b.count}</div>
                        <div class="chart-bar" style="height: ${heightPerc}%;"></div>
                        <div class="chart-label" style="margin-top: 5px;">${localDay}</div>
                    </div>
                `;
            });
            daysChartHtml += `</div>`;

            slidesData.push({
                theme: 'bg-theme-1',
                html: `
                    <div class="slide" style="width: 100%;">
                        <h2 class="medium-title" style="color: var(--text-dark);">${t.daysConquered}</h2>
                        ${daysChartHtml}
                    </div>
                `
            });
        }

        if (data.tr_count > 0) {
            slidesData.push({
                theme: 'bg-theme-1',
                html: `
                    <div class="slide">
                        <h2 class="medium-title">${t.helpedOut}</h2>
                        <div class="stat-box">
                            <div class="stat-value">${data.tr_count}</div>
                            <div class="stat-label">${t.transfers}</div>
                        </div>
                    </div>
                `
            });
        }

        if (data.is_manager && data.manager_notes_count > 0) {
            slidesData.push({
                theme: 'bg-theme-2',
                html: `
                    <div class="slide">
                        <h2 class="medium-title">${t.runningShow}</h2>
                        <div class="stat-box">
                            <div class="stat-value">${data.manager_notes_count}</div>
                            <div class="stat-label">${t.osRsNs}</div>
                        </div>
                    </div>
                `
            });
        }

        if (data.shift_histogram && data.shift_histogram.length > 0) {
            // Find max for scaling
            let maxCount = Math.max(...data.shift_histogram.map(i => i.count));
            let chartHtml = `<div class="chart-container">`;
            
            data.shift_histogram.forEach(b => {
                let heightPerc = Math.max((b.count / maxCount) * 100, 5); // min 5% height
                chartHtml += `
                    <div class="chart-bar-group">
                        <div class="chart-label">${b.count}</div>
                        <div class="chart-bar" style="height: ${heightPerc}%;"></div>
                        <div class="chart-label" style="margin-top: 5px;">${b.length}h</div>
                    </div>
                `;
            });
            chartHtml += `</div>`;

            slidesData.push({
                theme: 'bg-theme-3',
                html: `
                    <div class="slide" style="width: 100%;">
                        <h2 class="medium-title" style="color: var(--text-dark);">${t.shiftLengths}</h2>
                        ${chartHtml}
                    </div>
                `
            });
        }

        // Add Final Summary Poster Slide
        slidesData.push({
            theme: 'bg-theme-5',
            html: `
                <div class="slide" style="justify-content: center; padding-top: 0;">
                    <div id="summary-poster">
                        <div class="poster-header">McdWrapped ✨</div>
                        <div style="font-size: 1.2rem; margin-bottom: 5px; opacity: 0.9;">${data.name}</div>
                        
                        <div class="poster-stat">
                            <div class="poster-stat-val">${data.total_shifts}</div>
                            <div class="poster-stat-label">${t.times}</div>
                        </div>
                        
                        <div class="poster-stat">
                            <div class="poster-stat-val">${data.hours_worked}</div>
                            <div class="poster-stat-label">${t.hoursOnFloor}</div>
                        </div>
                        
                        <div class="poster-stat">
                            <div class="poster-stat-val">${data.busiest_month !== "-" ? data.busiest_month : "N/A"}</div>
                            <div class="poster-stat-label">${t.busiestMonth} (${data.busiest_month_hours} h)</div>
                        </div>

                        <div style="text-align: center; margin-top: 25px; font-size: 0.85rem; opacity: 0.7; font-weight: bold; letter-spacing: 1px;">
                            wrapped.mymymcd.eu
                        </div>
                    </div>
                    
                    <button id="download-poster-btn" style="margin-top:20px; padding: 1rem 2rem; background: var(--secondary); color: var(--text-dark); border-radius: 30px; font-weight: bold; font-family: 'Outfit'; font-size: 1.1rem; border: none; cursor: pointer; box-shadow: 0 5px 15px rgba(255,188,13,0.4);">
                        📸 Download
                    </button>
                    <h2 class="medium-title" style="margin-top: 2rem;">${t.thatsYour} <span style="color:var(--primary); font-weight:900;">${t.careerWrapped}</span></h2>
                </div>
            `
        });

        // Setup DOM
        const progressContainer = document.getElementById('progress-container');
        progressContainer.innerHTML = '';
        slidesData.forEach((_, idx) => {
            progressContainer.innerHTML += `
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" id="pb-${idx}"></div>
                </div>
            `;
        });

        loginScreen.classList.remove('active');
        wrappedScreen.classList.remove('hidden');
        wrappedScreen.classList.add('active');

        // Nav click handlers
        document.getElementById('nav-left').addEventListener('click', prevSlide);
        document.getElementById('nav-right').addEventListener('click', nextSlide);

        showSlide(0);
    }

    function showSlide(index) {
        if (index < 0) index = 0;
        if (index >= slidesData.length) {
            // Logic when wrapped ends
            index = slidesData.length - 1;
            clearInterval(progressInterval);
            return;
        }

        currentSlide = index;
        const slideContainer = document.getElementById('slide-container');
        const wrappedScreen = document.getElementById('wrapped-screen');
        
        // Reset old progress bars
        for(let i=0; i<slidesData.length; i++) {
            const pb = document.getElementById(`pb-${i}`);
            if (i < index) pb.style.width = '100%';
            else pb.style.width = '0%';
        }

        // Apply theme
        wrappedScreen.className = `screen active ${slidesData[index].theme}`;
        
        // Inject HTML
        slideContainer.innerHTML = slidesData[index].html;

        const downloadBtn = document.getElementById('download-poster-btn');
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                downloadBtn.textContent = 'Saving...';
                const poster = document.getElementById('summary-poster');
                html2canvas(poster, {
                    backgroundColor: null,
                    scale: 3 // high-res
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'McdWrapped_Summary.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                    downloadBtn.textContent = '📸 Download';
                });
            };
        }

        // Start progress
        startTime = Date.now();
        clearInterval(progressInterval);
        progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const perc = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
            document.getElementById(`pb-${currentSlide}`).style.width = `${perc}%`;

            if (perc >= 100) {
                nextSlide();
            }
        }, 30); // 30ms updates for smooth bar
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }
});
