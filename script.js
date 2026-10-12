document.addEventListener("DOMContentLoaded", function () {

  const navbar = document.getElementById("navbar");
  let lastScrollTop = 0;
  let scrollTimeout;

  if (navbar) {
    window.addEventListener("scroll", function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      navbar.style.top = scrollTop < lastScrollTop ? "0" : "-80px";
      lastScrollTop = scrollTop;
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => { navbar.style.top = "-80px"; }, 1500);
    });
  }

  const statsSection = document.getElementById("stats");
  let statsAnimated = false;

  function animateStats() {
    if (statsAnimated) return;
    statsAnimated = true;
    const fills = document.querySelectorAll(".fill");
    if (fills[0]) fills[0].style.width = "90%";
    if (fills[1]) fills[1].style.width = "25%";
    if (fills[2]) fills[2].style.width = "95%";
  }

  if (statsSection) {
    if ("IntersectionObserver" in window) {
      const statsObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { animateStats(); statsObs.disconnect(); }
      }, { threshold: 0.1 });
      statsObs.observe(statsSection);
    } else {
      window.addEventListener("scroll", () => {
        const r = statsSection.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom >= 0) animateStats();
      });
    }
  }

  document.querySelectorAll(".event-card").forEach(function (card) {
    const slides  = card.querySelector(".slides");
    const images  = slides ? slides.querySelectorAll("img") : [];
    const prevBtn = card.querySelector(".slide-btn.prev");
    const nextBtn = card.querySelector(".slide-btn.next");
    if (!slides || images.length === 0) return;
    let index = 0;
    function moveSlide(dir) {
      index = (index + dir + images.length) % images.length;
      slides.style.transform = "translateX(-" + (index * card.offsetWidth) + "px)";
    }
    if (nextBtn) nextBtn.addEventListener("click", function () { moveSlide(1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { moveSlide(-1); });
  });

  document.querySelectorAll(".event-card-new").forEach(function (card) {
    const sliderEl   = card.querySelector(".ecn-slider");
    const slidesWrap = card.querySelector(".ecn-slides");
    const images     = slidesWrap ? slidesWrap.querySelectorAll("img") : [];
    const prevBtn    = card.querySelector(".ecn-prev");
    const nextBtn    = card.querySelector(".ecn-next");
    if (!sliderEl || !slidesWrap || images.length === 0) return;
    let index = 0;
    function slideTo(dir) {
      index = (index + dir + images.length) % images.length;
      slidesWrap.style.transform = "translateX(-" + (index * sliderEl.offsetWidth) + "px)";
    }
    if (nextBtn) nextBtn.addEventListener("click", function () { slideTo(1); });
    if (prevBtn) prevBtn.addEventListener("click", function () { slideTo(-1); });
  });

  const modal       = document.getElementById("imgModal");
  const modalImg    = document.getElementById("modalImg");
  const captionText = document.getElementById("modalCaption");
  const closeBtn    = document.querySelector(".close-modal");

  if (modal && closeBtn) {
    document.querySelectorAll(".schedule-card img").forEach(function (img) {
      img.style.cursor = "pointer";
      img.addEventListener("click", function () {
        modal.style.display = "block";
        if (modalImg)    modalImg.src          = this.src;
        if (captionText) captionText.innerHTML  = this.alt;
      });
    });
    closeBtn.addEventListener("click", function () { modal.style.display = "none"; });
    modal.addEventListener("click", function (e) {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  const heroSlides = document.querySelectorAll(".hero-slideshow .slide");
  const heroDots   = document.querySelectorAll(".slideshow-dot");

  if (heroSlides.length) {
    let current = 0;
    let heroTimer;

    function goTo(n) {
      heroSlides[current].classList.remove("active");
      if (heroDots[current]) heroDots[current].classList.remove("active");
      current = (n + heroSlides.length) % heroSlides.length;
      heroSlides[current].classList.add("active");
      if (heroDots[current]) heroDots[current].classList.add("active");
    }

    function startHeroAuto() { heroTimer = setInterval(function () { goTo(current + 1); }, 5500); }
    function resetHeroAuto() { clearInterval(heroTimer); startHeroAuto(); }

    const slidePrev = document.getElementById("slidePrev");
    const slideNext = document.getElementById("slideNext");
    if (slidePrev) slidePrev.addEventListener("click", function () { goTo(current - 1); resetHeroAuto(); });
    if (slideNext) slideNext.addEventListener("click", function () { goTo(current + 1); resetHeroAuto(); });

    heroDots.forEach(function (dot) {
      dot.addEventListener("click", function () { goTo(+this.dataset.index); resetHeroAuto(); });
    });

    startHeroAuto();
  }

  document.querySelectorAll(".curric-tab").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".curric-tab").forEach(function (b) { b.classList.remove("active"); });
      document.querySelectorAll(".curric-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      const panel = document.getElementById("panel-" + btn.dataset.panel);
      if (panel) panel.classList.add("active");
    });
  });

  document.querySelectorAll(".more-tab-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".more-tab-btn").forEach(function (b) { b.classList.remove("active"); });
      document.querySelectorAll(".more-panel").forEach(function (p) { p.classList.remove("active"); });
      btn.classList.add("active");
      const panel = document.getElementById("mpanel-" + btn.dataset.panel);
      if (panel) panel.classList.add("active");
    });
  });

  const mapEl = document.getElementById("map");
  if (mapEl && typeof L !== "undefined") {
    const schoolLat = 14.526598513194948;
    const schoolLng = 121.05758292044175;
    const map = L.map("map").setView([schoolLat, schoolLng], 17);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);
    L.marker([schoolLat, schoolLng]).addTo(map).bindPopup(
      "<b>Zinah Christian Academy</b><br>" +
      "📍 Taguig City, Philippines<br>" +
      "☎ Phone: +63 998 995 7475<br>" +
      "🌐 <a href='https://www.facebook.com/ZCATaguig' target='_blank' rel='noopener noreferrer'>Visit our Facebook Page</a><br><br>" +
      "🗺️ <a href='https://maps.app.goo.gl/5UnR6g3ebsnG2vQA6' target='_blank' rel='noopener noreferrer'>Get Directions</a>"
    ).openPopup();
  }

  const form = document.getElementById("enrollmentForm");
  if (form) {
    const steps       = Array.from(form.querySelectorAll(".step"));
    let currentStep   = 0;
    const photoInput  = document.getElementById("photoInput");
    const photoPreview= document.getElementById("photoPreview");
    const progressBar = document.getElementById("formProgress");
    const printBtn    = document.getElementById("printEnrollment");

    function updateProgress() {
      if (progressBar) progressBar.style.width = (((currentStep + 1) / steps.length) * 100) + "%";
    }

    function showStep(idx) {
      steps.forEach(function (s, i) { s.classList.toggle("active", i === idx); });
      updateProgress();
    }

    showStep(currentStep);

    form.querySelectorAll(".next").forEach(function (btn) {
      btn.addEventListener("click", function () {
        const required = steps[currentStep].querySelectorAll("[required]");
        for (let f of required) {
          if (!f.checkValidity()) {
            const lbl = f.closest(".input-group") && f.closest(".input-group").querySelector("label");
            if (typeof Swal !== "undefined") Swal.fire({ icon: "error", title: lbl ? lbl.innerText : "This field", text: "Please complete this field correctly." });
            f.focus(); return;
          }
        }
        if (currentStep < steps.length - 1) { currentStep++; showStep(currentStep); }
      });
    });

    form.querySelectorAll(".prev").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (currentStep > 0) { currentStep--; showStep(currentStep); }
      });
    });

    if (photoInput && photoPreview) {
      photoInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) { photoPreview.src = URL.createObjectURL(file); photoPreview.style.display = "block"; }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const allFields = form.querySelectorAll("[required]");
      for (let f of allFields) {
        if (!f.checkValidity()) {
          const lbl = f.closest(".input-group") && f.closest(".input-group").querySelector("label");
          if (typeof Swal !== "undefined") Swal.fire({ icon: "error", title: "Incomplete Form", text: (lbl ? lbl.innerText : "This field") + " is required or invalid." });
          f.focus(); return;
        }
      }

      const gv = function (sel) { const el = form.querySelector(sel); return el ? el.value : ""; };
      const enrollmentData = {
        schoolYear: gv("select[name='schoolYear']"), lastName: gv("input[name='lastName']"),
        firstName: gv("input[name='firstName']"), middleName: gv("input[name='middleName']"),
        gender: gv("select[name='gender']"), birthDate: gv("input[name='birthDate']"),
        age: gv("input[name='age']"), placeofbirth: gv("input[name='placeofbirth']"),
        nationality: gv("input[name='nationality']"), civilstatus: gv("select[name='civilstatus']"),
        religion: gv("input[name='religion']"), photoURL: photoPreview ? photoPreview.src : "",
        homeAddress: gv("input[name='homeAddress']"), mobileNumber: gv("input[name='mobileNumber']"),
        telephoneNumber: gv("input[name='telephoneNumber']"), email: gv("input[name='email']"),
        fatherName: gv("input[name='fatherName']"), fatherOccupation: gv("input[name='fatherOccupation']"),
        fatherContact: gv("input[name='fatherContact']"), motherName: gv("input[name='motherName']"),
        motherOccupation: gv("input[name='motherOccupation']"), motherContact: gv("input[name='motherContact']"),
        guardianName: gv("input[name='guardianName']"), guardianRelationship: gv("input[name='guardianRelationship']"),
        guardianContact: gv("input[name='guardianContact']"), lastSchool: gv("input[name='lastSchool']"),
        schoolAddress: gv("input[name='schoolAddress']"), schoolYearGraduated: gv("select[name='schoolYearGraduated']"),
        gradeLevelCompleted: gv("input[name='gradeLevelCompleted']"), honorsAwards: gv("input[name='honorsAwards']"),
        studentID: gv("input[name='studentID']"), gradeLevelApplying: gv("select[name='gradeLevelApplying']"),
        studentType: gv("select[name='studentType']")
      };

      if (typeof Swal !== "undefined") {
        Swal.fire({ title: "Submit Enrollment?", text: "Please confirm that all information is correct.", icon: "question", showCancelButton: true, confirmButtonText: "Submit" })
        .then(function (result) {
          if (!result.isConfirmed) return;
          Swal.fire({ title: "Submitting Enrollment...", text: "Please wait while we save your information.", allowOutsideClick: false, allowEscapeKey: false, didOpen: function () { Swal.showLoading(); } });
          fetch("https://script.google.com/macros/s/AKfycbwj2rlIqFJ1RTLTV30fjwEnbQQGp8FvTzC1C7nzqzhESxhn_BeEthDOtxLl3Hc0d4Vr/exec", { method: "POST", body: new URLSearchParams(enrollmentData) })
          .then(function (r) { return r.text(); })
          .then(function () {
            Swal.close();
            Swal.fire({ icon: "success", title: "Enrollment Successfully Saved!", html: "Your enrollment has been successfully submitted.<br><br>An email containing the detailed school fees, payment plans, and required documents has been sent to <strong>" + enrollmentData.email + "</strong>.", confirmButtonText: "OK" });
            currentStep = steps.length - 1; showStep(currentStep);
          })
          .catch(function (err) {
            Swal.close();
            Swal.fire({ icon: "error", title: "Submission Failed", text: "Unable to save enrollment. Please check your internet connection and try again." });
            console.error(err);
          });
        });
      }
    });

    if (printBtn) {
      printBtn.addEventListener("click", function () {
        const allFields = form.querySelectorAll("[required]");
        for (let f of allFields) {
          if (!f.checkValidity()) {
            const lbl = f.closest(".input-group") && f.closest(".input-group").querySelector("label");
            if (typeof Swal !== "undefined") Swal.fire({ icon: "error", title: "Incomplete Form", text: (lbl ? lbl.innerText : "This field") + " is required or invalid." });
            f.focus(); return;
          }
        }
        window.print();
      });
    }
  }

  const icalGrid = document.getElementById('icalGrid');
  if (icalGrid) {
    const CAL_EVENTS = [
      {date:'2025-06-02',title:'School Year Opens',desc:'Start of School Year 2025–2026. Welcome back to all students and faculty.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2025-06-16',title:'First Periodical Exam',desc:'First quarterly examination for all grade levels.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2025-07-04',title:'Independence Day',desc:'Philippine Independence Day. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2025-08-01',title:'Second Periodical Exam',desc:'Second quarterly examination for all grade levels.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2025-08-25',title:'National Heroes Day',desc:'National Heroes Day. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2025-09-15',title:'Third Periodical Exam',desc:'Third quarterly examination for all grade levels.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2025-10-06',title:'Foundation Day',desc:'ZCA Foundation Day celebration. Special activities for all students.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2025-10-27',title:'Parent-Teacher Conference',desc:'First semester parent-teacher conference. Parents meet with teachers to discuss student progress.',cat:'Admin',color:'#7f8c8d',bg:'rgba(127,140,141,0.25)'},
      {date:'2025-11-01',title:'All Saints Day',desc:'All Saints Day holiday. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2025-11-02',title:'All Souls Day',desc:'All Souls Day holiday. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2025-11-17',title:'Christmas Program',desc:'Annual ZCA Christmas program featuring performances from all grade levels.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2025-12-08',title:'Immaculate Conception',desc:'Feast of the Immaculate Conception. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2025-12-19',title:'Christmas Break Starts',desc:'Start of Christmas holiday break. Classes resume in January.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2026-01-05',title:'Classes Resume',desc:'End of Christmas break. Classes resume for all grade levels.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2026-01-26',title:'Fourth Periodical Exam',desc:'Fourth and final quarterly examination for all grade levels.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2026-02-07',title:'Parenting Seminar',desc:'2026 Marriage & Parenting Seminar, 9AM–12NN at Jollibee Petron C5. Open to all — ₱375 (lunch included).',cat:'Seminar',color:'#1a6fb5',bg:'rgba(26,111,181,0.3)'},
      {date:'2026-02-14',title:"Valentine's Day Activity",desc:"Special school activities for Valentine's Day celebrating love, kindness and friendship among students.",cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2026-02-25',title:'EDSA People Power',desc:'EDSA People Power Revolution Anniversary. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2026-02-26',title:'Mr. & Ms. Zinah Pageant',desc:'Annual school pageant showcasing the confidence, talent, and charm of ZCA students.',cat:'Pageant',color:'#b5851a',bg:'rgba(181,133,26,0.3)'},
      {date:'2026-02-27',title:'Sports Fest / Family Day',desc:'Friendly competition and quality family time as our school houses face off in exciting games and activities.',cat:'Sports',color:'#8e44ad',bg:'rgba(142,68,173,0.3)'},
      {date:'2026-03-09',title:'Parent-Teacher Conference',desc:'Second semester parent-teacher conference. Final review of student performance for the school year.',cat:'Admin',color:'#7f8c8d',bg:'rgba(127,140,141,0.25)'},
      {date:'2026-03-24',title:'Graduation Ceremony',desc:'Honoring the hard work and achievements of our students as they reach important academic milestones.',cat:'Ceremony',color:'#c0392b',bg:'rgba(192,57,43,0.3)'},
      {date:'2026-03-30',title:'Last Day of Classes',desc:'Last official day of classes for School Year 2025–2026.',cat:'Academic',color:'#065d32',bg:'rgba(6,93,50,0.25)'},
      {date:'2026-04-02',title:'Maundy Thursday',desc:'Maundy Thursday Holy Week holiday. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
      {date:'2026-04-03',title:'Good Friday',desc:'Good Friday Holy Week holiday. No classes.',cat:'Holiday',color:'#27ae60',bg:'rgba(39,174,96,0.25)'},
    ];

    var calCurrent = new Date(2026, 1, 1);

    function calEventsFor(y, m, d) {
      var key = y + '-' + String(m+1).padStart(2,'0') + '-' + String(d).padStart(2,'0');
      return CAL_EVENTS.filter(function(e){ return e.date === key; });
    }

    function renderCal() {
      icalGrid.innerHTML = '';
      var y = calCurrent.getFullYear(), m = calCurrent.getMonth();
      var titleEl = document.getElementById('calTitle');
      if (titleEl) titleEl.textContent = new Date(y, m, 1).toLocaleDateString('en-US', {month:'long', year:'numeric'});
      var firstDay = new Date(y, m, 1).getDay();
      var daysInMonth = new Date(y, m+1, 0).getDate();
      var daysInPrev = new Date(y, m, 0).getDate();
      var today = new Date();

      for (var i = 0; i < firstDay; i++) {
        var d = daysInPrev - firstDay + 1 + i;
        var cell = document.createElement('div');
        cell.className = 'ical-day ical-other';
        cell.innerHTML = '<div class="ical-dnum">' + d + '</div>';
        icalGrid.appendChild(cell);
      }

      for (var d = 1; d <= daysInMonth; d++) {
        var cell = document.createElement('div');
        cell.className = 'ical-day';
        if (today.getFullYear()===y && today.getMonth()===m && today.getDate()===d) cell.classList.add('ical-today');
        cell.innerHTML = '<div class="ical-dnum">' + d + '</div>';
        var evs = calEventsFor(y, m, d);
        (function(evList){
          evList.forEach(function(ev) {
            var tag = document.createElement('div');
            tag.className = 'ical-ev';
            tag.style.background = ev.bg;
            tag.style.color = ev.color;
            tag.textContent = ev.title;
            tag.addEventListener('click', function(e){ e.stopPropagation(); showCalPopup(ev); });
            cell.appendChild(tag);
          });
        })(evs);
        icalGrid.appendChild(cell);
      }

      var total = firstDay + daysInMonth;
      var rem = total % 7 === 0 ? 0 : 7 - (total % 7);
      for (var d = 1; d <= rem; d++) {
        var cell = document.createElement('div');
        cell.className = 'ical-day ical-other';
        cell.innerHTML = '<div class="ical-dnum">' + d + '</div>';
        icalGrid.appendChild(cell);
      }
    }

    function showCalPopup(ev) {
      var dt = new Date(ev.date + 'T00:00:00');
      var tag = document.getElementById('icalPopupTag');
      var ttl = document.getElementById('icalPopupTitle');
      var dsc = document.getElementById('icalPopupDesc');
      var dte = document.getElementById('icalPopupDate');
      var pop = document.getElementById('icalPopup');
      if (!tag||!ttl||!dsc||!dte||!pop) return;
      tag.textContent = ev.cat;
      tag.style.background = ev.bg;
      tag.style.color = ev.color;
      ttl.textContent = ev.title;
      dsc.textContent = ev.desc;
      dte.textContent = dt.toLocaleDateString('en-US', {weekday:'long', year:'numeric', month:'long', day:'numeric'});
      pop.style.display = 'flex';
    }

    var popupEl = document.getElementById('icalPopup');
    var popupClose = document.getElementById('icalPopupClose');
    if (popupClose) popupClose.addEventListener('click', function(){ popupEl.style.display='none'; });
    if (popupEl) popupEl.addEventListener('click', function(e){ if(e.target===popupEl) popupEl.style.display='none'; });

    var prevBtn = document.getElementById('calPrev');
    var nextBtn = document.getElementById('calNext');
    var todayBtn = document.getElementById('calToday');
    if (prevBtn) prevBtn.addEventListener('click', function(){ calCurrent.setMonth(calCurrent.getMonth()-1); renderCal(); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ calCurrent.setMonth(calCurrent.getMonth()+1); renderCal(); });
    if (todayBtn) todayBtn.addEventListener('click', function(){ calCurrent = new Date(); calCurrent.setDate(1); renderCal(); });

    renderCal();
  }
  const dotWraps   = document.querySelectorAll(".step-dot-wrap");
  const stepProgress = document.getElementById("formProgress");
  if (dotWraps.length) {
    function updateIndicator(idx) {
      dotWraps.forEach(function (w, i) {
        w.classList.remove("active", "completed");
        if (i < idx) w.classList.add("completed");
        if (i === idx) w.classList.add("active");
      });
      if (stepProgress) stepProgress.style.width = (((idx + 1) / dotWraps.length) * 100) + "%";
    }
    const stepObs = new MutationObserver(function () {
      document.querySelectorAll("fieldset.step").forEach(function (s, i) {
        if (s.classList.contains("active")) updateIndicator(i);
      });
    });
    document.querySelectorAll("fieldset.step").forEach(function (s) {
      stepObs.observe(s, { attributes: true, attributeFilter: ["class"] });
    });
    updateIndicator(0);
  }

}); 