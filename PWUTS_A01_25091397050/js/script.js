$(function () {
  const subjects = [
    {name:"Analisis & Desain Perangkat Lunak", day:"Senin", start:"15:30", end:"17:10", room:"K02.01.03", lecturer:"M. Adamu Islam Mashuri; Dimas Novian Aditia Syahputra", credits:2, type:"Teori", pjs:[{name:"Nabil Faza Al-Musyaffa",nim:"25091397054"},{name:"Avan Abdillah",nim:"25091397049"}]},
    {name:"Prak. Analisis & Desain Perangkat Lunak", day:"Senin", start:"17:10", end:"18:00", room:"K02.01.03", lecturer:"Dimas Novian Aditia Syahputra; M. Adamu Islam Mashuri", credits:1, type:"Praktikum", pjs:[{name:"Nabil Faza Al-Musyaffa",nim:"25091397054"},{name:"Avan Abdillah",nim:"25091397049"}]},
    {name:"Pemrograman Web", day:"Senin", start:"10:20", end:"12:00", room:"K10.02.02", lecturer:"Ari Kurniawan", credits:2, type:"Teori", pjs:[{name:"Muh Abdilah Irawan",nim:"25091397064"},{name:"Nyssa Leilani Calista",nim:"25091397062"}]},
    {name:"Prak. Pemrograman Web", day:"Senin", start:"13:00", end:"14:40", room:"K10.02.02", lecturer:"Ari Kurniawan", credits:2, type:"Praktikum", pjs:[{name:"Muh Abdilah Irawan",nim:"25091397064"},{name:"Nyssa Leilani Calista",nim:"25091397062"}]},
    {name:"Pemrograman Game", day:"Selasa", start:"14:40", end:"16:20", room:"K10.02.06", lecturer:"Moch. Badrus Sholeh", credits:2, type:"Teori", pjs:[{name:"Irma Naillatul Izzah",nim:"25091397056"},{name:"A'isyah Tri Harfani",nim:"25091397047"}]},
    {name:"Prak. Pemrograman Game", day:"Selasa", start:"16:20", end:"18:00", room:"K10.02.06", lecturer:"Moch. Badrus Sholeh", credits:2, type:"Praktikum", pjs:[{name:"Irma Naillatul Izzah",nim:"25091397056"},{name:"A'isyah Tri Harfani",nim:"25091397047"}]},
    {name:"Kecerdasan Buatan", day:"Rabu", start:"09:30", end:"12:00", room:"K02.01.03", lecturer:"Salamun Rohman Nudin", credits:3, type:"Teori", pjs:[{name:"Muhammad Aufa Dhiya'uddin",nim:"25091397052"},{name:"Adityah Candra Pratama",nim:"25091397046"}]},
    {name:"Kewarganegaraan", day:"Selasa", start:"07:00", end:"08:40", room:"Virtual", lecturer:"Agus Machfud Fauzi", credits:2, type:"Teori", pjs:[{name:"Naila Husna Sabilah",nim:"25091397044"},{name:"Khairin Naswa Dewiki",nim:"25091397041"}]},
    {name:"Basis Data Lanjut", day:"Kamis", start:"10:20", end:"12:00", room:"K10.02.06", lecturer:"Asmunin", credits:2, type:"Teori", pjs:[{name:"Farhan Bagas Firmansyah",nim:"25091397039"},{name:"Wahyu Adi Pratama",nim:"25091397067"},{name:"Farid Ahmad Santoso",nim:"25091397050"}]},
    {name:"Prak. Basis Data Lanjut", day:"Kamis", start:"13:00", end:"14:40", room:"K10.02.06", lecturer:"Asmunin", credits:2, type:"Praktikum", pjs:[{name:"Farhan Bagas Firmansyah",nim:"25091397039"},{name:"Wahyu Adi Pratama",nim:"25091397067"},{name:"Farid Ahmad Santoso",nim:"25091397050"}]},
    {name:"Pemrograman Berorientasi Objek", day:"Jumat", start:"10:20", end:"12:00", room:"K10.02.09", lecturer:"Faris Abdi El Hakim (0016089503)", credits:2, type:"Teori", progress:"40.00%", pjs:[]},
    {name:"Prak. Pemrograman Berorientasi Objek", day:"Jumat", start:"13:00", end:"14:40", room:"K10.02.09", lecturer:"Faris Abdi El Hakim (0016089503)", credits:2, type:"Praktikum", progress:"26.67%", pjs:[]}
  ];
  const accountMap = {};
  subjects.forEach(s => s.pjs.forEach(p => accountMap[p.nim] = p));
  const demoSubjects = subjects.map(s => ({...s, id: cryptoId(), tasks: []}));
  let currentUser = null, allSubjects = [], activeSubjects = [], editableSubjects = [], editingSubjectId = null;
  let taskList = [
    {id:1, subject:"Pemrograman Web", title:"Latihan HTML dan CSS", deadline:"2026-11-02", link:"", description:"Latihan struktur halaman dan styling."},
    {id:2, subject:"Basis Data Lanjut", title:"Latihan Stored Procedure", deadline:"2026-11-05", link:"", description:"Kerjakan latihan sesuai instruksi praktikum."}
  ];
  function cryptoId(){ return Math.random().toString(36).slice(2,10); }
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));}
  function toast(msg){$(".toast").remove();$("<div>").addClass("toast").text(msg).appendTo("body").delay(2600).fadeOut(250,function(){$(this).remove()});}
  function subjectsForUser(){return demoSubjects;}
  function subjectsEditableByUser(){return demoSubjects.filter(s=>s.pjs.some(p=>p.nim===currentUser.nim));}
  function canEditSubject(subject){return !!subject && subject.pjs.some(p=>p.nim===currentUser.nim);}
  function setUser(user){
    currentUser=user; activeSubjects=subjectsForUser(); editableSubjects=subjectsEditableByUser();
    $("#appShell").prop("hidden",false);
    $("#profileName").text(user.name);$("#profileNim").text(user.nim);
    $("#profileInitials").text(user.name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase());
    loadPage("dashboard");
  }
  const titles={dashboard:"Dashboard PJ",jadwal:"Kelola Jadwal",tugas:"Kelola Tugas","form-jadwal":"Form Jadwal"};
  function loadPage(page,opts={}){
    const paths={dashboard:"pages/dashboard.html",jadwal:"pages/jadwal.html",tugas:"pages/tugas.html","form-jadwal":"pages/form-jadwal.html"};
    $("#pageTitle").text(titles[page]||"Dashboard PJ");$(".nav-link").removeClass("active").filter(`[data-page="${page}"]`).addClass("active");
    $("#pageContent").html('<div class="loading">Memuat halaman...</div>');$("#sidebar").removeClass("open");
    // Muat halaman ke layout utama dan tampilkan pesan jika file tidak ditemukan.
    $.ajax({ url: paths[page], method: "GET", cache: false })
      .done(function (html) {
        $("#pageContent").html(html);
        if(page==="dashboard")renderDashboard();
        if(page==="jadwal")renderSchedules();
        if(page==="tugas"){setupTaskForm(null);renderTasks();}
        if(page==="form-jadwal")setupScheduleForm(opts.id||null);
      })
      .fail(function (xhr, status, error) {
        $("#pageContent").html('<div class="load-error"><h2>Halaman belum bisa dibuka</h2><p>Pastikan folder <b>pages</b> berada satu tingkat dengan <b>index.html</b>, lalu jalankan kembali melalui Live Server.</p><small></small></div>');
        $("#pageContent .load-error small").text("Detail: " + (error || status || "gagal memuat file"));
      });
  }
  function renderDashboard(){
    $("#welcomeName").text(currentUser.name.split(" ")[0]);
    $("#statSubjects").text(editableSubjects.length);
    $("#statSchedules").text(activeSubjects.length);
    $("#statTasks").text(taskList.filter(t=>editableSubjects.some(s=>s.name===t.subject)).length);
    const list=$("#ownedSubjects").empty();
    if(!activeSubjects.length)list.html('<div class="empty-state">Belum ada jadwal mata kuliah.</div>');
    activeSubjects.slice().sort((a,b)=>["Senin","Selasa","Rabu","Kamis","Jumat"].indexOf(a.day)-["Senin","Selasa","Rabu","Kamis","Jumat"].indexOf(b.day)).forEach(s=>list.append(`<div class="upcoming-item"><div class="day-block"><strong>${esc(s.day.slice(0,3))}</strong><span>${esc(s.type)}</span></div><div class="item-detail"><strong>${esc(s.name)}</strong><small>${esc(s.start)}–${esc(s.end)} · ${esc(s.room)}</small><small>PJ: ${esc(s.pjs.map(p=>p.name).join(" & ")||"Belum ditentukan")}</small></div></div>`));
  }
  function renderSchedules(query=""){
    const rows=$("#scheduleRows").empty();const q=query.toLowerCase();
    const filtered=activeSubjects.filter(s=>[s.name,s.day,s.room,s.lecturer,s.type,...s.pjs.map(p=>p.name)].join(" ").toLowerCase().includes(q));
    $("#scheduleCount").text(`${filtered.length} jadwal`);
    if(!filtered.length){rows.html('<tr><td colspan="6" class="empty-state">Jadwal tidak ditemukan.</td></tr>');return;}
    filtered.forEach(s=>rows.append(`<tr><td><span class="course-name">${esc(s.name)}</span><br><small class="muted">${esc(s.type)} · ${s.credits} SKS</small><br><small class="muted">PJ: ${esc(s.pjs.map(p=>p.name).join(" & ")||"Belum ditentukan")}</small></td><td>${esc(s.day)}</td><td><span class="time-pill">${esc(s.start)}–${esc(s.end)}</span></td><td>${esc(s.lecturer)}</td><td><span class="room-pill">${esc(s.room)}</span></td><td><div class="actions">${canEditSubject(s)?`<button class="btn btn-secondary btn-small edit-schedule" data-id="${s.id}">Edit</button>`:`<span class="muted" style="font-size:12px">Lihat saja</span>`}</div></td></tr>`));
  }
  function renderTasks(query=""){
    const body=$("#taskRows").empty(),q=query.toLowerCase();
    const allowed=taskList.filter(t=>editableSubjects.some(s=>s.name===t.subject)&&[t.subject,t.title,t.description].join(" ").toLowerCase().includes(q));
    $("#taskCount").text(`${allowed.length} tugas`);
    if(!allowed.length){body.html('<tr><td colspan="5" class="empty-state">Belum ada tugas untuk mata kuliah yang kamu kelola.</td></tr>');return;}
    allowed.forEach(t=>body.append(`<tr><td><b>${esc(t.title)}</b><br><small class="muted">${esc(t.description)}</small></td><td>${esc(t.subject)}</td><td>${esc(t.deadline||"-")}</td><td>${t.link?`<a href="${esc(t.link)}" target="_blank" rel="noopener">Buka link</a>`:"-"}</td><td><button class="btn btn-secondary btn-small edit-task" data-id="${t.id}">Edit</button> <button class="btn btn-danger btn-small delete-task" data-id="${t.id}">Hapus</button></td></tr>`));
  }
  function setupScheduleForm(id){
    editingSubjectId=id;const s=id?editableSubjects.find(x=>x.id===id):null;
    $("#scheduleFormHeading").text(s?"Edit Jadwal":"Tambah Jadwal");
    $("#submitSchedule").text(s?"Simpan Perubahan":"Simpan Jadwal");
    $("#cancelSchedule").toggle(!!s);
    $("#subjectName").val(s?.name||"");$("#subjectType").val(s?.type||"Teori");$("#day").val(s?.day==="(Perlu konfirmasi)"?"":s?.day||"");$("#startTime").val(s?.start==="-"?"":s?.start||"");$("#endTime").val(s?.end==="-"?"":s?.end||"");$("#room").val(s?.room==="-"?"":s?.room||"");$("#lecturer").val(s?.lecturer==="Belum dilengkapi"?"":s?.lecturer||"");$("#credits").val(s?.credits||"");
  }
  function validateSchedule(){
    let ok=true;$("#scheduleForm .field").removeClass("invalid");
    $("#scheduleForm [required]").each(function(){if(!String($(this).val()||"").trim()){ $(this).closest(".field").addClass("invalid");ok=false;}});
    if($("#startTime").val()&&$("#endTime").val()&&$("#endTime").val()<=$("#startTime").val()){$("#endTime").closest(".field").addClass("invalid").find(".error-message").text("Jam selesai harus setelah jam mulai.");ok=false;}
    if(!ok)toast("Periksa kembali kolom yang wajib diisi.");return ok;
  }
  function setupTaskForm(id){
    const task=id?taskList.find(t=>t.id===id):null;$("#taskId").val(task?.id||"");$("#taskTitle").val(task?.title||"");$("#taskDescription").val(task?.description||"");$("#taskDeadline").val(task?.deadline||"");$("#taskLink").val(task?.link||"");
    $("#taskSubject").empty();activeSubjects.forEach(s=>$("#taskSubject").append(`<option value="${esc(s.name)}">${esc(s.name)}</option>`));if(task)$("#taskSubject").val(task.subject);
    $("#taskFormHeading").text(task?"Edit Tugas":"Tambah Tugas");$("#submitTask").text(task?"Simpan Perubahan":"Simpan Tugas");$("#cancelTask").toggle(!!task);
  }
  $(document).on("click","[data-page]",function(e){e.preventDefault();loadPage($(this).data("page"));});
  $("#menuToggle").on("click",()=>$("#sidebar").toggleClass("open"));
  $(document).on("click","#goSchedules",()=>loadPage("jadwal"));
  $(document).on("click","#goTasks",()=>loadPage("tugas"));
  $(document).on("click","#goAddSchedule",()=>loadPage("form-jadwal"));
  $(document).on("click",".dashboard-edit,.edit-schedule",function(){const id=$(this).data("id");const s=editableSubjects.find(x=>x.id===id);if(!s){toast("Jadwal ini hanya bisa dilihat. Perubahan dilakukan oleh PJ mata kuliah terkait.");return;}loadPage("form-jadwal",{id});});
  $(document).on("input","#scheduleSearch",function(){renderSchedules($(this).val());});
  $(document).on("click","#cancelSchedule",()=>loadPage("jadwal"));
  $(document).on("submit","#scheduleForm",function(e){
    e.preventDefault();if(!validateSchedule())return;
    const s=editableSubjects.find(x=>x.id===editingSubjectId);if(!s || !canEditSubject(s)){toast("Kamu hanya bisa mengubah jadwal mata kuliah yang menjadi tanggung jawabmu.");return;}
    // Data diubah hanya di memori browser, sesuai simulasi tanpa backend.
    s.day=$("#day").val();s.start=$("#startTime").val();s.end=$("#endTime").val();s.room=$("#room").val().trim();s.lecturer=$("#lecturer").val().trim();s.credits=Number($("#credits").val());s.type=$("#subjectType").val();
    toast("Perubahan jadwal tersimpan pada simulasi sesi ini.");loadPage("jadwal");
  });
  $(document).on("click","#goAddTask",()=>{loadPage("tugas");});
  $(document).on("click",".edit-task",function(){loadPage("tugas");setTimeout(()=>setupTaskForm(Number($(this).data("id"))),150);});
  $(document).on("click",".delete-task",function(){const id=Number($(this).data("id"));const t=taskList.find(x=>x.id===id);if(t&&confirm(`Hapus tugas "${t.title}"?`)){taskList=taskList.filter(x=>x.id!==id);renderTasks($("#taskSearch").val()||"");toast("Tugas dihapus dari simulasi.");}});
  $(document).on("input","#taskSearch",function(){renderTasks($(this).val());});
  $(document).on("click","#cancelTask",()=>setupTaskForm(null));
  $(document).on("click","#newTask",()=>setupTaskForm(null));
  $(document).on("submit","#taskForm",function(e){
    e.preventDefault();let ok=true;$("#taskForm .field").removeClass("invalid");$("#taskForm [required]").each(function(){if(!String($(this).val()||"").trim()){$(this).closest(".field").addClass("invalid");ok=false;}});
    const link=$("#taskLink").val().trim();if(link&&!/^https?:\/\//i.test(link)){$("#taskLink").closest(".field").addClass("invalid");$("#taskLink").closest(".field").find(".error-message").text("Gunakan link yang diawali http:// atau https://.");ok=false;}
    if(!ok){toast("Lengkapi form tugas dengan benar.");return;}
    if(!editableSubjects.some(s=>s.name===$("#taskSubject").val())){toast("Tugas hanya bisa dikelola untuk mata kuliah yang menjadi tanggung jawabmu.");return;}
    const id=Number($("#taskId").val()),record={id:id||Date.now(),subject:$("#taskSubject").val(),title:$("#taskTitle").val().trim(),description:$("#taskDescription").val().trim(),deadline:$("#taskDeadline").val(),link};
    if(id)taskList=taskList.map(t=>t.id===id?record:t);else taskList.push(record);
    toast("Tugas tersimpan pada simulasi sesi ini.");loadPage("tugas");
  });
  // Buka dashboard setelah semua konfigurasi dan event siap.
  setUser({name:"Farid Ahmad Santoso", nim:"25091397050"});
});
