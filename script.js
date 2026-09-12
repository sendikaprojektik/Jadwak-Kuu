// ======================================================
// JADWAL KU
// Aplikasi Pengingat Kegiatan Sehari-hari
// ======================================================


// ================= DATA =================

let activities =
    JSON.parse(localStorage.getItem("jadwalKuActivities")) || [];

let currentUser =
    localStorage.getItem("jadwalKuUser");


// ================= ELEMENT =================

const loginPage =
    document.getElementById("loginPage");

const appPage =
    document.getElementById("appPage");

const loginForm =
    document.getElementById("loginForm");

const activityForm =
    document.getElementById("activityForm");

const activityList =
    document.getElementById("activityList");

const allActivityList =
    document.getElementById("allActivityList");

const activityCount =
    document.getElementById("activityCount");

const clock =
    document.getElementById("clock");

const alarmSound =
    document.getElementById("alarmSound");

const notificationBtn =
    document.getElementById("notificationBtn");


// ================= LOGIN =================

function showApp() {

    loginPage.classList.add("hidden");

    appPage.classList.remove("hidden");

    document.getElementById("welcomeText").textContent =
        `Selamat datang 👋 ${currentUser}`;

    setTodayDate();

    setDefaultDate();

    renderActivities();

}


function showLogin() {

    loginPage.classList.remove("hidden");

    appPage.classList.add("hidden");

}


if (currentUser) {

    showApp();

}


// ================= LOGIN FORM =================

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email =
        document.getElementById("emailInput").value.trim();

    if (!email) {

        alert("Masukkan email terlebih dahulu.");

        return;

    }

    currentUser = email;

    localStorage.setItem(
        "jadwalKuUser",
        currentUser
    );

    showApp();

});


// ================= LOGOUT =================

document
    .getElementById("logoutBtn")
    .addEventListener("click", function() {

        localStorage.removeItem("jadwalKuUser");

        currentUser = null;

        showLogin();

    });


// ================= TANGGAL =================

function setDefaultDate() {

    const date =
        new Date();

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    document.getElementById(
        "activityDate"
    ).value =
        `${year}-${month}-${day}`;

}


function setTodayDate() {

    const date =
        new Date();

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    document.getElementById(
        "todayDate"
    ).textContent =
        date.toLocaleDateString(
            "id-ID",
            options
        );

}


// ================= JAM =================

function updateClock() {

    const now =
        new Date();

    const hours =
        String(now.getHours())
            .padStart(2, "0");

    const minutes =
        String(now.getMinutes())
            .padStart(2, "0");

    const seconds =
        String(now.getSeconds())
            .padStart(2, "0");

    clock.textContent =
        `${hours}:${minutes}:${seconds}`;

}


setInterval(updateClock, 1000);

updateClock();


// ================= TAMBAH KEGIATAN =================

activityForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "activityName"
            ).value.trim();

        const date =
            document.getElementById(
                "activityDate"
            ).value;

        const time =
            document.getElementById(
                "activityTime"
            ).value;

        const repeat =
            document.getElementById(
                "repeatType"
            ).value;


        if (!name || !date || !time) {

            alert(
                "Lengkapi semua data kegiatan."
            );

            return;

        }


        const activity = {

            id: Date.now(),

            name: name,

            date: date,

            time: time,

            repeat: repeat,

            completed: false,

            reminder5: false,

            alarmed: false

        };


        activities.push(activity);


        saveActivities();

        renderActivities();


        activityForm.reset();

        setDefaultDate();


        alert(
            "Kegiatan berhasil ditambahkan! ✅"
        );

    }
);


// ================= SIMPAN =================

function saveActivities() {

    localStorage.setItem(
        "jadwalKuActivities",
        JSON.stringify(activities)
    );

}


// ================= NAMA ULANGI =================

function getRepeatText(repeat) {

    if (repeat === "daily") {

        return "🔁 Harian";

    }

    if (repeat === "weekly") {

        return "🔁 Mingguan";

    }

    return "📌 Sesekali";

}


// ================= FORMAT TANGGAL =================

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );

    return date.toLocaleDateString(
        "id-ID",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ================= RENDER =================

function renderActivities() {

    renderTodayActivities();

    renderAllActivities();

}


// ================= KEGIATAN HARI INI =================

function renderTodayActivities() {

    const today =
        getDateString(
            new Date()
        );


    const todayActivities =
        activities.filter(
            activity => {

                return isActivityForToday(
                    activity,
                    today
                );

            }
        );


    activityCount.textContent =
        `${todayActivities.length} kegiatan`;


    if (todayActivities.length === 0) {

        activityList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    💤
                </div>

                <p>
                    Belum ada kegiatan untuk hari ini.
                </p>

            </div>

        `;

        return;

    }


    todayActivities.sort(
        (a, b) =>
            a.time.localeCompare(b.time)
    );


    activityList.innerHTML =
        todayActivities
            .map(
                activity =>
                    createActivityHTML(
                        activity
                    )
            )
            .join("");

}


// ================= SEMUA KEGIATAN =================

function renderAllActivities() {

    if (activities.length === 0) {

        allActivityList.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    📅
                </div>

                <p>
                    Belum ada kegiatan tersimpan.
                </p>

            </div>

        `;

        return;

    }


    const sorted =
        [...activities].sort(
            (a, b) => {

                const dateA =
                    `${a.date} ${a.time}`;

                const dateB =
                    `${b.date} ${b.time}`;

                return dateA.localeCompare(
                    dateB
                );

            }
        );


    allActivityList.innerHTML =
        sorted
            .map(
                activity =>
                    createActivityHTML(
                        activity,
                        true
                    )
            )
            .join("");

}


// ================= HTML KEGIATAN =================

function createActivityHTML(
    activity,
    showDate = false
) {

    const completedClass =
        activity.completed
            ? "completed"
            : "";


    return `

        <div
            class="activity ${completedClass}"
        >

            <div class="activity-left">

                <input
                    type="checkbox"
                    class="check"
                    ${activity.completed ? "checked" : ""}
                    onchange="
                        toggleComplete(${activity.id})
                    "
                >

                <div class="activity-info">

                    <h3>
                        ${escapeHTML(activity.name)}
                    </h3>

                    <p>

                        ${showDate
                            ? "📅 " +
                              formatDate(activity.date) +
                              " • "
                            : ""
                        }

                        ${getRepeatText(
                            activity.repeat
                        )}

                    </p>

                </div>

            </div>


            <div class="activity-time">

                ${activity.time}

            </div>


            <button
                class="delete-btn"
                onclick="
                    deleteActivity(${activity.id})
                "
                title="Hapus kegiatan"
            >

                🗑️

            </button>

        </div>

    `;

}


// ================= CENTANG =================

function toggleComplete(id) {

    const activity =
        activities.find(
            item => item.id === id
        );

    if (!activity) return;

    activity.completed =
        !activity.completed;


    saveActivities();

    renderActivities();

}


// ================= HAPUS =================

function deleteActivity(id) {

    const activity =
        activities.find(
            item => item.id === id
        );


    if (!activity) return;


    const confirmDelete =
        confirm(
            `Hapus kegiatan "${activity.name}"?`
        );


    if (!confirmDelete) return;


    activities =
        activities.filter(
            item => item.id !== id
        );


    saveActivities();

    renderActivities();

}


// ================= CEK HARI =================

function isActivityForToday(
    activity,
    today
) {

    // Sesekali

    if (activity.repeat === "once") {

        return activity.date === today;

    }


    const original =
        new Date(
            activity.date + "T00:00:00"
        );


    const current =
        new Date(
            today + "T00:00:00"
        );


    // Tidak muncul sebelum tanggal awal

    if (current < original) {

        return false;

    }


    // Harian

    if (activity.repeat === "daily") {

        return true;

    }


    // Mingguan

    if (activity.repeat === "weekly") {

        return (
            original.getDay() ===
            current.getDay()
        );

    }


    return false;

}


// ================= TANGGAL STRING =================

function getDateString(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;

}


// ================= NOTIFIKASI =================

notificationBtn.addEventListener(
    "click",
    async function() {

        if (!("Notification" in window)) {

            alert(
                "Browser kamu tidak mendukung notifikasi."
            );

            return;

        }


        const permission =
            await Notification.requestPermission();


        if (permission === "granted") {

            notificationBtn.textContent =
                "🔔 Notifikasi Aktif";

            new Notification(
                "Jadwal Ku",
                {
                    body:
                        "Notifikasi Jadwal Ku berhasil diaktifkan! 🔔"
                }
            );

        } else {

            alert(
                "Notifikasi belum diizinkan."
            );

        }

    }
);


// ================= CEK PENGINGAT =================

function checkReminders() {

    const now =
        new Date();

    const today =
        getDateString(now);


    activities.forEach(
        activity => {

            if (
                !isActivityForToday(
                    activity,
                    today
                )
            ) {

                return;

            }


            const [hours, minutes] =
                activity.time
                    .split(":")
                    .map(Number);


            const activityTime =
                new Date();

            activityTime.setHours(
                hours,
                minutes,
                0,
                0
            );


            const difference =
                activityTime - now;


            // =========================================
            // 5 MENIT SEBELUM KEGIATAN
            // =========================================

            if (
                difference > 0 &&
                difference <= 5 * 60 * 1000 &&
                !activity.reminder5
            ) {

                sendNotification(

                    "⏰ Pengingat Jadwal Ku",

                    `${activity.name} dimulai dalam 5 menit!`

                );


                activity.reminder5 = true;

                saveActivities();

            }


            // =========================================
            // WAKTU KEGIATAN
            // =========================================

            if (
                difference <= 0 &&
                difference > -60 * 1000 &&
                !activity.alarmed
            ) {

                sendNotification(

                    "🚨 WAKTUNYA SEKARANG!",

                    `${activity.name} waktunya dimulai sekarang.`

                );


                playAlarm();


                activity.alarmed = true;

                saveActivities();

            }

        }
    );

}


// ================= NOTIFIKASI =================

function sendNotification(
    title,
    message
) {

    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            title,
            {
                body: message,
                icon: "⏰"
            }
        );

    } else {

        alert(
            `${title}\n\n${message}`
        );

    }

}


// ================= ALARM =================

function playAlarm() {

    alarmSound.currentTime = 0;

    alarmSound.play()
        .catch(
            () => {

                console.log(
                    "Browser memblokir autoplay audio."
                );

            }
        );

}


// ================= ESCAPE HTML =================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ================= RESET REMINDER =================
// Jika hari berganti, reminder/alarm di-reset.

function resetDailyReminderFlags() {

    const today =
        getDateString(
            new Date()
        );


    activities.forEach(
        activity => {

            if (
                activity.lastCheckedDate !==
                today
            ) {

                activity.reminder5 = false;

                activity.alarmed = false;

                activity.lastCheckedDate =
                    today;

            }

        }
    );


    saveActivities();

}


// ================= SISTEM PENGINGAT =================

setInterval(
    function() {

        resetDailyReminderFlags();

        checkReminders();

    },
    1000
);


// Jalankan langsung

resetDailyReminderFlags();

checkReminders();